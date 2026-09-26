import React from 'react';
import { Box, Card, CardContent, Typography, Switch, FormControlLabel, Divider, Button, useTheme } from '@mui/material';
import { Settings as SettingsIcon, Save } from 'lucide-react';

const Settings: React.FC = () => {
  const theme = useTheme();

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <SettingsIcon color={theme.palette.primary.main} /> System Settings
        </Typography>
      </Box>

      <Card sx={{ maxWidth: 800 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Risk Engine Configuration</Typography>
          
          <FormControlLabel
            control={<Switch defaultChecked color="primary" />}
            label={<Typography sx={{ fontWeight: 500 }}>Enable Hybrid Fusion Model</Typography>}
            sx={{ mb: 2, display: 'block' }}
          />
          <Typography variant="body2" color="textSecondary" sx={{ ml: 4, mb: 4, maxWidth: 500 }}>
            When disabled, the system will fallback to the XGBoost tabular model instead of fusing GraphSAGE network scores.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Notification Preferences</Typography>

          <FormControlLabel
            control={<Switch defaultChecked color="primary" />}
            label="Email alerts for Critical Risk incidents"
            sx={{ mb: 2, display: 'block' }}
          />
          <FormControlLabel
            control={<Switch defaultChecked color="primary" />}
            label="Automated analyst assignment for user reports"
            sx={{ mb: 4, display: 'block' }}
          />

          <Box sx={{ mt: 6, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="primary" startIcon={<Save size={18} />}>
              Save Changes
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;
