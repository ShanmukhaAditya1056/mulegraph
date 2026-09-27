import { Request, Response, NextFunction } from 'express';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin (requires serviceAccountKey.json path in .env)
if (!getApps().length) {
  try {
    const serviceAccountPath = process.env.FIREBASE_CREDENTIALS_PATH;
    if (serviceAccountPath) {
      initializeApp({
        credential: cert(require('../../' + serviceAccountPath)),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
      console.log('Firebase Admin Initialized successfully.');
    } else {
      console.warn('FIREBASE_CREDENTIALS_PATH not found in .env, Auth middleware will fail.');
    }
  } catch (err) {
    console.error('Failed to initialize Firebase Admin:', err);
  }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];
  
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    // Attach user payload to request
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
