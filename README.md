// Étape 3: Planning et participants
const Step3 = ({ formData, setFormData, errors }) => {
  let time = formData.step3.duree_jours * 8
  let day = formData.step3.duree_heures / 8
  formData.step3.duree_heures = time
  formData.step3.duree_jours = day

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    
    if (field === 'duree_heures') {
      // Calculer automatiquement les jours quand les heures changent
      const calculatedDays = value ? (parseFloat(value) / 8) : '';
      setFormData(prev => ({
        ...prev,
        step3: { 
          ...prev.step3, 
          duree_heures: value,
          duree_jours: calculatedDays
        }
      }));
    } else if (field === 'duree_jours') {
      // Calculer automatiquement les heures quand les jours changent
      const calculatedHours = value ? (parseFloat(value) * 8) : '';
      setFormData(prev => ({
        ...prev,
        step3: { 
          ...prev.step3, 
          duree_jours: value,
          duree_heures: calculatedHours
        }
      }));
    } else {
      // Pour les autres champs, comportement normal
      setFormData(prev => ({
        ...prev,
        step3: { ...prev.step3, [field]: event.target.value }
      }));
    }
  };

  return (
    <StepComponent
      title="Planning et Participants"
      description="Datés, durée et profil des participants"
      icon={<Schedule sx={{ color: 'white', fontSize: 20 }} />}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          {/* Vous, last week • first commit(sprint) ... */}
        </Grid>
        <Grid item xs={12} sm={6}>
          {/* ... */}
        </Grid>
        
        {/* Champ Durée (Jours) */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Durée (jours)"
            type="number"
            variant="outlined"
            value={formData.step3.duree_jours}
            onChange={handleChange('duree_jours')}
            error={!!errors.duree_jours}
            helperText={errors.duree_jours}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#2196f3'
                }
              }
            }}
            inputProps={{
              step: 0.1,
              min: 0
            }}
          />
        </Grid>

        {/* Champ Durée (Heures) */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Durée (heures)"
            type="number"
            variant="outlined"
            value={formData.step3.duree_heures}
            onChange={handleChange('duree_heures')}
            error={!!errors.duree_heures}
            helperText={errors.duree_heures}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#2196f3'
                }
              }
            }}
            inputProps={{
              step: 0.1,
              min: 0
            }}
          />
        </Grid>
        
        {/* Affichage de la conversion pour information */}
        {(formData.step3.duree_heures || formData.step3.duree_jours) && (
          <Grid item xs={12}>
            <div style={{
              padding: '12px',
              backgroundColor: '#e3f2fd',
              borderRadius: '8px',
              border: '1px solid #2196f3'
            }}>
              <p style={{ 
                margin: 0, 
                color: '#1976d2', 
                fontSize: '14px',
                fontWeight: 500 
              }}>
                💡 Conversion : {formData.step3.duree_heures || 0} heures = {formData.step3.duree_jours || 0} jours (1 jour = 8h)
              </p>
            </div>
          </Grid>
        )}

        {/* Vos autres champs existants... */}
      </Grid>
    </StepComponent>
  );
};
