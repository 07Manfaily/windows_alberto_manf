const Step6 = ({ formData, setFormData, errors }) => {
  const [selectedDirection, setSelectedDirection] = useState('');
  const [effectif, setEffectif] = useState('');
  const [error, setError] = useState('');

  // Utiliser formData.tableData au lieu de l'état local
  const tableData = formData.tableData || [];

  // Fonction pour mettre à jour tableData dans formData
  const updateTableData = (newTableData) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      tableData: newTableData
    }));
  };

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
    let newTableData;

    if (existingIndex !== -1) {
      // Mettre à jour l'effectif existant
      newTableData = [...tableData];
      newTableData[existingIndex].effectif = parseInt(effectif);
    } else {
      // Ajouter une nouvelle entrée
      const newEntry = {
        id: Date.now(),
        direction: selectedDirection,
        effectif: parseInt(effectif)
      };
      newTableData = [...tableData, newEntry];
    }

    // Mettre à jour formData
    updateTableData(newTableData);

    // Reset du formulaire
    setSelectedDirection('');
    setEffectif('');
  };

  const handleDelete = (id) => {
    const newTableData = tableData.filter(item => item.id !== id);
    updateTableData(newTableData);
  };

  const getTotalEffectif = () => {
    return tableData.reduce((total, item) => total + item.effectif, 0);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Gestion des Effectifs par Direction
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
          
          {/* Afficher les erreurs des props si elles existent */}
          {errors?.tableData && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.tableData}
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
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { backgroundColor: 'grey.50' }
                    }}
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
    </Box>
  );
};
