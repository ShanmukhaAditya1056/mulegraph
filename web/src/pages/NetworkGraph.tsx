import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CytoscapeComponent from 'react-cytoscapejs';
import { 
  Box, Grid, Card, CardContent, Typography, TextField, Button, Chip, Divider, IconButton, 
  Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableRow, Avatar, Breadcrumbs,
  Link, Select, MenuItem, InputAdornment, Paper
} from '@mui/material';
import { 
  Users, Repeat, AlertTriangle, Search, Maximize, RotateCcw, Download,
  Plus, Minus, ChevronRight, X, User, Calendar, CreditCard, ShieldAlert,
  Wallet, FileText, Activity
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';

const COLORS = {
  target: '#F04438',
  connected: '#0BA5E9',
  suspicious: '#F59E0B',
  normal: '#10B981',
  merchant: '#8B5CF6'
};

const userSvg = `data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E`;

const NetworkGraph: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('1c6dcdcb');
  const [networkData, setNetworkData] = useState<any[]>([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const fetchGraph = async (queryId: string) => {
    if (!queryId) return;
    setLoading(true);
    try {
      const netRes = await axios.get(`http://localhost:5000/api/accounts/${queryId}/network`, { withCredentials: true });
      const elements: any[] = [];
      const nodes = new Set();
      if (netRes.data.edges) {
         netRes.data.edges.forEach((edge: any) => {
            const getGroup = (n: any) => n.id === queryId ? 'target' : (n.isMule ? 'suspicious' : 'connected');
            
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph(searchQuery);
  }, []);

  const kpiData = [
    { title: 'Total Nodes', value: '128', icon: <Users size={24} color="#10B981"/>, trend: '+12', trendColor: '#10B981', bgColor: '#ECFDF5' },
    { title: 'Total Transactions', value: '542', icon: <Repeat size={24} color="#0BA5E9"/>, trend: '+18%', trendColor: '#10B981', bgColor: '#F0F9FF' },
    { title: 'Suspicious Accounts', value: '12', icon: <AlertTriangle size={24} color="#F04438"/>, trend: '+3', trendColor: '#10B981', bgColor: '#FEF2F2' },
    { title: 'Total Amount (INR)', value: '₹ 48,76,230', icon: <Activity size={24} color="#10B981"/>, trend: '+27%', trendColor: '#10B981', bgColor: '#ECFDF5' },
  ];

  const riskData = [
    { name: 'High Risk', value: 12, color: COLORS.target },
    { name: 'Medium Risk', value: 28, color: COLORS.suspicious },
    { name: 'Low Risk', value: 45, color: COLORS.connected },
    { name: 'Normal', value: 43, color: COLORS.normal },
  ];

  const barData = Array.from({length: 30}).map((_, i) => ({
    name: `Sep ${i+1}`,
    value: Math.floor(Math.random() * 150000) + 10000
  }));

  return (
    <Box sx={{ p: 2, bgcolor: '#F8FAFC', minHeight: '100vh', mt: '-20px', mx: '-20px', pb: 8 }}>
      
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, px: 1 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F172A', mb: 0.5 }}>Network Graph Explorer</Typography>
          <Typography variant="body2" color="text.secondary">Visualize transaction relationships, identify suspicious clusters and track fund flows across accounts.</Typography>
        </Box>
        <Breadcrumbs separator={<ChevronRight size={14} />} aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/" sx={{ fontSize: '13px' }}>Home</Link>
          <Link underline="hover" color="inherit" href="/networks" sx={{ fontSize: '13px' }}>Networks</Link>
          <Typography color="text.primary" sx={{ fontSize: '13px', fontWeight: 600 }}>Explorer</Typography>
        </Breadcrumbs>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {kpiData.map((kpi, idx) => (
          <Grid item xs={12} md={3} key={idx}>
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: '16px !important' }}>
                <Avatar sx={{ bgcolor: kpi.bgColor, width: 48, height: 48, mr: 2 }}>
                  {kpi.icon}
                </Avatar>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>{kpi.title}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>{kpi.value}</Typography>
                    <Typography variant="caption" sx={{ color: kpi.trendColor, fontWeight: 600 }}>{kpi.trend}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Graph Area */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', height: 650, display: 'flex', flexDirection: 'column' }}>
            
            {/* Graph Toolbar */}
            <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', borderBottom: '1px solid #E2E8F0' }}>
              <TextField 
                size="small"
                placeholder="Search node in graph..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchGraph(searchQuery)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Search size={16}/></InputAdornment>,
                  sx: { borderRadius: 2, bgcolor: '#F8FAFC', width: 200 }
                }}
              />
              <Select size="small" value="all" sx={{ borderRadius: 2, bgcolor: '#F8FAFC', minWidth: 140 }}>
                <MenuItem value="all">All Node Types</MenuItem>
              </Select>
              <Select size="small" value="all" sx={{ borderRadius: 2, bgcolor: '#F8FAFC', minWidth: 140 }}>
                <MenuItem value="all">All Risk Levels</MenuItem>
              </Select>
              <Box sx={{ flexGrow: 1 }} />
              <Button startIcon={<Maximize size={16}/>} variant="outlined" size="small" sx={{ borderRadius: 2, textTransform: 'none', color: '#475569', borderColor: '#CBD5E1' }}>Expand</Button>
              <Button startIcon={<RotateCcw size={16}/>} variant="outlined" size="small" sx={{ borderRadius: 2, textTransform: 'none', color: '#475569', borderColor: '#CBD5E1' }}>Reset</Button>
              <Button startIcon={<Download size={16}/>} variant="contained" size="small" sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#0F766E' }}>Export</Button>
            </Box>

            {/* Legend */}
            <Box sx={{ px: 3, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <Box sx={{ display: 'flex', gap: 3 }}>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS.target }}/> <Typography variant="caption" fontWeight={500}>Target Account</Typography></Box>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS.connected }}/> <Typography variant="caption" fontWeight={500}>Connected Account</Typography></Box>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS.suspicious }}/> <Typography variant="caption" fontWeight={500}>Suspicious Account</Typography></Box>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS.normal }}/> <Typography variant="caption" fontWeight={500}>Normal Account</Typography></Box>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS.merchant }}/> <Typography variant="caption" fontWeight={500}>Merchant</Typography></Box>
               </Box>
            </Box>

            {/* Canvas */}
            <Box sx={{ flexGrow: 1, position: 'relative', bgcolor: '#fff' }}>
              
              {/* Zoom controls */}
              <Paper elevation={2} sx={{ position: 'absolute', right: 16, top: 16, zIndex: 10, display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                <IconButton size="small"><Plus size={18}/></IconButton>
                <Divider />
                <IconButton size="small"><Minus size={18}/></IconButton>
                <Divider />
                <IconButton size="small"><Maximize size={18}/></IconButton>
                <Divider />
                <IconButton size="small"><Search size={18}/></IconButton>
              </Paper>

              {loading ? (
                <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                   <Typography>Loading graph...</Typography>
                </Box>
              ) : networkData.length > 0 ? (
                <CytoscapeComponent
                  elements={networkData}
                  style={{ width: '100%', height: '100%' }}
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
                  cy={(cy) => {
                    cy.on('tap', 'node', async (evt) => {
                      const nodeData = evt.target.data();
                      try {
                        const accRes = await axios.get(`http://localhost:5000/api/accounts/${nodeData.id}`, { withCredentials: true });
                        setSelectedNode(accRes.data);
                      } catch (err) {
                        console.error(err);
                      }
                    });
                  }}
                />
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                  <Activity size={64} style={{ opacity: 0.2, marginBottom: 16 }} />
                  <Typography>Search for an account to render the network graph.</Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', height: 650, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A' }}>Node Details</Typography>
              <IconButton size="small"><X size={18}/></IconButton>
            </Box>
            
            {selectedNode ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <Box sx={{ px: 3, pt: 1, pb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: selectedNode.is_mule ? COLORS.target : COLORS.connected, width: 64, height: 64 }}>
                     <User size={32}/>
                  </Avatar>
                  <Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{selectedNode.account_id || selectedNode.id}</Typography>
                      {selectedNode.is_mule && <Chip label="Target Account" size="small" sx={{ height: 20, fontSize: '10px', bgcolor: '#FEE2E2', color: '#B91C1C', fontWeight: 600 }}/>}
                    </Box>
                    <Typography variant="caption" color="text.secondary">Risk Score</Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: selectedNode.is_mule ? '#B91C1C' : '#047857' }}>
                         {selectedNode.is_mule ? '82/100' : '12/100'}
                      </Typography>
                      <Chip label={selectedNode.is_mule ? "High Risk" : "Low Risk"} size="small" sx={{ height: 20, fontSize: '10px', bgcolor: selectedNode.is_mule ? '#FEE2E2' : '#D1FAE5', color: selectedNode.is_mule ? '#B91C1C' : '#047857', fontWeight: 600 }}/>
                    </Box>
                  </Box>
                </Box>
                
                <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ px: 2, borderBottom: '1px solid #E2E8F0', minHeight: 40 }}>
                  <Tab label="Overview" sx={{ textTransform: 'none', minHeight: 40, fontWeight: 600 }}/>
                  <Tab label="Transactions" sx={{ textTransform: 'none', minHeight: 40, fontWeight: 600 }}/>
                  <Tab label="Connections" sx={{ textTransform: 'none', minHeight: 40, fontWeight: 600 }}/>
                </Tabs>

                <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', color: '#64748B' }}>
                         <User size={16}/> <Typography variant="body2">Account ID</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedNode.account_id || selectedNode.id}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', color: '#64748B' }}>
                         <ShieldAlert size={16}/> <Typography variant="body2">UPI ID</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedNode.upi_id || 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', color: '#64748B' }}>
                         <User size={16}/> <Typography variant="body2">Account Type</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Individual</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', color: '#64748B' }}>
                         <Calendar size={16}/> <Typography variant="body2">First Seen</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>12 Sep 2024</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }}/>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', color: '#64748B' }}>
                         <Repeat size={16}/> <Typography variant="body2">Total Transactions</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedNode.stats?.total_tx || 0}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', color: '#64748B' }}>
                         <Activity size={16}/> <Typography variant="body2">Total Received</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>₹ {(parseFloat(selectedNode.stats?.total_inflow || '0')).toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', color: '#64748B' }}>
                         <Activity size={16}/> <Typography variant="body2">Total Sent</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>₹ {(parseFloat(selectedNode.stats?.total_outflow || '0')).toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', color: '#64748B' }}>
                         <Wallet size={16}/> <Typography variant="body2">Current Balance</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>₹ 16,820</Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Box sx={{ p: 2, display: 'flex', gap: 2, borderTop: '1px solid #E2E8F0' }}>
                   <Button variant="outlined" fullWidth sx={{ borderRadius: 2, textTransform: 'none', color: '#0F766E', borderColor: '#0F766E' }} onClick={() => navigate(`/investigations/${selectedNode.account_id || selectedNode.id}`)}>View Full Details</Button>
                   <Button variant="contained" fullWidth sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#0F766E' }} onClick={() => navigate(`/investigations/${selectedNode.account_id || selectedNode.id}`)}>Investigate →</Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                <Typography>Click on a node in the graph to view details.</Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Charts Row */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
           <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', height: 250 }}>
              <CardContent>
                 <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Risk Distribution</Typography>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 120, height: 120, position: 'relative' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={riskData} innerRadius={40} outerRadius={55} dataKey="value" stroke="none">
                            {riskData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                         <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>128</Typography>
                         <Typography variant="caption" color="text.secondary">Accounts</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                       {riskData.map((d, i) => (
                         <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                               <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: d.color }}/>
                               <Typography variant="caption" color="text.secondary">{d.name}</Typography>
                            </Box>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>{d.value} <span style={{color: '#94A3B8', fontWeight: 400}}>({Math.round((d.value/128)*100)}%)</span></Typography>
                         </Box>
                       ))}
                    </Box>
                 </Box>
              </CardContent>
           </Card>
        </Grid>
        <Grid item xs={12} md={5}>
           <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', height: 250 }}>
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                 <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Transaction Flow (Last 30 Days)</Typography>
                 <Box sx={{ flexGrow: 1, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} minTickGap={20}/>
                        <Tooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                        <Bar dataKey="value" fill="#14B8A6" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                 </Box>
              </CardContent>
           </Card>
        </Grid>
        <Grid item xs={12} md={4}>
           <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', height: 250, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0' }}>
                 <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Recent Suspicious Connections</Typography>
                 <Link href="#" underline="hover" sx={{ fontSize: '12px', color: '#0F766E', fontWeight: 600 }}>View All</Link>
              </Box>
              <TableContainer sx={{ flexGrow: 1 }}>
                 <Table size="small">
                    <TableBody>
                       {[
                         { id: 'TXN1', src: '1c6dcdcb', dst: '879fa3c9', amt: '45,476', risk: 'High' },
                         { id: 'TXN2', src: '1c6dcdcb', dst: '69dbeebe', amt: '67,702', risk: 'High' },
                         { id: 'TXN3', src: 'd1dfc4b7', dst: '1c6dcdcb', amt: '34,004', risk: 'Medium' },
                         { id: 'TXN4', src: 'c7edb540', dst: '1c6dcdcb', amt: '1,87,46.44', risk: 'High' },
                         { id: 'TXN5', src: '1c6dcdcb', dst: 'e1c21887', amt: '13,514', risk: 'Medium' }
                       ].map(row => (
                         <TableRow key={row.id}>
                            <TableCell sx={{ borderBottom: 'none', py: 1 }}>
                              <AlertTriangle size={14} color="#F04438" />
                            </TableCell>
                            <TableCell sx={{ borderBottom: 'none', py: 1, fontSize: '11px', color: '#475569' }}>
                               {row.src} → {row.dst}
                            </TableCell>
                            <TableCell sx={{ borderBottom: 'none', py: 1, fontSize: '11px', fontWeight: 600 }}>
                               ₹ {row.amt}
                            </TableCell>
                            <TableCell sx={{ borderBottom: 'none', py: 1 }}>
                               <Chip label={row.risk} size="small" sx={{ height: 18, fontSize: '9px', bgcolor: row.risk==='High' ? '#FEE2E2' : '#FEF3C7', color: row.risk==='High' ? '#B91C1C' : '#D97706', fontWeight: 600 }}/>
                            </TableCell>
                         </TableRow>
                       ))}
                    </TableBody>
                 </Table>
              </TableContainer>
           </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NetworkGraph;
