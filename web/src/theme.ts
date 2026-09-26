import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#079A9A',
      light: '#E5F5F5', // Light teal background for active states
    },
    secondary: {
      main: '#3B82F6',
    },
    error: {
      main: '#E05252',
      light: 'rgba(224, 82, 82, 0.1)',
    },
    warning: {
      main: '#D99621',
      light: 'rgba(217, 150, 33, 0.1)',
    },
    success: {
      main: '#2E9B62',
      light: 'rgba(46, 155, 98, 0.1)',
    },
    background: {
      default: '#F4F7FB', // Softer premium dashboard background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#172033',
      secondary: '#718096',
    },
  },
  typography: {
    fontFamily: '"Manrope", "Inter", "Roboto", sans-serif',
    h1: { fontWeight: 800, color: '#0B1726', letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, color: '#0B1726', letterSpacing: '-0.01em' },
    h3: { fontWeight: 700, color: '#0B1726', letterSpacing: '-0.01em' },
    h4: { fontWeight: 700, color: '#0B1726' },
    h5: { fontWeight: 700, color: '#0B1726' },
    h6: { fontWeight: 700, color: '#0B1726' },
    subtitle1: { fontWeight: 600, color: '#0B1726' },
    subtitle2: { fontWeight: 600, color: '#172033' },
    body1: { fontSize: '1rem', letterSpacing: '0.01em' },
    body2: { fontSize: '0.875rem', letterSpacing: '0.01em' },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 8px 24px rgba(11, 23, 38, 0.04)',
          border: '1px solid #E2E8F0',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 700,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(7, 154, 154, 0.2)',
          }
        },
        containedPrimary: {
          color: '#FFFFFF',
        }
      },
    },
  },
});
