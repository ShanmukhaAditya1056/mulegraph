import { Router, Request, Response } from 'express';
import { query } from '../db/postgres';
import driver from '../db/neo4j';

const router = Router();

// GET /api/accounts/:id
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // 1. Fetch aggregated behavior stats from PostgreSQL
    const inResult = await query(
      `SELECT COUNT(*) as in_tx, SUM(amount) as total_inflow, COUNT(DISTINCT sender_id) as unique_senders 
       FROM transactions WHERE receiver_id = $1`, [id]
    );
    const outResult = await query(
      `SELECT COUNT(*) as out_tx, SUM(amount) as total_outflow, COUNT(DISTINCT receiver_id) as unique_receivers 
       FROM transactions WHERE sender_id = $1`, [id]
    );

    const inData = inResult.rows[0];
    const outData = outResult.rows[0];

    // 2. Fetch Account Details from Neo4j
    const session = driver.session();
    let neo4jData = null;
    try {
      const accResult = await session.run(`MATCH (a:Account {id: $id}) RETURN a.name AS name, a.upi_id AS upi_id, a.is_mule AS is_mule`, { id });
      if (accResult.records.length > 0) {
        neo4jData = accResult.records[0].toObject();
      }
    } finally {
      await session.close();
    }

    res.json({ 
      account_id: id, 
      ...neo4jData,
      stats: {
        total_tx: parseInt(inData.in_tx) + parseInt(outData.out_tx),
        total_inflow: inData.total_inflow || 0,
        total_outflow: outData.total_outflow || 0,
        unique_senders: parseInt(inData.unique_senders),
        unique_receivers: parseInt(outData.unique_receivers),
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/accounts/:id/network
router.get('/:id/network', async (req: Request, res: Response) => {
  const { id } = req.params;
  const session = driver.session();
  try {
    // Query Neo4j for 1-hop neighborhood
    const graphResult = await session.run(
      `MATCH (a:Account {id: $id})-[r]-(b:Account)
       RETURN a, r, b LIMIT 100`,
      { id }
    );
    
    const edges: any[] = [];
    graphResult.records.forEach(record => {
      const a = record.get('a').properties;
      const b = record.get('b').properties;
      const r = record.get('r').properties;
      const rType = record.get('r').type;
      
      const isOutgoing = record.get('r').startNodeElementId === record.get('a').elementId;
      
      const source = isOutgoing ? a : b;
      const target = isOutgoing ? b : a;

      edges.push({
        source: { id: source.id, label: source.upi_id || source.id, isMule: source.is_mule },
        target: { id: target.id, label: target.upi_id || target.id, isMule: target.is_mule },
        amount: r.amount ? `₹${r.amount}` : ''
      });
    });

    res.json({ account_id: id, edges });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Graph DB error' });
  } finally {
    await session.close();
  }
});

// GET /api/accounts/:id/timeline
router.get('/:id/timeline', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await query(
      `SELECT * FROM transactions 
       WHERE sender_id = $1 OR receiver_id = $1 
       ORDER BY timestamp ASC`,
      [id]
    );
    res.json({ account_id: id, timeline: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
