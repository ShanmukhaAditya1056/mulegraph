import React from 'react';
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
import { BrainCircuit, Lightbulb, Network, TrendingUp, AlertCircle, ShieldAlert } from 'lucide-react';

const shapFeatures = [
  { name: 'High Fan-in Ratio', score: 0.85, type: 'danger' },
  { name: 'Rapid Transaction Burst', score: 0.72, type: 'danger' },
  { name: 'Short Holding Time', score: 0.68, type: 'danger' },
  { name: 'Multi-hop Onward Transfer', score: 0.61, type: 'danger' },
  { name: 'Account Age', score: 0.15, type: 'warning' },
];

const AIExplanation: React.FC = () => {
  const theme = useTheme();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <BrainCircuit color={theme.palette.primary.main} /> AI Risk Explanation
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
            Transparent model reasoning for Account: <Typography component="span" sx={{ fontWeight: 700, color: '#0B1726' }}>mule01@upi</Typography>
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
                The transaction-level model identified this account as high risk primarily due to its temporal transaction patterns. The combination of high rapid deposits followed by immediate onward transfers is highly indicative of layering behavior.
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 3, color: '#0B1726', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Top Contributing Indicators
              </Typography>

              {shapFeatures.map((feature, idx) => (
                <Box key={idx} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                      + {feature.name}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: feature.type === 'danger' ? theme.palette.error.main : theme.palette.warning.main }}>
                      +{feature.score.toFixed(2)}
                    </Typography>
                  </Box>
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
                The temporal Graph Neural Network flagged this node based on structural relationships. The account acts as a critical bridge (bottleneck node) between 14 victim accounts and a known high-risk cash-out cluster.
              </Typography>

              {/* Subgraph visualization area */}
              <Box sx={{ 
                flexGrow: 1, 
                bgcolor: '#F8FAFC', 
                borderRadius: 2, 
                border: '1px dashed #CBD5E1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '280px',
                p: 3,
                mb: 4
              }}>
                <Network size={48} color="#94A3B8" style={{ marginBottom: 16, opacity: 0.5 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#475569', mb: 1 }}>
                  Supporting Subgraph Extraction
                </Typography>
                <Typography variant="body2" align="center" sx={{ color: '#94A3B8', maxWidth: 300 }}>
                  The structural features most responsible for the GraphSAGE anomaly score are isolated here. (Graph rendering engine placeholder)
                </Typography>
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
