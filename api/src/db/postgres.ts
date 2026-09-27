import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'mulegraph',
  password: process.env.PG_PASSWORD || 'password',
  port: parseInt(process.env.PG_PORT || '5432', 10),
});

pool.on('error', (err: any) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text, duration, rows: res.rowCount });
  return res;
};

export const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('PostgreSQL Connected:', res.rows[0]);
    return true;
  } catch (err) {
    console.error('PostgreSQL Connection Error:', err);
    return false;
  }
};

export default pool;
