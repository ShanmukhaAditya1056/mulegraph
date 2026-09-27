import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  Button
} from '@mui/material';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  AlertTriangle, 
  Network, 
  Activity,
  ShieldAlert,
  Smartphone,
  Eye
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const kpis = [
  { title: 'Total Transactions', value: '48,291', trend: '+12.3%', up: true, icon: <Activity /> },
  { title: 'Accounts Analyzed', value: '8,492', trend: '+8.1%', up: true, icon: <Users /> },
  { title: 'Potential Risk Accounts', value: '382', trend: '-15%', up: false, icon: <AlertTriangle color="#E05252" /> },
  { title: 'Suspicious Networks', value: '47', trend: '-6%', up: false, icon: <Network color="#D99621" /> },
];

const trendData = [
  { name: 'Sep 20', normal: 4000, suspicious: 240 },
  { name: 'Sep 21', normal: 3000, suspicious: 139 },
  { name: 'Sep 22', normal: 2000, suspicious: 980 },
  { name: 'Sep 23', normal: 2780, suspicious: 390 },
  { name: 'Sep 24', normal: 1890, suspicious: 480 },
  { name: 'Sep 25', normal: 2390, suspicious: 380 },
  { name: 'Sep 26', normal: 3490, suspicious: 430 },
];

const riskData = [
  { name: 'High Risk', value: 12, color: '#E05252' },
  { name: 'Medium Risk', value: 28, color: '#D99621' },
  { name: 'Low Risk', value: 60, color: '#2E9B62' },
];

const recentTransactions = [
  { id: '1', time: '10:20 AM', sender: 'user123@okbsi', receiver: 'mule01@upi', amount: '₹5,000', risk: 'High' },
  { id: '2', time: '09:12 AM', sender: 'paytmuser@ibl', receiver: 'shopdeal@upi', amount: '₹1,200', risk: 'Medium' },
  { id: '3', time: '08:45 AM', sender: 'student@okbsi', receiver: 'friend@upi', amount: '₹300', risk: 'Low' },
  { id: '4', time: '08:30 AM', sender: 'onlinejob@upi', receiver: 'mule02@upi', amount: '₹7,000', risk: 'High' },
];

