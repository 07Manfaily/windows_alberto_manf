import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Grid,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const Step6 = ({ formData, setFormData, errors }) => {
  const [loading, setLoading] = useState(false);
  const [selectedDirection, setSelectedDirection] = useState('');
  const [effectif, setEffectif] = useState('');
  const [error, setError] = useState('');

  // Liste des directions disponibles
  const directions = [
    'Direction Innovation',
    'Direction Générale',
    'Direction des Ressources Humaines',
    'Direction Financière',
    'Direction Commerciale',
    'Direction DALI',
    'Direction Marketing',
    'Direction Juridique'
  ];

  // Initialiser tableData depuis formData au chargement du composant
  useEffect(() => {
    if (!formData.effectifs) {
      setFormData(prev => ({
        ...prev,
        effectifs: []
      }));
    }
  }, [formData, setFormData]);

  const tableData = formData.effectifs || [];

  const handleSubmit = () => {
    setError('');
    
    if (!selectedDirection || !effectif) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (isNaN(effectif) || parseInt(effectif) < 0) {
      setError('L\'effectif doit être un nombre positif');
      return;
    }

    // Vérifier si la direction existe déjà
    const existingIndex = tableData.findIndex(item => item.direction === selectedDirection);
    
    let updatedTableData;
    
    if (existingIndex !== -1) {
      // Mettre à jour l'effectif existant
      updatedTableData = [...tableData];
      updatedTableData[existingIndex].effectif = parseInt(effectif);
    } else {
      // Ajouter une nouvelle entrée
      const newEntry = {
        id: Date.now(),
        direction: selectedDirection,
        effectif: parseInt(effectif)
      };
      updatedTableData = [...tableData, newEntry];
    }

    // Mettre à jour formData
    setFormData(prev => ({
      ...prev,
      effectifs: updatedTableData
    }));

    // Reset du formulaire local
    setSelectedDirection('');
    setEffectif('');
  };

  const handleDelete = (id) => {
    const updatedTableData = tableData.filter(item => item.id !== id);
    setFormData(prev => ({
      ...prev,
      effectifs: updatedTableData
    }));
  };

  const getTotalEffectif = () => {
    return tableData.reduce((total, item) => total + item.effectif, 0);
  };

  // Fonction pour préparer les données sans l'id (pour envoi final)
  const getDataWithoutId = () => {
    return tableData.map(({ id, ...rest }) => rest);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  // Mettre à jour formData avec les données finales (sans id) pour l'envoi
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      effectifsForSubmit: getDataWithoutId()
    }));
  }, [tableData, setFormData]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Étape 6 - Gestion des Effectifs par Direction
      </Typography>
      
      {/* Formulaire */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Ajouter une Direction
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Afficher les erreurs du formulaire principal si elles existent */}
          {errors?.effectifs && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.effectifs}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <FormControl fullWidth>
                <InputLabel id="direction-select-label">Direction</InputLabel>
                <Select
                  labelId="direction-select-label"
                  id="direction-select"
                  value={selectedDirection}
                  label="Direction"
                  onChange={(e) => setSelectedDirection(e.target.value)}
                >
                  {directions.map((direction, index) => (
                    <MenuItem key={index} value={direction}>
                      {direction}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="effectif"
                label="Effectif"
                type="number"
                value={effectif}
                onChange={(e) => setEffectif(e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                  inputProps: { min: 0 }
                }}
                helperText="Nombre d'employés"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleSubmit}
                fullWidth
                sx={{ height: 56 }}
                disabled={loading}
              >
                Ajouter
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Résumé des données dans formData */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Données actuelles dans formData
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total des directions: {tableData.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total des effectifs: {getTotalEffectif()} employés
          </Typography>
        </CardContent>
      </Card>

      {/* Tableau */}
      {tableData.length > 0 ? (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Box sx={{ p: 2, backgroundColor: 'primary.main', color: 'white' }}>
            <Typography variant="h6" component="div">
              Effectifs par Direction
            </Typography>
          </Box>
          
          <TableContainer>
            <Table stickyHeader aria-label="tableau effectifs">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.100' }}>
                    Nom de la Direction
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.100' }}>
                    Effectif
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'grey.100' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'grey.50' } }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {item.direction}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        {item.effectif.toLocaleString()} {item.effectif > 1 ? 'employés' : 'employé'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleDelete(item.id)}
                        color="error"
                        aria-label="supprimer"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Ligne de total */}
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>
                    <Typography variant="h6">
                      Total
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>
                    <Typography variant="h6">
                      {getTotalEffectif().toLocaleString()} employés
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Aucune donnée disponible
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Ajoutez une direction et son effectif pour commencer
          </Typography>
        </Paper>
      )}

      {/* Debug info - à supprimer en production */}
      <Card sx={{ mt: 3, bgcolor: 'grey.50' }}>
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            Debug - Structure formData (à supprimer en production)
          </Typography>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify({ 
              effectifs: formData.effectifs, 
              effectifsForSubmit: formData.effectifsForSubmit 
            }, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Step6;
