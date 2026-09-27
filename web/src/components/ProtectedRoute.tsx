import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute: React.FC = () => {
  const { user, isVerified, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: '#F4F7FB' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Condition 1: No User
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Condition 2: Unverified User
  if (user && !isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Condition 3: Verified User
  return <Outlet />;
};

export default ProtectedRoute;
