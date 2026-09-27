import React, { useState, useEffect } from 'react';
import { 
  Box, Card, Typography, Chip, Button, useTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, InputAdornment, TextField, TablePagination, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Briefcase, Search, Filter, Eye, AlertCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const getStatusColor = (status: string) => {
  if (!status) return { bg: '#F1F5F9', color: '#64748B' };
  switch (status.toLowerCase()) {
    case 'open': return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' };
    case 'in progress': return { bg: 'rgba(217, 150, 33, 0.1)', color: '#D99621' };
    case 'closed': return { bg: 'rgba(46, 155, 98, 0.1)', color: '#2E9B62' };
    default: return { bg: '#F1F5F9', color: '#64748B' };
  }
};

const getRiskColor = (risk: string) => {
  if (!risk) return { bg: '#F1F5F9', color: '#64748B' };
  switch (risk.toLowerCase()) {
    case 'critical': return { bg: '#E05252', color: '#FFFFFF' };
    case 'high': return { bg: 'rgba(224, 82, 82, 0.1)', color: '#E05252' };
    case 'medium': return { bg: 'rgba(217, 150, 33, 0.1)', color: '#D99621' };
    case 'low': return { bg: 'rgba(46, 155, 98, 0.1)', color: '#2E9B62' };
    default: return { bg: '#F1F5F9', color: '#64748B' };
  }
};

const Cases: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Filters State
  const [statusFilter, setStatusFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  
  // Menu anchors
  const [statusAnchor, setStatusAnchor] = useState<null | HTMLElement>(null);
  const [riskAnchor, setRiskAnchor] = useState<null | HTMLElement>(null);

  // Dialog state
  const [createOpen, setCreateOpen] = useState(false);
  const [newCase, setNewCase] = useState({ user_id: '', incident_type: '', description: '', reported_amount: '' });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/incidents`, {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: searchQuery,
          status: statusFilter,
          risk: riskFilter
        },
        withCredentials: true
      });
      setCases(res.data.cases);
      setTotalRows(res.data.total);
    } catch (err) {
      console.error('Failed to fetch cases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [page, rowsPerPage, searchQuery, statusFilter, riskFilter]);

  const handleCreateCase = async () => {
    try {
      await axios.post('http://localhost:5000/api/incidents', newCase, { withCredentials: true });
      setCreateOpen(false);
      setNewCase({ user_id: '', incident_type: '', description: '', reported_amount: '' });
      fetchCases();
    } catch (err) {
      console.error('Failed to create case', err);
    }
  };

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
        <Button variant="contained" color="primary" sx={{ px: 3 }} startIcon={<Plus size={18} />} onClick={() => setCreateOpen(true)}>
          Create Manual Case
        </Button>
      </Box>

      <Card sx={{ mb: 4 }}>
        <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', borderBottom: '1px solid #E2E8F0', bgcolor: '#F8FAFC' }}>
          <TextField
            size="small"
            placeholder="Search Case ID or Reporter..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
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
          <Button 
            variant="outlined" 
            startIcon={<Filter size={16} />} 
            sx={{ bgcolor: '#FFFFFF', minWidth: 150 }}
            onClick={(e) => setStatusAnchor(e.currentTarget)}
          >
            {statusFilter === 'All' ? 'Filter Status' : statusFilter}
          </Button>
          <Menu anchorEl={statusAnchor} open={Boolean(statusAnchor)} onClose={() => setStatusAnchor(null)}>
            {['All', 'Open', 'In Progress', 'Closed'].map(st => (
              <MenuItem key={st} onClick={() => { setStatusFilter(st); setStatusAnchor(null); setPage(0); }}>
                {st}
              </MenuItem>
            ))}
          </Menu>

          <Button 
            variant="outlined" 
            startIcon={<AlertCircle size={16} />} 
            sx={{ bgcolor: '#FFFFFF', minWidth: 150 }}
            onClick={(e) => setRiskAnchor(e.currentTarget)}
          >
            {riskFilter === 'All' ? 'Risk Level' : riskFilter}
          </Button>
          <Menu anchorEl={riskAnchor} open={Boolean(riskAnchor)} onClose={() => setRiskAnchor(null)}>
            {['All', 'Critical', 'High', 'Medium', 'Low'].map(rk => (
              <MenuItem key={rk} onClick={() => { setRiskFilter(rk); setRiskAnchor(null); setPage(0); }}>
                {rk}
              </MenuItem>
            ))}
          </Menu>
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>Loading cases...</TableCell>
                </TableRow>
              ) : cases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>No cases found.</TableCell>
                </TableRow>
              ) : (
                cases.map((row) => (
                  <TableRow key={row.case_id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#F8FAFC' } }}>
                    <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>{row.case_id}</TableCell>
                    <TableCell>{row.user_id}</TableCell>
                    <TableCell>{row.incident_type}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>₹{parseFloat(row.reported_amount).toLocaleString()}</TableCell>
                    <TableCell sx={{ color: '#64748B' }}>{new Date(row.created_at).toLocaleDateString()}</TableCell>
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
                        label={row.risk_level} 
                        size="small" 
                        sx={{ 
                          bgcolor: getRiskColor(row.risk_level).bg, 
                          color: getRiskColor(row.risk_level).color, 
                          fontWeight: row.risk_level === 'Critical' ? 700 : 600,
                          fontSize: '0.75rem',
                          border: row.risk_level === 'Critical' ? 'none' : '1px solid transparent'
                        }} 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button 
                        variant="outlined" 
                        size="small" 
                        startIcon={<Eye size={14} />}
                        onClick={() => navigate(`/investigations/${row.user_id}`)}
                        sx={{ py: 0.5 }}
                      >
                        Review
                      </Button>
                    </TableCell>
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
          onPageChange={(e, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </Card>

      {/* Create Case Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create Manual Case</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="User / Entity ID" fullWidth value={newCase.user_id} onChange={(e) => setNewCase({...newCase, user_id: e.target.value})} />
          <TextField label="Incident Type" fullWidth value={newCase.incident_type} onChange={(e) => setNewCase({...newCase, incident_type: e.target.value})} />
          <TextField label="Description" fullWidth multiline rows={3} value={newCase.description} onChange={(e) => setNewCase({...newCase, description: e.target.value})} />
          <TextField label="Reported Amount (₹)" fullWidth type="number" value={newCase.reported_amount} onChange={(e) => setNewCase({...newCase, reported_amount: e.target.value})} />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setCreateOpen(false)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleCreateCase}>Create Case</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Cases;
