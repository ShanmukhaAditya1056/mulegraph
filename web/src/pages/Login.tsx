import React from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  TextField, 
  Button, 
  Checkbox, 
  FormControlLabel,
  Link,
  Divider,
  Stack,
  useTheme,
  InputAdornment
} from '@mui/material';
import { Shield, Network, BrainCircuit, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '100vh' }}>
      {/* Left Panel */}
      <Box sx={{
        flexBasis: { xs: '100%', md: '60%', lg: '65%' },
        maxWidth: { xs: '100%', md: '60%', lg: '65%' },
        position: 'relative',
        background: 'linear-gradient(135deg, #0B1726 0%, #0c2136 50%, #0B1726 100%)',
        color: 'white',
        px: { xs: 4, md: 8, lg: 12 },
        py: { xs: 6, md: 8 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Abstract glowing background effect */}
        <Box sx={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(7,154,154,0.15) 0%, rgba(11,23,38,0) 70%)',
          borderRadius: '50%',
          zIndex: 0
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(11,23,38,0) 70%)',
          borderRadius: '50%',
          zIndex: 0
        }} />

        <Box sx={{ position: 'relative', zIndex: 1, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
            <Box sx={{ 
              p: 1.5, 
              bgcolor: 'rgba(7, 154, 154, 0.1)', 
              borderRadius: 3, 
              border: '1px solid rgba(7, 154, 154, 0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <Shield color={theme.palette.primary.main} size={32} />
            </Box>
            <Typography variant="h4" sx={{ ml: 2, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
              MuleGraph AI
            </Typography>
          </Box>

          <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, color: 'white', lineHeight: 1.1 }}>
            Financial<br/>Network Safety<br/>
            <Box component="span" sx={{ color: theme.palette.primary.main }}>for a Safer India</Box>
          </Typography>
          
          <Typography variant="h6" sx={{ color: '#94A3B8', mb: 6, fontWeight: 400, maxWidth: 480, lineHeight: 1.5 }}>
            Detect and analyze suspicious transaction networks in realtime with enterprise-grade security.
          </Typography>

          <Stack spacing={3}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Box sx={{ mt: 0.5, mr: 2, color: theme.palette.primary.main }}>
                <BrainCircuit size={24} strokeWidth={2.5} />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>AI-Powered Detection</Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.5 }}>Identify anomalous transaction patterns in realtime with advanced ML models.</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Box sx={{ mt: 0.5, mr: 2, color: theme.palette.primary.main }}>
                <Network size={24} strokeWidth={2.5} />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>Graph Network Analysis</Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.5 }}>Map and visualize complex multi-hop financial connections effortlessly.</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Box sx={{ mt: 0.5, mr: 2, color: theme.palette.primary.main }}>
                <Shield size={24} strokeWidth={2.5} />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>Secure & Reliable</Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.5 }}>Your data is encrypted and protected with enterprise-grade security protocols.</Typography>
              </Box>
            </Box>
          </Stack>
        </Box>
        
        <Box sx={{ position: 'relative', zIndex: 1, mt: 6 }}>
          <Typography variant="caption" sx={{ color: '#475569' }}>
            © 2026 MuleGraph AI. All rights reserved.
          </Typography>
        </Box>
      </Box>

      {/* Right Panel */}
      <Box sx={{
        flexBasis: { xs: '100%', md: '40%', lg: '35%' },
        maxWidth: { xs: '100%', md: '40%', lg: '35%' },
        position: 'relative',
        bgcolor: '#FFFFFF',
        px: { xs: 4, md: 6, lg: 8 },
        py: { xs: 6, md: 8 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        {/* Highly visible subtle grid pattern background */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(#94A3B8 2px, transparent 2px)',
          backgroundSize: '32px 32px',
          opacity: 0.25,
          zIndex: 0
        }} />
        
        {/* Soft abstract gradients - made significantly more visible */}
        <Box sx={{
          position: 'absolute',
          top: '-15%',
          right: '-15%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(7,154,154,0.15) 0%, rgba(255,255,255,0) 70%)',
          borderRadius: '50%',
          zIndex: 0
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: '-15%',
          left: '-15%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(255,255,255,0) 70%)',
          borderRadius: '50%',
          zIndex: 0
        }} />

        <Box sx={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 480 }}>
          <Box sx={{ mb: 5, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5, color: '#0B1726' }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ color: '#718096' }}>
              Sign in to your account to continue
            </Typography>
          </Box>

          <form onSubmit={handleSignIn}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#334155' }}>Email Address</Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="name@example.com"
              defaultValue="admin@mulegraph.ai"
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#F8FAFC' } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={18} color="#94A3B8" />
                    </InputAdornment>
                  ),
                }
              }}
            />
            
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#334155' }}>Password</Typography>
            <TextField
              fullWidth
              type="password"
              variant="outlined"
              placeholder="••••••••"
              defaultValue="password123"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#F8FAFC' } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={18} color="#94A3B8" />
                    </InputAdornment>
                  ),
                }
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 4 }}>
              <FormControlLabel
                control={<Checkbox defaultChecked sx={{ color: '#CBD5E1', '&.Mui-checked': { color: theme.palette.primary.main } }} />}
                label={<Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>Keep me signed in</Typography>}
              />
              <Link href="#" variant="body2" underline="hover" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                Forgot Password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ 
                py: 1.6, 
                mb: 4, 
                fontSize: '1rem',
                borderRadius: 2,
                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, #0BABA8 100%)`,
                boxShadow: '0 8px 20px -4px rgba(7, 154, 154, 0.4)',
                '&:hover': {
                  background: `linear-gradient(90deg, #068A8A 0%, ${theme.palette.primary.main} 100%)`,
                  boxShadow: '0 8px 20px -4px rgba(7, 154, 154, 0.6)',
                }
              }}
            >
              Sign In
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Divider sx={{ flexGrow: 1 }} />
              <Typography variant="body2" sx={{ px: 2, color: '#94A3B8', fontWeight: 500 }}>
                or continue with
              </Typography>
              <Divider sx={{ flexGrow: 1 }} />
            </Box>

            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={6}>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  sx={{ 
                    py: 1,
                    color: '#334155', 
                    borderColor: '#E2E8F0',
                    borderRadius: 2,
                    fontWeight: 600,
                    bgcolor: '#FFFFFF',
                    '&:hover': { bgcolor: '#F8FAFC', borderColor: '#CBD5E1' }
                  }}
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: 18, height: 18, marginRight: 8 }} />
                  Google
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  sx={{ 
                    py: 1,
                    color: '#334155', 
                    borderColor: '#E2E8F0',
                    borderRadius: 2,
                    fontWeight: 600,
                    bgcolor: '#FFFFFF',
                    '&:hover': { bgcolor: '#F8FAFC', borderColor: '#CBD5E1' }
                  }}
                >
                  <img src="https://www.svgrepo.com/show/452062/microsoft.svg" alt="Microsoft" style={{ width: 18, height: 18, marginRight: 8 }} />
                  Microsoft
                </Button>
              </Grid>
            </Grid>

            <Typography variant="body1" align="center" sx={{ color: '#475569' }}>
              Don't have an account?{' '}
              <Link href="#" underline="hover" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                Create an Account
              </Link>
            </Typography>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