const alerts = [
  { title: 'High risk transaction detected', desc: '₹12,000 • mule03@upi', time: '2m ago', type: 'high' },
  { title: 'New mule network pattern', desc: '5 accounts in same cluster', time: '15m ago', type: 'network' },
  { title: 'Unusual transaction velocity', desc: '32 trx in 1 hour', time: '25m ago', type: 'velocity' },
  { title: 'Device fingerprinting detected', desc: 'New device login', time: '1h ago', type: 'device' },
];

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [liveKpis, setLiveKpis] = useState(kpis);
  const [liveTransactions, setLiveTransactions] = useState(recentTransactions);
  const [liveTrendData, setLiveTrendData] = useState(trendData);
  const [liveRiskData, setLiveRiskData] = useState(riskData);
  const [liveAlerts, setLiveAlerts] = useState<{title: string, desc: string, time: string, type: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.on('new_transaction', (tx: any) => {
      const formattedTxn = {
        id: tx.transaction_id,
        time: new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: tx.upi_id || tx.sender_id,
        receiver: tx.receiver_id,
        amount: `₹${parseFloat(tx.amount).toLocaleString()}`,
        risk: tx.risk_level
      };
      
      setLiveTransactions(prev => [formattedTxn, ...prev].slice(0, 10)); // Keep last 10
      setLiveKpis(prev => {
        const newKpis = prev.map(kpi => ({ ...kpi }));
        const currentVal = parseInt(newKpis[0].value.replace(/,/g, ''));
        if (!isNaN(currentVal)) {
           newKpis[0].value = (currentVal + 1).toLocaleString();
        }
        return newKpis;
      });
      
      // Update Trend
      setLiveTrendData(prev => {
        const next = prev.map(item => ({ ...item }));
        const last = next[next.length - 1];
        if (tx.risk_level === 'High' || tx.risk_level === 'Critical') {
          last.suspicious += 1;
        } else {
          last.normal += 1;
        }
        return next;
      });

      // Update Risk Distribution
      setLiveRiskData(prev => {
        const next = prev.map(item => ({ ...item }));
        if (tx.risk_level === 'High' || tx.risk_level === 'Critical') {
          next[0].value += 1;
        } else if (tx.risk_level === 'Medium') {
          next[1].value += 1;
        } else {
          next[2].value += 1;
        }
        return next;
      });

      // Update Alerts if high risk
      if (tx.risk_level === 'High' || tx.risk_level === 'Critical') {
        setLiveAlerts(prev => {
          const newAlert = {
            title: tx.risk_level === 'Critical' ? 'Critical risk transaction detected' : 'High risk transaction detected',
            desc: `₹${parseFloat(tx.amount).toLocaleString()} • ${tx.sender_id || tx.upi_id}`,
            time: 'Just now',
            type: 'high'
          };
          // avoid exact duplicates back to back for realism
          if (prev.length > 0 && prev[0].desc === newAlert.desc) return prev;
          return [newAlert, ...prev].slice(0, 5);
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const toggleSimulation = async () => {
    try {
      if (simulating) {
        await axios.post('http://localhost:5000/api/simulate/stop', {}, { withCredentials: true });
      } else {
        await axios.post('http://localhost:5000/api/simulate/start', {}, { withCredentials: true });
      }
      setSimulating(!simulating);
    } catch (err) {
      console.error('Failed to toggle simulation', err);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, txnsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/dashboard/stats', { withCredentials: true }),
          axios.get('http://localhost:5000/api/dashboard/recent-transactions', { withCredentials: true })
        ]);

        const data = statsRes.data.kpis;
        setLiveKpis([
          { title: 'Total Transactions', value: data.totalTransactions.toLocaleString(), trend: '+12.3%', up: true, icon: <Activity /> },
          { title: 'Accounts Analyzed', value: data.totalAccounts.toLocaleString(), trend: '+8.1%', up: true, icon: <Users /> },
          { title: 'Potential Risk Accounts', value: data.riskAccounts.toLocaleString(), trend: '+15%', up: false, icon: <AlertTriangle color="#E05252" /> },
          { title: 'Suspicious Networks', value: data.suspiciousNetworks.toLocaleString(), trend: '+6%', up: false, icon: <Network color="#D99621" /> },
        ]);

        const formattedTxns = txnsRes.data.map((tx: any, idx: number) => ({
          id: tx.transaction_id,
          time: new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: tx.upi_id || tx.sender_id,
          receiver: tx.receiver_id,
          amount: `₹${parseFloat(tx.amount).toLocaleString()}`,
          risk: parseFloat(tx.amount) > 100000 ? 'High' : parseFloat(tx.amount) > 50000 ? 'Medium' : 'Low'
        }));
        setLiveTransactions(formattedTxns);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Overview</Typography>
        <Button 
          variant="contained" 
          color={simulating ? "error" : "primary"} 
          onClick={toggleSimulation}
          startIcon={<Activity size={18} />}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          {simulating ? "Stop Live Simulation" : "Start Live Simulation"}
        </Button>
      </Box>

      {/* KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {liveKpis.map((kpi, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                    {kpi.title}
                  </Typography>
                  <Box sx={{ color: theme.palette.text.secondary }}>{kpi.icon}</Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mr: 2 }}>
                    {kpi.value}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: kpi.up ? theme.palette.success.main : theme.palette.error.main }}>
                    {kpi.up ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    <Typography variant="body2" sx={{ fontWeight: 600, ml: 0.5 }}>{kpi.trend}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Transaction Trend */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Transaction Trend</Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={liveTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="normal" name="Normal" stroke={theme.palette.secondary.main} strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="suspicious" name="Suspicious" stroke={theme.palette.error.main} strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Distribution */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Risk Distribution</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative', height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={liveRiskData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {liveRiskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>8,492</Typography>
                  <Typography variant="body2" color="textSecondary">Accounts</Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 'auto', pt: 2 }}>
                {liveRiskData.map((item, idx) => {
                  const total = liveRiskData.reduce((acc, curr) => acc + curr.value, 0) || 1;
                  const percentage = Math.round((item.value / total) * 100);
                  return (
                  <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ w: 12, h: 12, borderRadius: '50%', bgcolor: item.color, width: 12, height: 12, mr: 1.5 }} />
                      <Typography variant="body2">{item.name}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{percentage}%</Typography>
                  </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Recent Transactions</Typography>
                <Typography variant="body2" color="primary" sx={{ cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/transactions')}>View all</Typography>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: theme.palette.text.secondary }}>Time</TableCell>
                      <TableCell sx={{ color: theme.palette.text.secondary }}>Sender</TableCell>
                      <TableCell sx={{ color: theme.palette.text.secondary }}>Receiver</TableCell>
                      <TableCell sx={{ color: theme.palette.text.secondary }}>Amount</TableCell>
                      <TableCell sx={{ color: theme.palette.text.secondary }}>Risk</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {liveTransactions.map((row) => (
                      <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell sx={{ fontWeight: 500 }}>{row.time}</TableCell>
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
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Alerts */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Realtime Alerts</Typography>
              </Box>
              <List disablePadding>
                {liveAlerts.length === 0 && (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                      Monitoring real-time stream. High-risk anomalies will appear here...
                    </Typography>
                  </Box>
                )}
                {liveAlerts.map((alert, idx) => {
                  let alertIcon = <ShieldAlert color="#E05252" size={20} />;
                  if (alert.type === 'network') alertIcon = <Network color="#D99621" size={20} />;
                  if (alert.type === 'velocity') alertIcon = <Activity color="#D99621" size={20} />;
                  if (alert.type === 'device') alertIcon = <Smartphone color="#718096" size={20} />;
                  
                  return (
                  <ListItem key={idx} alignItems="flex-start" sx={{ px: 0, py: 1.5, borderBottom: idx < liveAlerts.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                      <Box sx={{ p: 1, bgcolor: 'rgba(241, 245, 249, 0.5)', borderRadius: 2 }}>
                        {alertIcon}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{alert.title}</Typography>}
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                          <Typography variant="body2" color="textSecondary">{alert.desc}</Typography>
                          <Typography variant="caption" color="textSecondary">{alert.time}</Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                )})}
              </List>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
};

export default Dashboard;
