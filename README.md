import React from 'react';
import { 
  Container,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Stack
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const LoginPage = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h5" gutterBottom>
          SOCIÉTÉ GENERALE
        </Typography>
        <Typography variant="subtitle1">
          CÔTÉ D’IVOIRE
        </Typography>
      </Box>

      {/* Navigation Links */}
      <Stack direction="row" justifyContent="center" spacing={3} mb={4}>
        <Button variant="text" sx={{ textDecoration: 'underline' }}>Créer</Button>
        <Button variant="text" sx={{ textDecoration: 'underline' }}>Mes Contacts</Button>
        <Button variant="text" sx={{ textDecoration: 'underline' }}>A propos de nous</Button>
      </Stack>

      <Divider sx={{ my: 4 }} />

      {/* Login Section */}
      <Typography variant="h6" gutterBottom>
        Se connecter
      </Typography>

      {/* Checkbox Steps */}
      {[
        "Je reinsigne mes informations",
        "Je choisis mon template",
        "Je renseigne mes informations",
        "Je renseigne mes informations"
      ].map((label, index) => (
        <Box key={index} sx={{ ml: 2, mb: 2 }}>
          <FormControlLabel
            control={<Checkbox />}
            label={label}
            sx={{ alignItems: 'flex-start' }}
          />
          <TextField
            variant="outlined"
            fullWidth
            sx={{ ml: 4, mt: 1 }}
            placeholder=" "
            InputProps={{ endAdornment: '>' }}
          />
        </Box>
      ))}

      {/* Download Button */}
      <Box textAlign="center" mt={4}>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          sx={{ textTransform: 'none' }}
        >
          Télécharger PNG
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
