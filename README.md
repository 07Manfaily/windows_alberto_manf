const parseDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== "string") return null;

  // Nettoyer la chaîne
  const cleanStr = dateStr.trim();
  const separator = cleanStr.includes("/") ? "/" : cleanStr.includes("-") ? "-" : null;
  if (!separator) return null;

  const parts = cleanStr.split(separator).map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;

  const [day, month, year] = parts;
  const date = new Date(year, month - 1, day);

  // Vérifie que la date est valide
  return isNaN(date.getTime()) ? null : date.getTime();
};
