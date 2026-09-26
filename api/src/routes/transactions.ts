import { Router, Request, Response } from 'express';
import { query } from '../db/postgres';
import driver from '../db/neo4j';

const router = Router();

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
