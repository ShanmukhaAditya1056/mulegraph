import React from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Chip,
  Button,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  TextField
} from '@mui/material';
import { Briefcase, Search, Filter, Eye, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockCases = [
  { id: 'CAS-8821', reporter: 'User_492', type: 'Task Scam', amount: '₹12,500', date: '2026-10-12', status: 'Open', risk: 'High' },
  { id: 'CAS-8820', reporter: 'User_115', type: 'Investment Fraud', amount: '₹45,000', date: '2026-10-12', status: 'In Progress', risk: 'Critical' },
  { id: 'CAS-8819', reporter: 'User_903', type: 'Unknown Transfer', amount: '₹2,000', date: '2026-10-11', status: 'Closed', risk: 'Low' },
  { id: 'CAS-8818', reporter: 'User_274', type: 'Task Scam', amount: '₹8,400', date: '2026-10-10', status: 'Open', risk: 'Medium' },
  { id: 'CAS-8817', reporter: 'User_661', type: 'Account Takeover', amount: '₹1,50,000', date: '2026-10-09', status: 'In Progress', risk: 'Critical' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Open': return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' };
    case 'In Progress': return { bg: 'rgba(217, 150, 33, 0.1)', color: '#D99621' };
    case 'Closed': return { bg: 'rgba(46, 155, 98, 0.1)', color: '#2E9B62' };
    default: return { bg: '#F1F5F9', color: '#64748B' };
  }
};

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'Critical': return { bg: '#E05252', color: '#FFFFFF' };
    case 'High': return { bg: 'rgba(224, 82, 82, 0.1)', color: '#E05252' };
    case 'Medium': return { bg: 'rgba(217, 150, 33, 0.1)', color: '#D99621' };
    case 'Low': return { bg: 'rgba(46, 155, 98, 0.1)', color: '#2E9B62' };
    default: return { bg: '#F1F5F9', color: '#64748B' };
  }
};

const Cases: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Briefcase color={theme.palette.primary.main} /> Incident Cases
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
            Manage and investigate user-reported fraud incidents.
          </Typography>
        </Box>
        <Button variant="contained" color="primary" sx={{ px: 3 }}>
          + Create Manual Case
        </Button>
      </Box>

      <Card sx={{ mb: 4 }}>
        <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', borderBottom: '1px solid #E2E8F0', bgcolor: '#F8FAFC' }}>
          <TextField
            size="small"
            placeholder="Search Case ID or Reporter..."
            sx={{ width: 300, '& .MuiOutlinedInput-root': { bgcolor: '#FFFFFF' } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} color={theme.palette.text.secondary} />
                  </InputAdornment>
                )
              }
            }}
          />
          <Button variant="outlined" startIcon={<Filter size={16} />} sx={{ bgcolor: '#FFFFFF' }}>
            Filter Status
          </Button>
          <Button variant="outlined" startIcon={<AlertCircle size={16} />} sx={{ bgcolor: '#FFFFFF' }}>
            Risk Level
          </Button>
        </Box>

        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: '#F1F5F9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Case ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Reporter</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Incident Type</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Reported Amount</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Date Filed</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>AI Risk</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#475569' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockCases.map((row) => (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#F8FAFC' } }}>
                  <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>{row.id}</TableCell>
                  <TableCell>{row.reporter}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{row.amount}</TableCell>
                  <TableCell sx={{ color: '#64748B' }}>{row.date}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.status} 
                      size="small" 
                      sx={{ 
                        bgcolor: getStatusColor(row.status).bg, 
                        color: getStatusColor(row.status).color, 
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={row.risk} 
                      size="small" 
                      sx={{ 
                        bgcolor: getRiskColor(row.risk).bg, 
                        color: getRiskColor(row.risk).color, 
                        fontWeight: row.risk === 'Critical' ? 700 : 600,
                        fontSize: '0.75rem',
                        border: row.risk === 'Critical' ? 'none' : '1px solid transparent'
                      }} 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button 
                      variant="outlined" 
                      size="small" 
                      startIcon={<Eye size={14} />}
                      onClick={() => navigate('/investigations')}
                      sx={{ py: 0.5 }}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default Cases;
