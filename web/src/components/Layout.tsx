import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography,
  AppBar,
  Toolbar,
  TextField,
  InputAdornment,
  Avatar,
  IconButton,
  Divider,
  useTheme
} from '@mui/material';
import { 
  Shield, 
  LayoutDashboard, 
  ArrowRightLeft, 
  Network, 
  Search, 
  FileText, 
  BarChart2, 
  Database, 
  Settings,
  Bell,
  Clock,
  BrainCircuit,
  Briefcase,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 260;

const menuItems = [
  { text: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
  { text: 'Cases', icon: <Briefcase size={20} />, path: '/cases' },
  { text: 'Transactions', icon: <ArrowRightLeft size={20} />, path: '/transactions' },
  { text: 'Networks', icon: <Network size={20} />, path: '/networks' },
  { text: 'Timeline', icon: <Clock size={20} />, path: '/timeline' },
  { text: 'AI Explanations', icon: <BrainCircuit size={20} />, path: '/explanation' },
  { text: 'Investigations', icon: <Search size={20} />, path: '/investigations' },
  { text: 'Evidence', icon: <ShieldCheck size={20} />, path: '/evidence' },
  { text: 'Reports', icon: <FileText size={20} />, path: '/reports' },
  { text: 'Analytics', icon: <BarChart2 size={20} />, path: '/analytics' },
  { text: 'Dataset', icon: <Database size={20} />, path: '/dataset' },
  { text: 'Settings', icon: <Settings size={20} />, path: '/settings', bottom: true },
];

const Layout: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login', { replace: true });
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          },
        }}
      >
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
          <Shield color={theme.palette.primary.main} size={28} />
          <Typography variant="h6" sx={{ ml: 1.5, fontWeight: 700, color: '#0B1726' }}>
            MuleGraph AI
          </Typography>
        </Box>
        
        <List sx={{ px: 2, flex: 1 }}>
          {menuItems.filter(item => !item.bottom).map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(7, 154, 154, 0.1)',
                    color: theme.palette.primary.main,
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.main,
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.text.secondary }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: location.pathname === item.path ? 600 : 500,
                    fontSize: '0.9rem'
                  }} 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ p: 2 }}>
          {menuItems.filter(item => item.bottom).map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: theme.palette.text.secondary }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }} />
              </ListItemButton>
            </ListItem>
          ))}
          <Divider sx={{ my: 1 }} />
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{ borderRadius: 2, '&:hover': { bgcolor: 'rgba(224, 82, 82, 0.05)', color: theme.palette.error.main } }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: theme.palette.error.main }}>
                <LogOut size={20} />
              </ListItemIcon>
              <ListItemText primary="Log Out" primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem', color: theme.palette.error.main }} />
            </ListItemButton>
          </ListItem>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        {/* Topbar */}
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'transparent', mb: 4 }}>
          <Toolbar disableGutters sx={{ justifyContent: 'flex-end' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton sx={{ mx: 1 }}>
                <Bell size={20} />
              </IconButton>
              <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'right' }}>
                <Box sx={{ mr: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0B1726' }}>
                    {user?.displayName || 'Analyst'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    {user?.email || 'admin'}
                  </Typography>
                </Box>
                <Avatar sx={{ width: 40, height: 40, bgcolor: theme.palette.primary.main }}>
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'A'}
                </Avatar>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
