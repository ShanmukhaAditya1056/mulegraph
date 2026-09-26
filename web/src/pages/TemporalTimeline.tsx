import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Chip,
  Divider,
  useTheme
} from '@mui/material';
import { Clock, ArrowRight, Activity, Zap, TrendingUp, AlertTriangle } from 'lucide-react';

const mockEvents = [
  { time: '09:01:12', sender: 'USER_102', receiver: 'MULE_04', amount: '2,500', isAnomaly: false },
  { time: '09:03:45', sender: 'USER_381', receiver: 'MULE_04', amount: '1,800', isAnomaly: false },
  { time: '09:05:22', sender: 'USER_442', receiver: 'MULE_04', amount: '3,200', isAnomaly: true, highlight: 'Rapid fan-in burst' },
  { time: '09:07:05', sender: 'MULE_04', receiver: 'MULE_17', amount: '7,500', isAnomaly: true, highlight: 'Short holding time' },
  { time: '09:09:18', sender: 'MULE_17', receiver: 'MULE_28', amount: '6,900', isAnomaly: true, highlight: 'Multi-hop onward transfer' },
];

const TemporalTimeline: React.FC = () => {
  const theme = useTheme();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Temporal Timeline</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Left Panel: Temporal Indicators */}
        <Box sx={{ flexBasis: { xs: '100%', md: '30%' }, maxWidth: { xs: '100%', md: '30%' } }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Temporal Indicators</Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ p: 1.2, bgcolor: 'rgba(224, 82, 82, 0.1)', borderRadius: 2 }}>
                  <Zap size={20} color={theme.palette.error.main} />
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">Transaction Velocity</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.error.main }}>Extremely High (Burst)</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ p: 1.2, bgcolor: 'rgba(217, 150, 33, 0.1)', borderRadius: 2 }}>
                  <Clock size={20} color={theme.palette.warning.main} />
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">Avg Holding Time</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>2.4 minutes</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ p: 1.2, bgcolor: 'rgba(7, 154, 154, 0.1)', borderRadius: 2 }}>
                  <Activity size={20} color={theme.palette.primary.main} />
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">Account Age</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>14 Days</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ p: 1.2, bgcolor: 'rgba(224, 82, 82, 0.1)', borderRadius: 2 }}>
                  <TrendingUp size={20} color={theme.palette.error.main} />
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">Fan-in / Fan-out</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.error.main }}>Anomalous Ratio</Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6 }}>
                The account shows a classic rapid collection and immediate onward transfer pattern. Funds are held for an average of only 2.4 minutes before being forwarded, highly indicative of a layering mule account.
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Right Panel: Event Timeline */}
        <Box sx={{ flexBasis: { xs: '100%', md: '70%' }, maxWidth: { xs: '100%', md: '70%' } }}>
          <Card sx={{ minHeight: '600px' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Chronological Events</Typography>
                <Chip icon={<AlertTriangle size={14} />} label="Potential Layering Sequence Detected" color="error" size="small" sx={{ fontWeight: 600, pl: 0.5 }} />
              </Box>

              <Box sx={{ position: 'relative' }}>
                {/* Vertical Line */}
                <Box sx={{ position: 'absolute', left: '104px', top: 0, bottom: 0, width: '2px', bgcolor: '#E2E8F0', zIndex: 0 }} />

                {mockEvents.map((event, index) => (
                  <Box key={index} sx={{ display: 'flex', mb: 4, position: 'relative', zIndex: 1 }}>
                    {/* Time */}
                    <Box sx={{ width: '90px', pt: 1, textAlign: 'right', pr: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569' }}>{event.time}</Typography>
                    </Box>
                    
                    {/* Dot */}
                    <Box sx={{ 
                      width: '32px', 
                      display: 'flex', 
                      justifyContent: 'center',
                      position: 'relative',
                      ml: '-1px'
                    }}>
                      <Box sx={{ 
                        width: '12px', 
                        height: '12px', 
                        borderRadius: '50%', 
                        bgcolor: event.isAnomaly ? theme.palette.error.main : theme.palette.primary.main,
                        border: '2px solid white',
                        boxShadow: '0 0 0 1px #E2E8F0',
                        mt: 1.5
                      }} />
                    </Box>

                    {/* Content */}
                    <Box sx={{ flexGrow: 1, pl: 2 }}>
                      <Box sx={{ 
                        p: 2.5, 
                        bgcolor: event.isAnomaly ? 'rgba(224, 82, 82, 0.04)' : '#F8FAFC', 
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: event.isAnomaly ? 'rgba(224, 82, 82, 0.2)' : '#E2E8F0',
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0B1726' }}>{event.sender}</Typography>
                            <ArrowRight size={16} color={theme.palette.text.secondary} />
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0B1726' }}>{event.receiver}</Typography>
                          </Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                            ₹{event.amount}
                          </Typography>
                        </Box>
                        
                        {event.highlight && (
                          <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center' }}>
                            <Chip size="small" label={event.highlight} sx={{ bgcolor: 'rgba(224, 82, 82, 0.1)', color: '#E05252', fontWeight: 600, fontSize: '0.7rem', height: 22 }} />
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>

            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default TemporalTimeline;
