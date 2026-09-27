import fs from 'fs';
import path from 'path';
import pool from '../src/db/postgres';

const initDB = async () => {
  try {
    console.log('Connecting to PostgreSQL...');
    const schemaPath = path.join(__dirname, '../db/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema.sql...');
    await pool.query(schemaSql);
    
    console.log('Successfully created all tables in the mulegraph database!');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  } finally {
    await pool.end();
  }
};

initDB();
