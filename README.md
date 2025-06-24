<Grid item xs={12} md={6}>
  <TextField
    fullWidth
    label="Champ A"
    value={formData.step5?.a || ''}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        step5: {
          ...prev.step5,
          a: e.target.value,
        },
      }))
    }
  />
</Grid>

<Grid item xs={12} md={6}>
  <TextField
    fullWidth
    label="Champ B"
    value={formData.step5?.b || ''}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        step5: {
          ...prev.step5,
          b: e.target.value,
        },
      }))
    }
  />
</Grid>
