import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CytoscapeComponent from 'react-cytoscapejs';
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
import { Search, User, ShieldAlert, Network } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = {
  target: '#F04438',
  connected: '#0BA5E9',
  suspicious: '#F59E0B',
  normal: '#10B981',
  merchant: '#8B5CF6'
};

const userSvg = `data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E`;

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
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const [tabIndex, setTabIndex] = React.useState(0);
  const [account, setAccount] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [networkData, setNetworkData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState(id || '');

  useEffect(() => {
    const fetchData = async () => {
      if (!searchQuery) return;
      try {
        const [accRes, txRes, netRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/accounts/${searchQuery}`, { withCredentials: true }),
          axios.get(`http://localhost:5000/api/accounts/${searchQuery}/timeline`, { withCredentials: true }),
          axios.get(`http://localhost:5000/api/accounts/${searchQuery}/network`, { withCredentials: true })
        ]);

        setAccount(accRes.data);
        setTransactions(txRes.data.timeline.map((tx: any) => ({
          id: tx.transaction_id,
          txId: tx.transaction_id.substring(0, 8),
          date: new Date(tx.timestamp).toLocaleString(),
          sender: tx.sender_id,
          receiver: tx.receiver_id,
          amount: `₹${parseFloat(tx.amount).toLocaleString()}`,
          risk: parseFloat(tx.amount) > 100000 ? 'High' : parseFloat(tx.amount) > 50000 ? 'Medium' : 'Low'
        })));
        
        // Format cytoscape elements
        const elements: any[] = [];
        const nodes = new Set();
        if (netRes.data.edges) {
           const getGroup = (n: any) => n.id === searchQuery ? 'target' : (n.isMule ? 'suspicious' : 'connected');
           netRes.data.edges.forEach((edge: any) => {
              if (!nodes.has(edge.source.id)) {
                  elements.push({ data: { id: edge.source.id, label: edge.source.label, group: getGroup(edge.source) }});
                  nodes.add(edge.source.id);
              }
              if (!nodes.has(edge.target.id)) {
                  elements.push({ data: { id: edge.target.id, label: edge.target.label, group: getGroup(edge.target) }});
                  nodes.add(edge.target.id);
              }
              elements.push({ data: { source: edge.source.id, target: edge.target.id, amount: edge.amount }});
           });
        }
        setNetworkData(elements);

      } catch (err) {
        console.error("Failed to load account data", err);
      }
    };
    fetchData();
  }, [searchQuery]);

  const handleSearch = () => {
     // Ideally trigger navigation to /investigation/:id, but for now just update query
     if(searchQuery) {
        window.history.pushState({}, '', `/investigation/${searchQuery}`);
        // React router won't pick this up automatically without navigate, 
        // but useEffect will fire if we depended on a separate state.
        // For simplicity, we just rely on the existing state.
     }
  };

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button variant="contained" color="primary" sx={{ px: 4 }} onClick={handleSearch}>
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
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{account?.upi_id || account?.account_id || 'Unknown'}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    <Typography variant="body2" color="textSecondary">{account?.name || 'Account'}</Typography>
                    {account?.is_mule && (
                      <Chip label="Potential Mule" size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'rgba(224, 82, 82, 0.1)', color: '#E05252', fontWeight: 600 }} />
                    )}
                  </Box>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">Total Transactions</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{account?.stats?.total_tx || 0}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">Unique Senders</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{account?.stats?.unique_senders || 0}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">Unique Receivers</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{account?.stats?.unique_receivers || 0}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">Account Age</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>5 months</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">Total Inflow</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>₹{parseFloat(account?.stats?.total_inflow || '0').toLocaleString()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="textSecondary">Total Outflow</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>₹{parseFloat(account?.stats?.total_outflow || '0').toLocaleString()}</Typography>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {tabIndex === 1 && (
          <Box sx={{ 
            height: 600, 
            bgcolor: '#ffffff',
            position: 'relative',
            borderRadius: 2, 
            m: 2,
            border: '1px solid #E2E8F0'
          }}>
            {networkData.length > 0 ? (
              <CytoscapeComponent
                elements={networkData}
                style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}
                stylesheet={[
                    {
                      selector: 'node',
                      style: {
                        'label': 'data(label)',
                        'background-image': userSvg,
                        'background-width': '50%',
                        'background-height': '50%',
                        'background-color': (ele) => COLORS[ele.data('group') as keyof typeof COLORS] || COLORS.connected,
                        'color': '#1E293B',
                        'text-valign': 'bottom',
                        'text-halign': 'center',
                        'text-margin-y': 6,
                        'font-size': '11px',
                        'font-weight': '600',
                        'font-family': 'Inter, sans-serif',
                        'width': 40,
                        'height': 40,
                        'border-width': 2,
                        'border-color': '#fff',
                        'shadow-blur': 10,
                        'shadow-color': '#CBD5E1',
                        'shadow-opacity': 0.5
                      }
                    },
                    {
                      selector: 'node[group="target"]',
                      style: {
                        'width': 50,
                        'height': 50,
                        'border-width': 3,
                        'border-color': '#FEE2E2',
                        'shadow-color': COLORS.target,
                        'shadow-opacity': 0.3
                      }
                    },
                    {
                      selector: 'edge',
                      style: {
                        'width': 1.5,
                        'line-color': (ele) => {
                           const s = ele.source();
                           return COLORS[s.data('group') as keyof typeof COLORS] || '#CBD5E1';
                        },
                        'target-arrow-color': (ele) => {
                           const s = ele.source();
                           return COLORS[s.data('group') as keyof typeof COLORS] || '#CBD5E1';
                        },
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier',
                        'label': 'data(amount)',
                        'font-size': '10px',
                        'font-weight': '500',
                        'color': '#475569',
                        'text-background-opacity': 1,
                        'text-background-color': '#F8FAFC',
                        'text-background-padding': '4px',
                        'text-background-shape': 'roundrectangle',
                        'text-border-width': 1,
                        'text-border-color': '#E2E8F0'
                      }
                    }
                  ]}
                  layout={{ 
                    name: 'concentric', 
                    padding: 60,
                    minNodeSpacing: 80,
                    concentric: (node: any) => node.data('group') === 'target' ? 2 : 1,
                    levelWidth: () => 1
                  }}
              />
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                <Network size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                <Typography>Loading network graph data...</Typography>
              </Box>
            )}
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
