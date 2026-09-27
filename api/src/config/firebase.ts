import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

let serviceAccount: any;
if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
  serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8'));
} else {
  serviceAccount = require(path.resolve(__dirname, '../../config/serviceAccountKey.json'));
}

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

export const adminAuth = getAuth();
