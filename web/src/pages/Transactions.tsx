import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Select,
  FormControl,
  useTheme
} from '@mui/material';

const transactions = [
  { id: '1', txId: 'TXN001', date: '27 Sep 2026 10:30', sender: 'user123@okbsi', receiver: 'mule01@upi', amount: '₹5,000', risk: 'High', status: 'Success' },
  { id: '2', txId: 'TXN002', date: '27 Sep 2026 09:12', sender: 'paytmuser@ibl', receiver: 'mule01@upi', amount: '₹2,000', risk: 'Medium', status: 'Success' },
  { id: '3', txId: 'TXN003', date: '27 Sep 2026 08:45', sender: 'onlinejob@upi', receiver: 'mule01@upi', amount: '₹1,500', risk: 'High', status: 'Success' },
  { id: '4', txId: 'TXN004', date: '26 Sep 2026 17:30', sender: 'student@okbsi', receiver: 'mule01@upi', amount: '₹800', risk: 'Low', status: 'Success' },
  { id: '5', txId: 'TXN005', date: '26 Sep 2026 15:20', sender: 'friend@upi', receiver: 'mule01@upi', amount: '₹4,200', risk: 'Medium', status: 'Success' },
];

const Transactions: React.FC = () => {
  const theme = useTheme();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Transaction Explorer</Typography>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField 
            sx={{ flex: 2 }}
            placeholder="Search transactions..." 
            size="small"
            variant="outlined"
          />
          <FormControl sx={{ minWidth: 150 }} size="small">
            <Select defaultValue="7days">
              <MenuItem value="7days">Last 7 Days</MenuItem>
              <MenuItem value="30days">Last 30 Days</MenuItem>
              <MenuItem value="all">All Time</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }} size="small">
            <Select defaultValue="all">
              <MenuItem value="all">All Risk</MenuItem>
              <MenuItem value="high">High Risk</MenuItem>
              <MenuItem value="medium">Medium Risk</MenuItem>
              <MenuItem value="low">Low Risk</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }} size="small">
            <Select defaultValue="all">
              <MenuItem value="all">All Accounts</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" sx={{ px: 4 }}>
            Search
          </Button>
        </CardContent>
      </Card>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: theme.palette.text.secondary }}>Txn ID</TableCell>
                <TableCell sx={{ color: theme.palette.text.secondary }}>Date</TableCell>
                <TableCell sx={{ color: theme.palette.text.secondary }}>Sender</TableCell>
                <TableCell sx={{ color: theme.palette.text.secondary }}>Receiver</TableCell>
                <TableCell sx={{ color: theme.palette.text.secondary }}>Amount</TableCell>
                <TableCell sx={{ color: theme.palette.text.secondary }}>Risk</TableCell>
                <TableCell sx={{ color: theme.palette.text.secondary }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ fontWeight: 500, color: theme.palette.secondary.main }}>{row.txId}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.sender}</TableCell>
                  <TableCell>{row.receiver}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{row.amount}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.risk} 
                      size="small" 
                      sx={{ 
                        bgcolor: row.risk === 'High' ? 'rgba(224, 82, 82, 0.1)' : row.risk === 'Medium' ? 'rgba(217, 150, 33, 0.1)' : 'rgba(46, 155, 98, 0.1)',
                        color: row.risk === 'High' ? '#E05252' : row.risk === 'Medium' ? '#D99621' : '#2E9B62',
                        fontWeight: 600,
                        borderRadius: 1
                      }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={row.status} 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(46, 155, 98, 0.1)',
                        color: '#2E9B62',
                        fontWeight: 600,
                        borderRadius: 1
                      }} 
                    />
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

export default Transactions;
