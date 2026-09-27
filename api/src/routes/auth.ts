import { Router } from 'express';
import { adminAuth } from '../config/firebase';

const router = Router();

// Create session cookie
router.post('/sessionLogin', async (req, res) => {
  const idToken = req.body.idToken?.toString();
  
  if (!idToken) {
    return res.status(401).send('UNAUTHORIZED REQUEST!');
  }

  const expiresIn = 15 * 60 * 1000; // 15 minutes

  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    const options = { maxAge: expiresIn, httpOnly: true, secure: true, sameSite: 'strict' as const };
    res.cookie('session', sessionCookie, options);
    res.end(JSON.stringify({ status: 'success' }));
  } catch (error) {
    res.status(401).send('UNAUTHORIZED REQUEST!');
  }
});

// Clear session cookie
router.post('/sessionLogout', (req, res) => {
  res.clearCookie('session');
  res.end(JSON.stringify({ status: 'success' }));
});

export default router;
