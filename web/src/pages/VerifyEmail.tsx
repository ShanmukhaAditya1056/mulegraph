import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Alert } from '@mui/material';
import { Mail, CheckCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';

const VerifyEmail: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resendDisabled, setResendDisabled] = useState(false);
  const [message, setMessage] = useState('');

  const checkVerificationStatus = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        navigate('/dashboard');
      } else {
        setMessage('Email is not verified yet. Please check your inbox or spam folder.');
      }
    }
  };

  const handleResend = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        setMessage('Verification email sent!');
        setResendDisabled(true);
        setTimeout(() => setResendDisabled(false), 60000); // 60 seconds timeout
      } catch (error: any) {
        setMessage('Error sending email: ' + error.message);
      }
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: '#F4F7FB' }}>
      <Card sx={{ maxWidth: 450, p: 2, textAlign: 'center', borderRadius: 4, boxShadow: '0 10px 40px rgba(11, 23, 38, 0.05)' }}>
        <CardContent>
          <Box sx={{ width: 64, height: 64, bgcolor: 'rgba(7, 154, 154, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
            <Mail size={32} color="#079A9A" />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#0B1726' }}>Verify your email</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 4, px: 2 }}>
            We've sent an email to <strong>{user?.email || 'your address'}</strong>. Please click the link inside to verify your account and gain access to the dashboard.
          </Typography>

          {message && <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>{message}</Alert>}

          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ py: 1.5, mb: 2, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            startIcon={<CheckCircle size={18} />}
            onClick={checkVerificationStatus}
          >
            Check Verification Status
          </Button>

          <Button 
            variant="outlined" 
            fullWidth 
            sx={{ py: 1.5, mb: 4, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            disabled={resendDisabled}
            onClick={handleResend}
          >
            {resendDisabled ? 'Wait 60s to resend' : 'Resend Verification Email'}
          </Button>

          <Button 
            variant="text" 
            color="inherit" 
            startIcon={<LogOut size={16} />}
            onClick={handleSignOut}
            sx={{ textTransform: 'none', color: '#718096' }}
          >
            Sign out and switch account
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VerifyEmail;
