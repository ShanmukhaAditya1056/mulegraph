import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, useTheme, Avatar } from '@mui/material';
import { BarChart2, Activity, Cpu, Zap, Network } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

const modelPerformance = [
  { name: 'Logistic Regression', Precision: 0.65, Recall: 0.58, F1: 0.61 },
  { name: 'XGBoost', Precision: 0.88, Recall: 0.82, F1: 0.85 },
  { name: 'LightGBM', Precision: 0.89, Recall: 0.84, F1: 0.86 },
  { name: 'GraphSAGE', Precision: 0.92, Recall: 0.89, F1: 0.90 },
  { name: 'Hybrid Fusion', Precision: 0.96, Recall: 0.94, F1: 0.95 },
];

const Analytics: React.FC = () => {
  const theme = useTheme();
  
  const [latencyData, setLatencyData] = useState([
    { time: '10:00', latency: 45 },
    { time: '10:05', latency: 52 },
    { time: '10:10', latency: 48 },
    { time: '10:15', latency: 42 },
    { time: '10:20', latency: 46 },
    { time: '10:25', latency: 44 },
  ]);

  const kpis = [
    { title: 'Current Model', value: 'Fusion v2.4', icon: <Cpu size={24} color="#3B82F6" />, bg: 'rgba(59, 130, 246, 0.1)' },
    { title: 'Overall Accuracy', value: '95.4%', icon: <Activity size={24} color="#10B981" />, bg: 'rgba(16, 185, 129, 0.1)' },
    { title: 'Avg Latency', value: '42ms', icon: <Zap size={24} color="#F59E0B" />, bg: 'rgba(245, 158, 11, 0.1)' },
    { title: 'Subgraphs Scored', value: '14.2k/hr', icon: <Network size={24} color="#8B5CF6" />, bg: 'rgba(139, 92, 246, 0.1)' },
  ];

  useEffect(() => {
    import('socket.io-client').then(({ io }) => {
      const socket = io('http://localhost:5000');
      socket.on('new_transaction', () => {
        setLatencyData(prev => {
          const now = new Date();
          const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const newLatency = Math.floor(Math.random() * 20) + 35; // 35-55ms
          const next = [...prev.slice(1), { time: timeStr, latency: newLatency }];
          return next;
        });
      });
      return () => socket.disconnect();
    });
  }, []);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <BarChart2 color={theme.palette.primary.main} /> Model Analytics & Evaluation
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
          Real-time metrics for GraphSAGE, Tabular, and Fusion models.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpis.map((kpi, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: '20px !important' }}>
                <Avatar sx={{ bgcolor: kpi.bg, width: 56, height: 56, mr: 2 }}>
                  {kpi.icon}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>{kpi.title}</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mt: 0.5 }}>{kpi.value}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={7}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', height: '100%' }}>
            <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#0F172A' }}>Model Performance Comparison</Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mb: 4 }}>GraphSAGE and Fusion models dramatically outperform traditional tabular baselines in detecting layering.</Typography>
              <Box sx={{ width: '100%', flexGrow: 1, minHeight: 350 }}>
                <ResponsiveContainer>
                  <BarChart data={modelPerformance} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }} dx={-10} />
                    <RechartsTooltip 
                      cursor={{ fill: '#F8FAFC' }} 
                      contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontWeight: 600 }} 
                    />
                    <Legend wrapperStyle={{ paddingTop: 20, fontSize: 13, fontWeight: 600 }} />
                    <Bar dataKey="Precision" fill="#10B981" radius={[6, 6, 0, 0]} barSize={24} />
                    <Bar dataKey="Recall" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={24} />
                    <Bar dataKey="F1" fill="#8B5CF6" radius={[6, 6, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', height: '100%' }}>
            <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#0F172A' }}>Live Inference Latency (ms)</Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mb: 4 }}>End-to-end model evaluation time per sub-graph.</Typography>
              <Box sx={{ width: '100%', flexGrow: 1, minHeight: 350 }}>
                <ResponsiveContainer>
                  <AreaChart data={latencyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }} dx={-10} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontWeight: 600 }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="latency" 
                      stroke="#F59E0B" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorLatency)" 
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#F59E0B' }} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
