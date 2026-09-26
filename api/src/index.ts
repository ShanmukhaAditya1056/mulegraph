import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check route
import { testConnection } from './db/postgres';
import { testNeo4jConnection } from './db/neo4j';
import transactionRoutes from './routes/transactions';
import accountRoutes from './routes/accounts';
import incidentRoutes from './routes/incidents';

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'MuleGraph API' });
});

// API Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/incidents', incidentRoutes);

const startServer = async () => {
  // Test Database Connections
  await testConnection();
  await testNeo4jConnection();

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
