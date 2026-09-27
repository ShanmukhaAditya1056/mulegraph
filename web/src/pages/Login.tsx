import React, { useState, useEffect } from 'react';
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
  InputAdornment,
  IconButton
} from '@mui/material';
import { Shield, Network, BrainCircuit, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  updateProfile,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, isVerified } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getFriendlyError = (errCode: string, defaultMsg: string) => {
    if (errCode === 'auth/invalid-credential' || errCode === 'auth/wrong-password' || errCode === 'auth/user-not-found') {
      return "Email or password is wrong.";
    }
    if (errCode === 'auth/email-already-in-use') {
      return "This email is already registered. Please sign in.";
    }
    if (errCode === 'auth/weak-password') {
      return "Password should be at least 6 characters.";
    }
    return defaultMsg;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      if (isSignUp) {
        if (!firstName || !lastName) {
          throw new Error("First name and last name are required.");
        }
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: `${firstName} ${lastName}`
        });
        await sendEmailVerification(userCredential.user);
        navigate('/verify-email', { replace: true });
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Check hard gating immediately
        if (userCredential.user.emailVerified) {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/verify-email', { replace: true });
        }
      }
    } catch (err: any) {
      setError(getFriendlyError(err.code, err.message || `Failed to ${isSignUp ? 'create account' : 'sign in'}.`));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first to reset password.");
      return;
    }
    try {
      setError('');
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (err: any) {
      setError(getFriendlyError(err.code, err.message || "Failed to send reset email."));
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (providerName: 'google' | 'microsoft') => {
    try {
      setError('');
      setLoading(true);
      const provider = providerName === 'google' 
        ? new GoogleAuthProvider() 
        : new OAuthProvider('microsoft.com');
      
      const userCredential = await signInWithPopup(auth, provider);
      
      if (userCredential.user.emailVerified || providerName === 'google') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/verify-email', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${providerName}. Make sure it is enabled in Firebase Console.`);
    } finally {
      setLoading(false);
    }
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
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Typography>
            <Typography variant="body1" sx={{ color: '#718096' }}>
              {isSignUp ? 'Sign up to get started' : 'Sign in to your account to continue'}
            </Typography>
          </Box>

          <form onSubmit={handleSignIn}>
            {error && <Typography color="error" variant="body2" sx={{ mb: 2, bgcolor: 'rgba(224, 82, 82, 0.1)', p: 1.5, borderRadius: 1 }}>{error}</Typography>}
            {message && <Typography variant="body2" sx={{ mb: 2, bgcolor: 'rgba(7, 154, 154, 0.1)', color: theme.palette.primary.main, p: 1.5, borderRadius: 1 }}>{message}</Typography>}
            
            {isSignUp && (
              <>
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#334155' }}>First Name</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#F8FAFC' } }}
                />
                
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#334155' }}>Last Name</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#F8FAFC' } }}
                />
              </>
            )}

            <Typography variant="subtitle2" sx={{ mb: 1, color: '#334155' }}>Email Address</Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              type={showPassword ? "text" : "password"}
              variant="outlined"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#F8FAFC' } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={18} color="#94A3B8" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                        {showPassword ? <EyeOff size={18} color="#94A3B8" /> : <Eye size={18} color="#94A3B8" />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />

            {isSignUp && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 3, mb: 1, color: '#334155' }}>Confirm Password</Typography>
                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#F8FAFC' } }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock size={18} color="#94A3B8" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                            {showPassword ? <EyeOff size={18} color="#94A3B8" /> : <Eye size={18} color="#94A3B8" />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                />
              </>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 4 }}>
              <FormControlLabel
                control={<Checkbox defaultChecked sx={{ color: '#CBD5E1', '&.Mui-checked': { color: theme.palette.primary.main } }} />}
                label={<Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>Keep me signed in</Typography>}
              />
              {!isSignUp && (
                <Link 
                  component="button"
                  type="button"
                  onClick={handleForgotPassword}
                  variant="body2" 
                  underline="hover" 
                  sx={{ fontWeight: 600, color: theme.palette.primary.main }}
                >
                  Forgot Password?
                </Link>
              )}
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                py: 1.6, 
                mb: 4, 
                fontSize: '1rem',
                borderRadius: 2,
                background: loading ? '#CBD5E1' : `linear-gradient(90deg, ${theme.palette.primary.main} 0%, #0BABA8 100%)`,
                boxShadow: loading ? 'none' : '0 8px 20px -4px rgba(7, 154, 154, 0.4)',
                '&:hover': {
                  background: loading ? '#CBD5E1' : `linear-gradient(90deg, #068A8A 0%, ${theme.palette.primary.main} 100%)`,
                  boxShadow: loading ? 'none' : '0 8px 20px -4px rgba(7, 154, 154, 0.6)',
                }
              }}
            >
              {loading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : (isSignUp ? 'Create Account' : 'Sign In')}
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Divider sx={{ flexGrow: 1 }} />
              <Typography variant="body2" sx={{ px: 2, color: '#94A3B8', fontWeight: 500 }}>
                or continue with
              </Typography>
              <Divider sx={{ flexGrow: 1 }} />
            </Box>

            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12}>
                <Button 
                  fullWidth 
                  variant="outlined"
                  onClick={() => handleOAuth('google')}
                  disabled={loading}
                  sx={{ 
                    py: 1.2,
                    color: '#334155', 
                    borderColor: '#E2E8F0',
                    borderRadius: 2,
                    fontWeight: 600,
                    bgcolor: '#FFFFFF',
                    '&:hover': { bgcolor: '#F8FAFC', borderColor: '#CBD5E1' }
                  }}
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: 20, height: 20, marginRight: 10 }} />
                  Continue with Google
                </Button>
              </Grid>
            </Grid>

            <Typography variant="body1" align="center" sx={{ color: '#475569' }}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <Link 
                component="button" 
                type="button"
                onClick={() => setIsSignUp(!isSignUp)} 
                underline="hover" 
                sx={{ fontWeight: 700, color: theme.palette.primary.main, verticalAlign: 'baseline' }}
              >
                {isSignUp ? 'Sign In' : 'Create an Account'}
              </Link>
            </Typography>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
