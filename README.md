<TextField
  fullWidth
  label="Champ B"
  value={formData.step5?.b || ''}
  InputProps={{ readOnly: true }}
/>

useEffect(() => {
  const a = Number(formData.step5?.a);
  const count = selectedUsers.length;

  if (!isNaN(a) && a > 0) {
    const b = count / a;

    setFormData((prev) => ({
      ...prev,
      step5: {
        ...prev.step5,
        b: b.toFixed(2), // ou Math.floor(b) si tu veux un entier
      },
    }));
  } else {
    // Si A est vide ou invalide, on vide B
    setFormData((prev) => ({
      ...prev,
      step5: {
        ...prev.step5,
        b: '',
      },
    }));
  }
}, [formData.step5?.a, selectedUsers]);
