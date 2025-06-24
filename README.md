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

const DirectionEffectifManager = ({ 
  onDataChange, // Callback pour envoyer les données au parent
  initialData = [], // Données initiales (optionnel)
  title = "Gestion des Effectifs par Direction" // Titre personnalisable
}) => {
  const [selectedDirection, setSelectedDirection] = useState('');
  const [effectif, setEffectif] = useState('');
  const [tableData, setTableData] = useState(initialData);
  const [error, setError] = useState('');

  // Liste des directions disponibles
  const directions = [
    'Direction Générale',
    'Direction des Ressources Humaines',
    'Direction Financière',
    'Direction Commerciale',
    'Direction Technique',
    'Direction Marketing',
    'Direction Juridique',
    'Direction de la Production'
  ];

  // Envoyer les données au parent chaque fois que tableData change
  useEffect(() => {
    if (onDataChange) {
      const dataWithoutId = tableData.map(({ id, ...rest }) => rest);
      onDataChange({
        tableDataWithId: tableData, // Données complètes avec ID (pour l'interface)
        tableDataForSubmit: dataWithoutId, // Données sans ID (pour l'envoi)
        totalEffectif: tableData.reduce((total, item) => total + item.effectif, 0)
      });
    }
  }, [tableData, onDataChange]);

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
    
    if (existingIndex !== -1) {
      // Mettre à jour l'effectif existant
      const updatedData = [...tableData];
      updatedData[existingIndex].effectif = parseInt(effectif);
      setTableData(updatedData);
    } else {
      // Ajouter une nouvelle entrée
      const newEntry = {
        id: Date.now(),
        direction: selectedDirection,
        effectif: parseInt(effectif)
      };
      setTableData([...tableData, newEntry]);
    }

    // Reset du formulaire
    setSelectedDirection('');
    setEffectif('');
  };

  const handleDelete = (id) => {
    setTableData(tableData.filter(item => item.id !== id));
  };

  const getTotalEffectif = () => {
    return tableData.reduce((total, item) => total + item.effectif, 0);
  };

  // Fonction pour obtenir les données sans ID (utilisable directement)
  const getDataForSubmit = () => {
    return tableData.map(({ id, ...rest }) => rest);
  };

  // Fonction pour envoyer les données (exemple)
  const handleSendData = async () => {
    const dataToSend = getDataForSubmit();
    console.log('Données à envoyer:', dataToSend);
    
    try {
      // Exemple d'envoi vers une API
      /*
      const response = await fetch('/api/effectifs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      
      if (response.ok) {
        alert('Données envoyées avec succès !');
      } else {
        alert('Erreur lors de l\'envoi des données');
      }
      */
      
      // Pour la démonstration, on affiche juste dans la console
      alert(`Données préparées pour l'envoi : ${JSON.stringify(dataToSend, null, 2)}`);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'envoi des données');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  // Fonction publique pour obtenir les données (peut être appelée depuis le parent)
  const getData = () => ({
    withId: tableData,
    forSubmit: getDataForSubmit(),
    total: getTotalEffectif()
  });

  // Exposer la fonction getData au parent via une ref (optionnel)
  React.useImperativeHandle(React.forwardRef(() => null), () => ({
    getData,
    clearData: () => setTableData([]),
    setData: (data) => setTableData(data)
  }));

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        {title}
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
              >
                Ajouter
              </Button>
            </Grid>
          </Grid>

          {/* Bouton d'envoi des données */}
          {tableData.length > 0 && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="outlined"
                color="success"
                onClick={handleSendData}
                size="large"
              >
                Envoyer les données
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Résumé des données */}
      {tableData.length > 0 && (
        <Card sx={{ mb: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📊 Résumé
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body1">
                  <strong>Directions ajoutées:</strong> {tableData.length}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  <strong>Total effectifs:</strong> {getTotalEffectif().toLocaleString()} employés
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

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

      {/* Section Debug - Affichage des données actuelles */}
      {tableData.length > 0 && (
        <Card sx={{ mt: 3, bgcolor: 'grey.50' }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              🔍 Données actuelles (pour debug)
            </Typography>
            <Typography variant="body2" component="div">
              <strong>Données avec ID (interface):</strong>
              <pre style={{ fontSize: '11px', marginTop: '8px', overflow: 'auto' }}>
                {JSON.stringify(tableData, null, 2)}
              </pre>
            </Typography>
            <Typography variant="body2" component="div" sx={{ mt: 2 }}>
              <strong>Données sans ID (pour envoi):</strong>
              <pre style={{ fontSize: '11px', marginTop: '8px', overflow: 'auto' }}>
                {JSON.stringify(getDataForSubmit(), null, 2)}
              </pre>
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default DirectionEffectifManager;
