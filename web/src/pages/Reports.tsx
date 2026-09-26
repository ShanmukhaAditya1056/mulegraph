import React from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  Divider,
  useTheme
} from '@mui/material';
import { FileDown, FileText } from 'lucide-react';

const Reports: React.FC = () => {
  const theme = useTheme();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Investigation Report</Typography>
        <Button variant="contained" color="primary" startIcon={<FileDown size={18} />}>
          Download PDF
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <FileText color={theme.palette.primary.main} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Generate Investigation Report</Typography>
              </Box>
              
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1, fontWeight: 500 }}>Account / UPI ID</Typography>
              <TextField 
                fullWidth 
                defaultValue="mule01@upi" 
                size="small"
                variant="outlined"
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                <FormControlLabel
                  control={<Checkbox defaultChecked color="primary" />}
                  label={<Typography variant="body2">Include Network Graph</Typography>}
                />
                <FormControlLabel
                  control={<Checkbox defaultChecked color="primary" />}
                  label={<Typography variant="body2">Include Explanation</Typography>}
                />
              </Box>

              <Typography variant="body2" color="textSecondary" sx={{ mb: 1, fontWeight: 500 }}>Report Format</Typography>
              <FormControl fullWidth size="small" sx={{ mb: 4 }}>
                <Select defaultValue="pdf">
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="csv">CSV Export</MenuItem>
                  <MenuItem value="json">JSON Data</MenuItem>
                </Select>
              </FormControl>

              <Button fullWidth variant="contained" color="primary" size="large">
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box sx={{ 
            bgcolor: '#FFFFFF', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            p: 6,
            minHeight: '800px',
            position: 'relative'
          }}>
            <Typography variant="caption" color="textSecondary" sx={{ position: 'absolute', top: 16, right: 24, fontWeight: 600 }}>Report Preview</Typography>
            
            <Box sx={{ borderBottom: '2px solid #0B1726', pb: 2, mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#0B1726' }}>MuleGraph AI Investigation Report</Typography>
              <Typography variant="body2" color="textSecondary">Generated on 27 Sep 2026, 11:30 AM</Typography>
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#0B1726' }}>Executive Summary</Typography>
                <Grid container spacing={1} sx={{ mb: 3 }}>
                  <Grid item xs={6}><Typography variant="body2" color="textSecondary">UPI ID</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body2" sx={{ fontWeight: 600 }}>mule01@upi</Typography></Grid>
                  
                  <Grid item xs={6}><Typography variant="body2" color="textSecondary">Risk Score</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.error.main }}>86/100</Typography></Grid>
                  
                  <Grid item xs={6}><Typography variant="body2" color="textSecondary">Risk Level</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.error.main }}>High</Typography></Grid>
                  
                  <Grid item xs={6}><Typography variant="body2" color="textSecondary">Total Transactions</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body2" sx={{ fontWeight: 600 }}>284</Typography></Grid>
                  
                  <Grid item xs={6}><Typography variant="body2" color="textSecondary">Unique Senders</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body2" sx={{ fontWeight: 600 }}>67</Typography></Grid>
                  
                  <Grid item xs={6}><Typography variant="body2" color="textSecondary">Network Hops</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body2" sx={{ fontWeight: 600 }}>4</Typography></Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#0B1726' }}>Key Findings</Typography>
                <Box component="ul" sx={{ pl: 2, m: 0, '& li': { mb: 1, fontSize: '0.875rem' } }}>
                  <li>High transaction velocity</li>
                  <li>Multiple incoming sources (67)</li>
                  <li>Rapid onward transfers</li>
                  <li>Connected to 12 suspicious accounts</li>
                  <li>Unusual network structure</li>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3, color: '#0B1726' }}>Network Visualization</Typography>
            <Box sx={{ height: 300, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Typography variant="body2" color="textSecondary">[ Network Graph Export ]</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
