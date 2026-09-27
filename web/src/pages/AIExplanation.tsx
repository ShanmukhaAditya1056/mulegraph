import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Chip,
  Divider,
  LinearProgress,
  useTheme
} from '@mui/material';
import { BrainCircuit, Lightbulb, Network, TrendingUp, AlertCircle, ShieldAlert, Cpu } from 'lucide-react';
import CytoscapeComponent from 'react-cytoscapejs';
import { useSearchParams } from 'react-router-dom';

const shapFeatures = [
  { name: 'High Fan-in Ratio', score: 0.85, type: 'danger', desc: 'Number of unique depositors compared to withdrawal destinations.' },
  { name: 'Rapid Transaction Burst', score: 0.72, type: 'danger', desc: 'High volume of transactions occurring in a very short time window.' },
  { name: 'Short Holding Time', score: 0.68, type: 'danger', desc: 'Average time funds sit in the account before being forwarded.' },
  { name: 'Multi-hop Onward Transfer', score: 0.61, type: 'danger', desc: 'Funds trace directly to known cash-out accounts within 2 hops.' },
  { name: 'Account Age', score: 0.15, type: 'warning', desc: 'The account was created very recently.' },
];

const cyStylesheet = [
  { selector: 'node', style: { 'label': 'data(label)', 'background-color': '#94A3B8', 'color': '#0F172A', 'font-size': '10px', 'text-valign': 'bottom', 'text-margin-y': 4 } },
  { selector: 'node[group="target"]', style: { 'background-color': '#F04438', 'width': 30, 'height': 30, 'border-width': 2, 'border-color': '#FCA5A5' } },
  { selector: 'node[group="suspicious"]', style: { 'background-color': '#F59E0B' } },
  { selector: 'node[group="normal"]', style: { 'background-color': '#10B981' } },
  { selector: 'edge', style: { 'width': 1.5, 'line-color': '#E2E8F0', 'target-arrow-color': '#E2E8F0', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier', 'opacity': 0.8 } },
  { selector: 'edge[type="high_risk"]', style: { 'line-color': '#FCA5A5', 'target-arrow-color': '#FCA5A5', 'line-style': 'dashed', 'width': 2 } }
];

const AIExplanation: React.FC = () => {
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const accountId = searchParams.get('account') || 'mule01@upi';

  // Dummy subgraph for explanation
  const subGraphElements = [
    { data: { id: 'target', label: accountId, group: 'target' } },
    { data: { id: 'v1', label: 'Victim 1', group: 'normal' } },
    { data: { id: 'v2', label: 'Victim 2', group: 'normal' } },
    { data: { id: 'v3', label: 'Victim 3', group: 'normal' } },
    { data: { id: 'c1', label: 'Cash-out 1', group: 'suspicious' } },
    { data: { id: 'c2', label: 'Cash-out 2', group: 'suspicious' } },
    { data: { source: 'v1', target: 'target' } },
    { data: { source: 'v2', target: 'target' } },
    { data: { source: 'v3', target: 'target' } },
    { data: { source: 'target', target: 'c1', type: 'high_risk' } },
    { data: { source: 'target', target: 'c2', type: 'high_risk' } }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <BrainCircuit color={theme.palette.primary.main} /> AI Risk Explanation
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
            Transparent model reasoning for Account: <Typography component="span" sx={{ fontWeight: 700, color: '#0B1726' }}>{accountId}</Typography>
          </Typography>
        </Box>
        <Chip 
          icon={<ShieldAlert size={16} />} 
          label="High Risk (94%)" 
          sx={{ bgcolor: 'rgba(224, 82, 82, 0.1)', color: '#E05252', fontWeight: 700, px: 1 }} 
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
        
        {/* Left Panel: Tabular SHAP Explanation */}
        <Box sx={{ flexBasis: { xs: '100%', lg: '50%' }, maxWidth: { xs: '100%', lg: '50%' } }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                <Box sx={{ p: 1, bgcolor: 'rgba(7, 154, 154, 0.1)', borderRadius: 2 }}>
                  <TrendingUp size={24} color={theme.palette.primary.main} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Tabular Model (XGBoost)</Typography>
                  <Typography variant="body2" color="textSecondary">SHAP Feature Importance</Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" sx={{ mb: 4, color: '#475569', lineHeight: 1.6 }}>
                Our <strong>XGBoost Model</strong> processes individual transaction history and temporal patterns. It flagged <strong style={{color: '#0B1726'}}>{accountId}</strong> as High Risk because it perfectly matches the signature of a layering mule: quickly collecting funds from multiple sources and instantly discharging them.
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 3, color: '#0B1726', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Top Contributing Indicators
              </Typography>

              {shapFeatures.map((feature, idx) => (
                <Box key={idx} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                      {feature.name}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: feature.type === 'danger' ? theme.palette.error.main : theme.palette.warning.main }}>
                      +{feature.score.toFixed(2)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 1 }}>
                    {feature.desc}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={feature.score * 100} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: '#F1F5F9',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: feature.type === 'danger' ? theme.palette.error.main : theme.palette.warning.main,
                        borderRadius: 4
                      }
                    }} 
                  />
                </Box>
              ))}

              <Box sx={{ mt: 5, p: 2.5, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0', display: 'flex', gap: 2 }}>
                <Lightbulb size={24} color={theme.palette.warning.main} sx={{ flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: '#475569' }}>
                  <strong>Analyst Note:</strong> The model places 85% of its anomaly weighting on the ratio of incoming counterparties vs the speed of outbound transfers (Fan-in vs Holding Time).
                </Typography>
              </Box>

            </CardContent>
          </Card>
        </Box>

        {/* Right Panel: GNN Explanation */}
        <Box sx={{ flexBasis: { xs: '100%', lg: '50%' }, maxWidth: { xs: '100%', lg: '50%' } }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                <Box sx={{ p: 1, bgcolor: 'rgba(59, 130, 246, 0.1)', borderRadius: 2 }}>
                  <Network size={24} color="#3B82F6" />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Graph Model (GraphSAGE)</Typography>
                  <Typography variant="body2" color="textSecondary">Neighborhood & Subgraph Influence</Typography>
                </Box>
              </Box>

              <Typography variant="body2" sx={{ mb: 4, color: '#475569', lineHeight: 1.6 }}>
                Our <strong>GraphSAGE Neural Network</strong> analyzes structural relationships. It flagged <strong style={{color: '#0B1726'}}>{accountId}</strong> because it acts as a critical structural bridge (a bottleneck node) between normal victim accounts and a highly suspicious known cash-out cluster.
              </Typography>

              {/* Subgraph visualization area */}
              <Box sx={{ 
                flexGrow: 1, 
                bgcolor: '#F8FAFC', 
                borderRadius: 2, 
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                minHeight: '320px',
                mb: 4,
                overflow: 'hidden'
              }}>
                <Box sx={{ p: 2, borderBottom: '1px solid #E2E8F0', bgcolor: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0B1726', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Cpu size={16} color={theme.palette.primary.main} /> Supporting Subgraph Extraction
                  </Typography>
                </Box>
                
                <Box sx={{ flexGrow: 1, position: 'relative' }}>
                  <CytoscapeComponent 
                    elements={subGraphElements} 
                    stylesheet={cyStylesheet}
                    style={{ width: '100%', height: '100%' }}
                    layout={{ name: 'breadthfirst', directed: true, padding: 30 }}
                    cy={(cy) => {
                      cy.on('tap', 'node', (evt) => { /* disable interact for static view */ });
                      cy.userPanningEnabled(false);
                      cy.userZoomingEnabled(false);
                      cy.boxSelectionEnabled(false);
                    }}
                  />
                  
                  <Box sx={{ position: 'absolute', bottom: 12, left: 12, right: 12, p: 1.5, bgcolor: 'rgba(255,255,255,0.9)', borderRadius: 1, border: '1px solid #E2E8F0', backdropFilter: 'blur(4px)' }}>
                     <Typography variant="caption" sx={{ color: '#475569', display: 'flex', alignItems: 'center', gap: 1 }}>
                       <AlertCircle size={14} color="#FCA5A5" />
                       Notice how funds funnel into the target node (red) and immediately split to known suspicious clusters (orange).
                     </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1, p: 2, border: '1px solid #E2E8F0', borderRadius: 2 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>Direct Neighbors</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#0B1726' }}>24</Typography>
                </Box>
                <Box sx={{ flex: 1, p: 2, border: '1px solid rgba(224, 82, 82, 0.3)', bgcolor: 'rgba(224, 82, 82, 0.05)', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: '#E05252', mb: 0.5 }}>Suspicious 2-Hop Connections</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#E05252', display: 'flex', alignItems: 'center', gap: 1 }}>
                    11 <AlertCircle size={18} />
                  </Typography>
                </Box>
              </Box>
              
            </CardContent>
          </Card>
        </Box>

      </Box>
    </Box>
  );
};

export default AIExplanation;
