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
    const result = await query('SELECT * FROM incidents ORDER BY created_at DESC LIMIT 50');
    res.json(result.rows);
  } catch (err) {
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
