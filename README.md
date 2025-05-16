import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import QrCodeIcon from '@mui/icons-material/QrCode';

const BusinessCardOrange = () => {
  return (
    <Box
      sx={{
        width: 400,
        height: 220,
        borderRadius: 4,
        boxShadow: 4,
        overflow: 'hidden',
        bgcolor: '#fff',
        position: 'relative',
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Bandes latérales */}
      <Box sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 20,
        height: '100%',
        bgcolor: '#e53935',
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        zIndex: 1,
      }} />
      <Box sx={{
        position: 'absolute',
        left: 10,
        top: 0,
        width: 10,
        height: '100%',
        bgcolor: '#181d23',
        zIndex: 2,
      }} />
      <Box sx={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: 20,
        height: '100%',
        bgcolor: '#e53935',
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
        zIndex: 1,
      }} />
      <Box sx={{
        position: 'absolute',
        right: 10,
        top: 0,
        width: 10,
        height: '100%',
        bgcolor: '#181d23',
        zIndex: 2,
      }} />
      {/* Contenu principal */}
      <Box sx={{ position: 'relative', zIndex: 3, height: '100%', px: 4, py: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* Logo et titre */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Box sx={{ mb: 1 }}>
              {/* Logo stylisé */}
              <Box sx={{ width: 54, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ width: 44, height: 44, bgcolor: '#fff', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #e53935' }}>
                  {/* Remplace ce logo par une image si besoin */}
                  <Typography variant="h4" sx={{ color: '#e53935', fontWeight: 900, fontFamily: 'monospace' }}>W</Typography>
                </Box>
              </Box>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#232323', mt: 1, letterSpacing: 1 }}>ASSOCIATION</Typography>
            <Typography variant="body2" sx={{ color: '#888', fontSize: 12 }}>YOUR COMPANY TAGLINE HERE</Typography>
          </Box>
          {/* Nom et fonction */}
          <Box sx={{ textAlign: 'right', mt: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#232323', letterSpacing: 1 }}>JENSON ROY</Typography>
            <Typography variant="body2" sx={{ color: '#232323', borderBottom: '2px solid #bdbdbd', display: 'inline-block', fontWeight: 500, fontSize: 13, mt: 0.5 }}>
              MANAGING MEMBER
            </Typography>
          </Box>
        </Box>
        {/* Infos et QR code */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 2 }}>
          {/* QR Code */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
            <Box sx={{ width: 64, height: 64, border: '2px solid #232323', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <QrCodeIcon sx={{ fontSize: 40, color: '#232323' }} />
            </Box>
          </Box>
          {/* Infos */}
          <Stack spacing={1} sx={{ mb: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <PhoneIcon fontSize="small" sx={{ color: '#232323' }} />
              <Typography variant="body2" sx={{ color: '#232323' }}>(000) 12345 6789</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <EmailIcon fontSize="small" sx={{ color: '#232323' }} />
              <Typography variant="body2" sx={{ color: '#232323' }}>jenson@mail.com</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <LocationOnIcon fontSize="small" sx={{ color: '#232323' }} />
              <Typography variant="body2" sx={{ color: '#232323' }}>Your Address here</Typography>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default BusinessCardOrange; 
