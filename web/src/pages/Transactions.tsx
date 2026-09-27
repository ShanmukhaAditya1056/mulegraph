import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TablePagination, TextField, InputAdornment, Chip, IconButton 
} from '@mui/material';
import { Search, Filter, Download, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0); // MUI pagination is 0-indexed
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState(''); // Debounced state

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(0); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // API expects 1-indexed page
      const res = await axios.get(`http://localhost:5000/api/transactions`, {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: searchQuery
        },
        withCredentials: true
      });
      setTransactions(res.data.transactions);
      setTotalRows(res.data.total);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, rowsPerPage, searchQuery]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getRiskChip = (risk: string) => {
    if (risk === 'High') return <Chip label="High Risk" size="small" sx={{ bgcolor: '#FEE2E2', color: '#B91C1C', fontWeight: 600, height: 24 }} icon={<AlertTriangle size={14} />} />;
    if (risk === 'Medium') return <Chip label="Medium Risk" size="small" sx={{ bgcolor: '#FEF3C7', color: '#D97706', fontWeight: 600, height: 24 }} icon={<Clock size={14} />} />;
    return <Chip label="Low Risk" size="small" sx={{ bgcolor: '#D1FAE5', color: '#047857', fontWeight: 600, height: 24 }} icon={<CheckCircle size={14} />} />;
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F172A', mb: 0.5 }}>Transactions</Typography>
          <Typography variant="body2" color="text.secondary">Monitor and filter all real-time financial flows across the network.</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search TXN ID or Accounts..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{ bgcolor: '#fff', borderRadius: 1, width: 300 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} />
                  </InputAdornment>
                )
              }
            }}
          />
          <IconButton sx={{ bgcolor: '#fff', border: '1px solid #E2E8F0', borderRadius: 1 }}><Filter size={18}/></IconButton>
          <IconButton sx={{ bgcolor: '#fff', border: '1px solid #E2E8F0', borderRadius: 1 }}><Download size={18}/></IconButton>
        </Box>
      </Box>

      <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #E2E8F0' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="transactions table">
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Transaction ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Date & Time</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Sender Account</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Receiver Account</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Amount (INR)</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Risk Level</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>Loading transactions...</TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>No transactions found for "{searchQuery}"</TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow key={tx.transaction_id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{tx.transaction_id}</TableCell>
                    <TableCell>{new Date(tx.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{tx.sender_id}</TableCell>
                    <TableCell>{tx.receiver_id}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>₹{parseFloat(tx.amount).toLocaleString()}</TableCell>
                    <TableCell>{getRiskChip(tx.risk_level)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalRows}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </Card>
    </Box>
  );
};

export default Transactions;
