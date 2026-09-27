import { Router, Request, Response } from 'express';
import { query } from '../db/postgres';
import driver from '../db/neo4j';

const router = Router();

// GET /api/dashboard/stats
router.get('/stats', async (req: Request, res: Response) => {
  try {
    // Total Transactions from PG
    const txResult = await query('SELECT COUNT(*) as count FROM transactions', []);
    const totalTransactions = parseInt(txResult.rows[0].count);

    // Get Account Stats from Neo4j
    const session = driver.session();
    let totalAccounts = 0;
    let riskAccounts = 0;
    
    try {
      const accResult = await session.run(`MATCH (a:Account) RETURN COUNT(a) as total`);
      totalAccounts = accResult.records[0].get('total').toNumber();
      
      const riskResult = await session.run(`MATCH (a:Account {is_mule: true}) RETURN COUNT(a) as risk`);
      riskAccounts = riskResult.records[0].get('risk').toNumber();
    } finally {
      await session.close();
    }

    res.json({
      kpis: {
        totalTransactions,
        totalAccounts,
        riskAccounts,
        suspiciousNetworks: Math.floor(riskAccounts / 3) // Placeholder proxy
      }
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/dashboard/recent-transactions
router.get('/recent-transactions', async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT transaction_id, sender_id, receiver_id, amount, timestamp, upi_id 
       FROM transactions ORDER BY timestamp DESC LIMIT 5`,
      []
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
