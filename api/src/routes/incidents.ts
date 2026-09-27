import { Router, Request, Response } from 'express';
import { query } from '../db/postgres';

const router = Router();

// POST /api/incidents
router.post('/', async (req: Request, res: Response) => {
  const { user_id, incident_type, description, reported_amount } = req.body;
  try {
    const result = await query(
      `INSERT INTO incidents (case_id, user_id, incident_type, description, reported_amount) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [`CAS-${Math.floor(1000 + Math.random() * 9000)}`, user_id, incident_type, description, reported_amount]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create incident' });
  }
});

// GET /api/incidents
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string || '';
    const status = req.query.status as string || '';
    const risk = req.query.risk as string || '';
    const offset = (page - 1) * limit;

    const baseCTE = `
      WITH RankedIncidents AS (
        SELECT *, 
          CASE WHEN reported_amount > 100000 THEN 'Critical'
               WHEN reported_amount > 50000 THEN 'High'
               WHEN reported_amount > 10000 THEN 'Medium'
               ELSE 'Low' END as risk_level
        FROM incidents
      )
    `;

    let queryStr = `${baseCTE} SELECT * FROM RankedIncidents WHERE 1=1`;
    let countQueryStr = `${baseCTE} SELECT COUNT(*) FROM RankedIncidents WHERE 1=1`;
    const params: any[] = [];

    if (search) {
      params.push(`%${search}%`);
      queryStr += ` AND (case_id ILIKE $${params.length} OR user_id ILIKE $${params.length} OR incident_type ILIKE $${params.length})`;
      countQueryStr += ` AND (case_id ILIKE $${params.length} OR user_id ILIKE $${params.length} OR incident_type ILIKE $${params.length})`;
    }
    
    if (status && status !== 'All') {
      params.push(status);
      queryStr += ` AND status ILIKE $${params.length}`;
      countQueryStr += ` AND status ILIKE $${params.length}`;
    }
    
    if (risk && risk !== 'All') {
      params.push(risk);
      queryStr += ` AND risk_level ILIKE $${params.length}`;
      countQueryStr += ` AND risk_level ILIKE $${params.length}`;
    }

    queryStr += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    
    const [result, countResult] = await Promise.all([
      query(queryStr, [...params, limit, offset]),
      query(countQueryStr, params)
    ]);

    res.json({
      cases: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      limit,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    });
  } catch (err) {
    console.error('Database error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/incidents/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM incidents WHERE case_id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/incidents/:id/evidence
router.post('/:id/evidence', async (req: Request, res: Response) => {
  // Mock endpoint for handling evidence hashing and storage
  res.status(201).json({ status: 'evidence_uploaded', hash: 'e3b0c44298fc...' });
});

export default router;
