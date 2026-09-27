import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const GuestGuard: React.FC = () => {
  const { user, isVerified, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: '#F4F7FB' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If user is already logged in and verified, kick them to dashboard
  if (user && isVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, let them see the guest page (Login, Register, etc.)
  return <Outlet />;
};

export default GuestGuard;
