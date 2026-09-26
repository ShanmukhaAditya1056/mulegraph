import React from 'react';
import { Box, Card, CardContent, Typography, Grid, useTheme } from '@mui/material';
import { BarChart2 } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

const modelPerformance = [
  { name: 'Logistic Regression', Precision: 0.65, Recall: 0.58, F1: 0.61 },
  { name: 'XGBoost', Precision: 0.88, Recall: 0.82, F1: 0.85 },
  { name: 'LightGBM', Precision: 0.89, Recall: 0.84, F1: 0.86 },
  { name: 'GraphSAGE', Precision: 0.92, Recall: 0.89, F1: 0.90 },
  { name: 'Hybrid Fusion', Precision: 0.96, Recall: 0.94, F1: 0.95 },
];

const latencyData = [
  { time: '10:00', latency: 45 },
  { time: '10:05', latency: 52 },
  { time: '10:10', latency: 48 },
  { time: '10:15', latency: 120 },
  { time: '10:20', latency: 46 },
  { time: '10:25', latency: 44 },
];

const Analytics: React.FC = () => {
  const theme = useTheme();

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

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 4 }}>Model Performance Comparison</Typography>
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <BarChart data={modelPerformance} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <RechartsTooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                    <Legend />
                    <Bar dataKey="Precision" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Recall" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="F1" fill="#0B1726" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 4 }}>Live Inference Latency (ms)</Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={latencyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <RechartsTooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="latency" stroke={theme.palette.error.main} strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
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
