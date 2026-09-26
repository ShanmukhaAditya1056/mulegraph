import { Router, Request, Response } from 'express';
import { query } from '../db/postgres';
import driver from '../db/neo4j';

const router = Router();

// GET /api/accounts/:id
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Fetch aggregated behavior stats from PostgreSQL
    const result = await query(
      `SELECT COUNT(*) as tx_count, SUM(amount) as total_volume 
       FROM transactions WHERE sender_id = $1 OR receiver_id = $1`,
      [id]
    );
    res.json({ account_id: id, stats: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/accounts/:id/network
router.get('/:id/network', async (req: Request, res: Response) => {
  const { id } = req.params;
  const session = driver.session();
  try {
    // Query Neo4j for 2-hop neighborhood
    const graphResult = await session.run(
      `MATCH (a:Account {id: $id})-[r1]-(b:Account)
       OPTIONAL MATCH (b)-[r2]-(c:Account)
       WHERE c.id <> $id
       RETURN a, r1, b, r2, c LIMIT 50`,
      { id }
    );
    // Placeholder formatting
    res.json({ account_id: id, nodes: graphResult.records.length });
  } catch (error) {
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
