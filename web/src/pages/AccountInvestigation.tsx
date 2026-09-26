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
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Divider,
  useTheme
} from '@mui/material';
import { Search, User, ShieldAlert } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const recentTransactions = [
  { id: '1', txId: 'TXN001', date: '27 Sep 2026 10:30', sender: 'user123@okbsi', receiver: 'mule01@upi', amount: '₹5,000', risk: 'High' },
  { id: '2', txId: 'TXN002', date: '27 Sep 2026 09:12', sender: 'paytmuser@ibl', receiver: 'mule01@upi', amount: '₹2,000', risk: 'Medium' },
  { id: '3', txId: 'TXN003', date: '27 Sep 2026 08:45', sender: 'onlinejob@upi', receiver: 'mule01@upi', amount: '₹1,500', risk: 'High' },
  { id: '4', txId: 'TXN004', date: '26 Sep 2026 17:30', sender: 'student@okbsi', receiver: 'mule01@upi', amount: '₹800', risk: 'Low' },
];

const ScoreRing = ({ score, label, color }: { score: number, label: string, color: string }) => {
  const data = [
    { value: score, color: color },
    { value: 100 - score, color: '#F1F5F9' }
  ];
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ position: 'relative', width: 80, height: 80 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={30} outerRadius={40} dataKey="value" startAngle={90} endAngle={-270}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>{score}</Typography>
        </Box>
      </Box>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 1, fontWeight: 500 }}>{label}</Typography>
    </Box>
  );
};

const AccountInvestigation: React.FC = () => {
  const theme = useTheme();
  const [tabIndex, setTabIndex] = React.useState(0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Account Investigation</Typography>
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

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Account Overview</Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Avatar sx={{ bgcolor: 'rgba(11, 23, 38, 0.1)', color: '#0B1726', width: 56, height: 56, mr: 2 }}>
                  <User size={28} />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>mule01@upi</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    <Typography variant="body2" color="textSecondary">UPI Account</Typography>
                    <Chip label="Potential Mule" size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'rgba(224, 82, 82, 0.1)', color: '#E05252', fontWeight: 600 }} />
                  </Box>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">Total Transactions</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>284</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">Unique Senders</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>67</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">Unique Receivers</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>42</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">Account Age</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>5 months</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">Total Inflow</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>₹1,24,000</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">Total Outflow</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>₹1,23,500</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Risk Scores</Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 4 }}>
                <ScoreRing score={76} label="Behavior Risk" color={theme.palette.warning.main} />
                <ScoreRing score={91} label="Network Risk" color={theme.palette.error.main} />
                <ScoreRing score={84} label="Anomaly Score" color={theme.palette.error.main} />
              </Box>
              
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(224, 82, 82, 0.05)', borderRadius: 2, border: '1px solid rgba(224, 82, 82, 0.2)' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.error.main }}>86/100</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.error.main, mb: 0.5 }}>Potential Network Risk</Typography>
                <Typography variant="caption" color="textSecondary">This account shares characteristics similar to known money mule networks.</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} sx={{ px: 2 }}>
            <Tab label="Transaction History" sx={{ textTransform: 'none', fontWeight: 600 }} />
            <Tab label="Network Graph" sx={{ textTransform: 'none', fontWeight: 600 }} />
            <Tab label="Explanation" sx={{ textTransform: 'none', fontWeight: 600 }} />
          </Tabs>
        </Box>
        
        {tabIndex === 0 && (
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
                </TableRow>
              </TableHead>
              <TableBody>
                {recentTransactions.map((row) => (
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        {tabIndex === 1 && (
          <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
            <Network size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
            <Typography>Interactive network graph will be rendered here.</Typography>
          </Box>
        )}
        
        {tabIndex === 2 && (
          <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
            <ShieldAlert size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
            <Typography>AI Explanation details will be shown here.</Typography>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default AccountInvestigation;
