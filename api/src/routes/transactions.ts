import { Router, Request, Response } from 'express';
import { query } from '../db/postgres';
import driver from '../db/neo4j';

const router = Router();

// GET /api/transactions
// Fetches paginated, searchable transactions
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string || '';
    const offset = (page - 1) * limit;

    let queryStr = `
      SELECT t.*, 
        CASE WHEN t.amount > 100000 THEN 'High'
             WHEN t.amount > 50000 THEN 'Medium'
             ELSE 'Low' END as risk_level
      FROM transactions t
    `;
    const params: any[] = [];
    let countQueryStr = `SELECT COUNT(*) FROM transactions t`;

    if (search) {
      queryStr += ` WHERE t.transaction_id ILIKE $1 OR t.sender_id ILIKE $1 OR t.receiver_id ILIKE $1`;
      countQueryStr += ` WHERE t.transaction_id ILIKE $1 OR t.sender_id ILIKE $1 OR t.receiver_id ILIKE $1`;
      params.push(`%${search}%`);
    }

    queryStr += ` ORDER BY t.timestamp DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    
    const [txResult, countResult] = await Promise.all([
      query(queryStr, [...params, limit, offset]),
      query(countQueryStr, params)
    ]);

    res.json({
      transactions: txResult.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      limit,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    });
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// POST /api/transactions/analyze
// Ingests transaction, updates graph, calls ML inference service
router.post('/analyze', async (req: Request, res: Response) => {
  const { sender_id, receiver_id, amount, timestamp, upi_id } = req.body;

  try {
    // 1. Insert into PostgreSQL
    const pgResult = await query(
      `INSERT INTO transactions (transaction_id, sender_id, receiver_id, amount, timestamp, upi_id) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [`TXN-${Date.now()}`, sender_id, receiver_id, amount, timestamp || new Date(), upi_id]
    );

    // 2. Insert into Neo4j
    const session = driver.session();
    try {
      await session.run(
        `MERGE (s:Account {id: $sender_id})
         MERGE (r:Account {id: $receiver_id})
         CREATE (s)-[:SENT {amount: $amount, timestamp: $timestamp}]->(r)`,
        { sender_id, receiver_id, amount, timestamp: timestamp || new Date().toISOString() }
      );
    } finally {
      await session.close();
    }

    // 3. (Future) Call Python FastAPI ML Service
    // const mlResponse = await axios.post('http://localhost:8000/ml/predict', { ... })

    res.status(200).json({ 
      status: 'analyzed', 
      transaction: pgResult.rows[0],
      risk_evaluation: 'Pending (ML Service Disconnected)' 
    });
  } catch (error: any) {
    console.error('Transaction analysis error:', error);
    res.status(500).json({ error: 'Server error during analysis' });
  }
});

export default router;
