import React from 'react';
import { 
  Box, Card, CardContent, Typography, Grid, Button, 
  Chip, Divider, useTheme, TextField
} from '@mui/material';
import { ShieldCheck, FileCheck, Hash, Download } from 'lucide-react';

const EvidenceVerification: React.FC = () => {
  const theme = useTheme();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ShieldCheck color={theme.palette.primary.main} /> Evidence Verification
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
            Verify integrity of user-uploaded fraud evidence and screenshots.
          </Typography>
        </Box>
        <Chip label="Case: CAS-8821" sx={{ fontWeight: 600, bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }} />
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, p: 4, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Uploaded Screenshot</Typography>
                <Button variant="outlined" size="small" startIcon={<Download size={16} />}>Download Original</Button>
              </Box>
              
              <Box sx={{ 
                flexGrow: 1, 
                bgcolor: '#F1F5F9', 
                borderRadius: 2, 
                border: '1px dashed #CBD5E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <Box sx={{ textAlign: 'center', color: '#94A3B8' }}>
                  <FileCheck size={64} style={{ marginBottom: 16, opacity: 0.5 }} />
                  <Typography>Secure Image Viewer Placeholder</Typography>
                  <Typography variant="caption">(PII is automatically redacted)</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ height: '600px' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Integrity Check</Typography>

              <Box sx={{ p: 3, bgcolor: 'rgba(46, 155, 98, 0.05)', borderRadius: 2, border: '1px solid rgba(46, 155, 98, 0.2)', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <ShieldCheck size={20} color={theme.palette.success.main} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                    Signature Valid
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#475569' }}>
                  The uploaded file has not been tampered with since creation. Cryptographic hash matches the original device signature.
                </Typography>
              </Box>

              <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 1 }}>SHA-256 Hash</Typography>
              <TextField 
                fullWidth 
                size="small" 
                value="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" 
                InputProps={{ readOnly: true, sx: { fontFamily: 'monospace', fontSize: '0.8rem', color: '#475569', bgcolor: '#F8FAFC' } }}
                sx={{ mb: 4 }}
              />

              <Divider sx={{ mb: 4 }} />

              <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 1 }}>Extracted Metadata</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2">Device OS</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Android 14</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2">Timestamp</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>2026-10-12 14:22:05 IST</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="body2">App Version</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>v2.4.1 (MuleGraph AI)</Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
                <Button fullWidth variant="outlined" color="error" sx={{ py: 1.5 }}>
                  Reject Evidence
                </Button>
                <Button fullWidth variant="contained" color="success" sx={{ py: 1.5, color: '#FFF' }}>
                  Verify & Approve
                </Button>
              </Box>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EvidenceVerification;
