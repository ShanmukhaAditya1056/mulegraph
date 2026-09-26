import React from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  TextField,
  Button,
  Chip,
  Divider,
  useTheme
} from '@mui/material';
import { Network } from 'lucide-react';

const NetworkGraph: React.FC = () => {
  const theme = useTheme();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Network Graph Explorer</Typography>
      </Box>

      <Card sx={{ mb: 4, p: 1 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField 
            fullWidth 
            placeholder="Enter UPI ID or Account ID" 
            size="small"
            variant="outlined"
          />
          <Button variant="contained" color="primary" sx={{ px: 4 }}>
            Search
          </Button>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ flexBasis: { xs: '100%', md: '65%' }, maxWidth: { xs: '100%', md: '65%' } }}>
          <Card sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 4, borderBottom: '1px solid #E2E8F0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: theme.palette.error.main }} />
                <Typography variant="body2">Target Account</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: theme.palette.primary.main }} />
                <Typography variant="body2">Connected Account</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: theme.palette.warning.main }} />
                <Typography variant="body2">Suspicious Account</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: theme.palette.success.main }} />
                <Typography variant="body2">Normal Account</Typography>
              </Box>
            </Box>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F8FAFC' }}>
              {/* Placeholder for Cytoscape.js canvas */}
              <Box sx={{ textAlign: 'center', color: theme.palette.text.secondary }}>
                <Network size={64} style={{ opacity: 0.2, marginBottom: 16 }} />
                <Typography>Interactive network graph rendering area.</Typography>
              </Box>
            </Box>
          </Card>
        </Box>

        <Box sx={{ flexBasis: { xs: '100%', md: '35%' }, maxWidth: { xs: '100%', md: '35%' } }}>
          <Card sx={{ height: '600px' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Node Details</Typography>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>mule01@upi</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                  <Chip label="High Risk" size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'rgba(224, 82, 82, 0.1)', color: '#E05252', fontWeight: 600 }} />
                  <Chip label="UPI Account" size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'rgba(11, 23, 38, 0.1)', color: '#0B1726', fontWeight: 600 }} />
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" color="textSecondary">Transactions</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>284</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" color="textSecondary">Incoming</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>67</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" color="textSecondary">Outgoing</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>42</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, mt: 3 }}>
                <Typography variant="body2" color="textSecondary">Total Amount</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>₹1,24,000</Typography>
              </Box>

            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default NetworkGraph;
