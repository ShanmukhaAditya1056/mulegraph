import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Divider, useTheme, Snackbar, Alert } from '@mui/material';
import { Database, UploadCloud, Play, StopCircle } from 'lucide-react';
import axios from 'axios';

const DatasetManagement: React.FC = () => {
  const theme = useTheme();
  const [simulating, setSimulating] = useState(false);
  const [toast, setToast] = useState('');

  const toggleSimulation = async (start: boolean) => {
    try {
      if (start) {
        await axios.post('http://localhost:5000/api/simulate/start', {}, { withCredentials: true });
        setSimulating(true);
        setToast('Live fraud simulation started. Check the Dashboard!');
      } else {
        await axios.post('http://localhost:5000/api/simulate/stop', {}, { withCredentials: true });
        setSimulating(false);
        setToast('Live fraud simulation stopped.');
      }
    } catch (err) {
      console.error('Failed to toggle simulation', err);
      setToast('Failed to connect to API.');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Database color={theme.palette.primary.main} /> Dataset Management
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
          Manage synthetic UPI datasets and Live Simulation modes.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Box sx={{ mb: 3, mx: 'auto', width: 64, height: 64, borderRadius: '50%', bgcolor: 'rgba(7, 154, 154, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UploadCloud size={32} color={theme.palette.primary.main} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Upload Synthetic Data</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
              Upload CSV datasets containing synthetic UPI transactions for model retraining or baseline testing.
            </Typography>
            <Button variant="outlined" fullWidth size="large">Select File</Button>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, border: `2px solid ${simulating ? theme.palette.error.main : theme.palette.divider}` }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: simulating ? theme.palette.error.main : 'inherit', mb: 1 }}>
              Live Simulation Mode {simulating && '(ACTIVE)'}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 4, height: 40 }}>
              Inject synthetic task-scam and investment-scam flows into the transaction stream to demonstrate real-time graph updating.
            </Typography>
            
            <Divider sx={{ mb: 4 }} />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                color="error" 
                fullWidth 
                startIcon={<Play size={18} />}
                onClick={() => toggleSimulation(true)}
                disabled={simulating}
              >
                Start Fraud Simulation
              </Button>
              <Button 
                variant="outlined" 
                color="inherit" 
                fullWidth 
                startIcon={<StopCircle size={18} />}
                onClick={() => toggleSimulation(false)}
                disabled={!simulating}
              >
                Stop Stream
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Snackbar 
        open={!!toast} 
        autoHideDuration={4000} 
        onClose={() => setToast('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setToast('')} severity={simulating ? "error" : "success"} sx={{ width: '100%', borderRadius: 2 }}>
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DatasetManagement;
