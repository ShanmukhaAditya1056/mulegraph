import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // Strict origin for frontend
  credentials: true, // Allow cookies
}));
app.use(express.json());

// Global Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, 
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Basic health check route
import { testConnection } from './db/postgres';
import { testNeo4jConnection } from './db/neo4j';
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import transactionRoutes from './routes/transactions';
import accountRoutes from './routes/accounts';
import incidentRoutes from './routes/incidents';
import { startSimulation, stopSimulation } from './services/simulator';

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'MuleGraph API' });
});

// Simulation routes
app.post('/api/simulate/start', (req: Request, res: Response) => {
  startSimulation();
  res.json({ message: 'Simulation started' });
});

app.post('/api/simulate/stop', (req: Request, res: Response) => {
  stopSimulation();
  res.json({ message: 'Simulation stopped' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/incidents', incidentRoutes);

import { createServer } from 'http';
import { Server } from 'socket.io';

const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const startServer = async () => {
  // Test Database Connections
  await testConnection();
  await testNeo4jConnection();

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
