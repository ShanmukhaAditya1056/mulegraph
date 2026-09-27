import React, { useState, useRef } from 'react';
import { 
  Box, Card, CardContent, Typography, Grid, Button, 
  Chip, Divider, useTheme, TextField, IconButton
} from '@mui/material';
import { ShieldCheck, FileCheck, Hash, Download, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const EvidenceVerification: React.FC = () => {
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('case') || 'CAS-8821';
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [hash, setHash] = useState<string>('');
  const [verified, setVerified] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;
    
    setFile(uploadedFile);
    setVerified(null);
    
    // Create preview
    const objectUrl = URL.createObjectURL(uploadedFile);
    setPreview(objectUrl);

    // Compute real SHA-256 hash of the file
    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setHash(hashHex);
    } catch (err) {
      console.error('Failed to hash file', err);
      setHash('Error computing hash');
    }
  };

  const handleVerify = () => {
    // Mock API call to verify signature against database
    setTimeout(() => {
      setVerified(true);
    }, 600);
  };

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
        <Chip label={`Case: ${caseId}`} sx={{ fontWeight: 600, bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }} />
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, p: 4, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Uploaded Screenshot</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileUpload} />
                  <Button variant="contained" size="small" startIcon={<Upload size={16} />} onClick={() => fileInputRef.current?.click()}>Upload File</Button>
                  {preview && <Button variant="outlined" size="small" startIcon={<Download size={16} />} onClick={() => window.open(preview)}>Download Original</Button>}
                </Box>
              </Box>
              
              <Box sx={{ 
                flexGrow: 1, 
                bgcolor: '#F1F5F9', 
                borderRadius: 2, 
                border: '1px dashed #CBD5E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {preview ? (
                  <img src={preview} alt="Evidence Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                ) : (
                  <Box sx={{ textAlign: 'center', color: '#94A3B8' }}>
                    <FileCheck size={64} style={{ marginBottom: 16, opacity: 0.5 }} />
                    <Typography>Secure Image Viewer</Typography>
                    <Typography variant="caption">Please upload an evidence file to begin verification.</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ height: '600px' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Integrity Check</Typography>

              <Box sx={{ 
                p: 3, 
                bgcolor: verified === null ? 'rgba(241, 245, 249, 1)' : verified ? 'rgba(46, 155, 98, 0.05)' : 'rgba(224, 82, 82, 0.05)', 
                borderRadius: 2, 
                border: '1px solid',
                borderColor: verified === null ? '#E2E8F0' : verified ? 'rgba(46, 155, 98, 0.2)' : 'rgba(224, 82, 82, 0.2)', 
                mb: 4,
                transition: 'all 0.3s'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  {verified === null ? <AlertCircle size={20} color="#64748B" /> : verified ? <CheckCircle size={20} color={theme.palette.success.main} /> : <AlertCircle size={20} color={theme.palette.error.main} />}
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: verified === null ? '#475569' : verified ? theme.palette.success.main : theme.palette.error.main }}>
                    {verified === null ? 'Pending Verification' : verified ? 'Signature Valid' : 'Tampering Detected'}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#475569' }}>
                  {verified === null 
                    ? "Upload a file and click verify to check its cryptographic signature against our immutable ledger." 
                    : verified 
                      ? "The uploaded file has not been tampered with since creation. Cryptographic hash matches the original device signature." 
                      : "Warning: Hash mismatch. The file may have been altered after the incident was reported."}
                </Typography>
              </Box>

              <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 1 }}>SHA-256 Hash</Typography>
              <TextField 
                fullWidth 
                size="small" 
                value={hash || 'N/A'} 
                InputProps={{ readOnly: true, sx: { fontFamily: 'monospace', fontSize: '0.8rem', color: hash ? '#475569' : '#94A3B8', bgcolor: '#F8FAFC' } }}
                sx={{ mb: 4 }}
              />

              <Divider sx={{ mb: 4 }} />

              <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 1 }}>Extracted Metadata</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2">File Name</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{file ? file.name : 'N/A'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2">File Size</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{file ? (file.size / 1024).toFixed(2) + ' KB' : 'N/A'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="body2">Reported Date</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{file ? new Date(file.lastModified).toLocaleString() : 'N/A'}</Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
                <Button fullWidth variant="outlined" color="error" sx={{ py: 1.5 }} disabled={!file} onClick={() => setVerified(false)}>
                  Reject Evidence
                </Button>
                <Button fullWidth variant="contained" color="success" sx={{ py: 1.5, color: '#FFF' }} disabled={!file || verified} onClick={handleVerify}>
                  {verified ? 'Verified Successfully' : 'Verify & Approve'}
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
