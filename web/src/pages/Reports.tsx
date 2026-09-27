import React from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  Divider,
  useTheme,
  CircularProgress
} from '@mui/material';
import { FileDown, FileText } from 'lucide-react';
import axios from 'axios';
import CytoscapeComponent from 'react-cytoscapejs';

const COLORS = {
  target: '#F04438',
  connected: '#0BA5E9',
  suspicious: '#F59E0B',
  normal: '#10B981',
  merchant: '#8B5CF6'
};

const userSvg = `data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E`;

const cyStylesheet = [
  {
    selector: 'node',
    style: {
      'label': 'data(label)',
      'background-image': userSvg,
      'background-width': '50%',
      'background-height': '50%',
      'background-color': (ele: any) => COLORS[ele.data('group') as keyof typeof COLORS] || COLORS.connected,
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
      'border-color': '#fff'
    }
  },
  {
    selector: 'node[group="target"]',
    style: {
      'width': 50,
      'height': 50,
      'border-width': 3,
      'border-color': '#FEE2E2'
    }
  },
  {
    selector: 'edge',
    style: {
      'width': 1.5,
      'line-color': (ele: any) => {
         const s = ele.source();
         return COLORS[s.data('group') as keyof typeof COLORS] || '#CBD5E1';
      },
      'target-arrow-color': (ele: any) => {
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
];

const Reports: React.FC = () => {
  const theme = useTheme();
  
  const [targetId, setTargetId] = React.useState('mule01@upi');
  const [loading, setLoading] = React.useState(false);
  const [reportData, setReportData] = React.useState<any>(null);
  const [graphData, setGraphData] = React.useState<any[]>([]);

  const generateReport = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/accounts/${targetId}`, { withCredentials: true });
      setReportData(res.data);
      
      const graphRes = await axios.get(`http://localhost:5000/api/accounts/${targetId}/network`, { withCredentials: true });
      setGraphData(graphRes.data.edges);
    } catch (err) {
      console.error('Failed to generate report', err);
    } finally {
      setLoading(false);
    }
  };

  const getCyElements = () => {
    const nodesMap = new Map();
    const elements: any[] = [];
    
    // Add target node explicitly
    nodesMap.set(targetId, true);
    elements.push({ data: { id: targetId, label: targetId, group: 'target' } });

    graphData.forEach((edge, i) => {
      // limit graph complexity for print
      if (i > 30) return;
      
      const s = edge.source;
      const t = edge.target;

      if (!nodesMap.has(s.id)) {
        nodesMap.set(s.id, true);
        elements.push({ data: { id: s.id, label: s.label, group: s.isMule ? 'suspicious' : 'normal' } });
      }
      if (!nodesMap.has(t.id)) {
        nodesMap.set(t.id, true);
        elements.push({ data: { id: t.id, label: t.label, group: t.isMule ? 'suspicious' : 'normal' } });
      }
      elements.push({ data: { id: `e${i}`, source: s.id, target: t.id, amount: edge.amount } });
    });
    
    return elements;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }} className="no-print">
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Investigation Report</Typography>
        <Button variant="contained" color="primary" startIcon={<FileDown size={18} />} onClick={() => window.print()} disabled={!reportData}>
          Download PDF
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4} className="no-print">
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <FileText color={theme.palette.primary.main} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Generate Investigation Report</Typography>
              </Box>
              
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1, fontWeight: 500 }}>Account / UPI ID</Typography>
              <TextField 
                fullWidth 
                value={targetId} 
                onChange={(e) => setTargetId(e.target.value)}
                size="small"
                variant="outlined"
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                <FormControlLabel
                  control={<Checkbox defaultChecked color="primary" />}
                  label={<Typography variant="body2">Include Network Graph</Typography>}
                />
                <FormControlLabel
                  control={<Checkbox defaultChecked color="primary" />}
                  label={<Typography variant="body2">Include Explanation</Typography>}
                />
              </Box>

              <Typography variant="body2" color="textSecondary" sx={{ mb: 1, fontWeight: 500 }}>Report Format</Typography>
              <FormControl fullWidth size="small" sx={{ mb: 4 }}>
                <Select defaultValue="pdf">
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="csv">CSV Export</MenuItem>
                  <MenuItem value="json">JSON Data</MenuItem>
                </Select>
              </FormControl>

              <Button fullWidth variant="contained" color="primary" size="large" onClick={generateReport} disabled={loading || !targetId}>
                {loading ? <CircularProgress size={24} /> : 'Generate Report'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box sx={{ 
            bgcolor: '#FFFFFF', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            p: 6,
            minHeight: '800px',
            position: 'relative'
          }}>
            <Typography variant="caption" color="textSecondary" sx={{ position: 'absolute', top: 16, right: 24, fontWeight: 600 }}>Report Preview</Typography>
            
            <Box sx={{ borderBottom: '2px solid #0B1726', pb: 2, mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#0B1726' }}>MuleGraph AI Investigation Report</Typography>
              <Typography variant="body2" color="textSecondary">Generated on 27 Sep 2026, 11:30 AM</Typography>
            </Box>

            {reportData ? (
              <Box>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#0B1726' }}>Executive Summary</Typography>
                    <Grid container spacing={1} sx={{ mb: 3 }}>
                      <Grid item xs={6}><Typography variant="body2" color="textSecondary">Target ID</Typography></Grid>
                      <Grid item xs={6}><Typography variant="body2" sx={{ fontWeight: 600 }}>{reportData.account_id}</Typography></Grid>
                      
                      <Grid item xs={6}><Typography variant="body2" color="textSecondary">Risk Score</Typography></Grid>
                      <Grid item xs={6}><Typography variant="body2" sx={{ fontWeight: 700, color: reportData.is_mule ? theme.palette.error.main : theme.palette.success.main }}>{reportData.is_mule ? '92/100' : '15/100'}</Typography></Grid>
                      
                      <Grid item xs={6}><Typography variant="body2" color="textSecondary">Risk Level</Typography></Grid>
                      <Grid item xs={6}><Typography variant="body2" sx={{ fontWeight: 600, color: reportData.is_mule ? theme.palette.error.main : theme.palette.success.main }}>{reportData.is_mule ? 'High' : 'Low'}</Typography></Grid>
                      
                      <Grid item xs={6}><Typography variant="body2" color="textSecondary">Total Transactions</Typography></Grid>
                      <Grid item xs={6}><Typography variant="body2" sx={{ fontWeight: 600 }}>{reportData.stats?.total_tx || 0}</Typography></Grid>
                      
                      <Grid item xs={6}><Typography variant="body2" color="textSecondary">Unique Counterparties</Typography></Grid>
                      <Grid item xs={6}><Typography variant="body2" sx={{ fontWeight: 600 }}>{(reportData.stats?.unique_senders || 0) + (reportData.stats?.unique_receivers || 0)}</Typography></Grid>
                      
                      <Grid item xs={6}><Typography variant="body2" color="textSecondary">Total Flow Volume</Typography></Grid>
                      <Grid item xs={6}><Typography variant="body2" sx={{ fontWeight: 600 }}>₹ {(parseFloat(reportData.stats?.total_inflow || '0') + parseFloat(reportData.stats?.total_outflow || '0')).toLocaleString()}</Typography></Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#0B1726' }}>Key Findings</Typography>
                    <Box component="ul" sx={{ pl: 2, m: 0, '& li': { mb: 1, fontSize: '0.875rem' } }}>
                      {reportData.is_mule ? (
                        <>
                          <li>Extremely high transaction velocity detected.</li>
                          <li>Multiple incoming sources ({reportData.stats?.unique_senders || 0}) indicating layering.</li>
                          <li>Rapid onward transfers to known suspicious destinations.</li>
                          <li>Graph structure matches known cash-out bottleneck patterns.</li>
                          <li>High structural centrality in the 1-hop subgraph.</li>
                        </>
                      ) : (
                        <>
                          <li>Normal transaction velocity and volume.</li>
                          <li>Standard holding times matching average retail behavior.</li>
                          <li>No direct links to known suspicious clusters.</li>
                        </>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                <Typography color="textSecondary">Enter an ID and click Generate Report.</Typography>
              </Box>
            )}

            <Divider sx={{ my: 4 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3, color: '#0B1726' }}>Network Visualization</Typography>
            <Box sx={{ height: 340, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', position: 'relative', overflow: 'hidden' }}>
              {reportData && graphData.length > 0 ? (
                <CytoscapeComponent 
                  elements={getCyElements()} 
                  stylesheet={cyStylesheet}
                  style={{ width: '100%', height: '100%' }}
                  layout={{ name: 'cose', fit: true, padding: 30, nodeRepulsion: 400000, idealEdgeLength: 60 }}
                  cy={(cy) => {
                    cy.userPanningEnabled(false);
                    cy.userZoomingEnabled(false);
                    cy.boxSelectionEnabled(false);
                    cy.ready(() => {
                      setTimeout(() => {
                        cy.fit(undefined, 30);
                        cy.center();
                      }, 100);
                    });
                  }}
                />
              ) : (
                <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" color="textSecondary">[ Network Graph Export ]</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
