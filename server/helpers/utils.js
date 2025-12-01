const getDaysInMonth = (date) => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();

  const firstDay = new Date(Date.UTC(year, month, 1));
  const nextMonthFirstDay = new Date(Date.UTC(year, month + 1, 1));

  const days = (nextMonthFirstDay - firstDay) / (1000 * 60 * 60 * 24);
  return days;
};

const convertField = (value, fieldType = "string") => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  try {
    switch (fieldType) {
      case "string":
        return String(value).trim();

      case "number":
        const num = parseFloat(value);
        return isNaN(num) ? null : num;

      case "int":
        const int = parseInt(value);
        return isNaN(int) ? null : int;

      case "boolean":
        if (typeof value === "boolean") return value;
        if (typeof value === "number") return value !== 0;
        if (typeof value === "string") {
          const str = value.toLowerCase().trim();
          return (
            str === "true" ||
            str === "1" ||
            str === "oui" ||
            str === "yes" ||
            str === "vrai"
          );
        }
        return Boolean(value);

      case "date":
        return parseExcelDate(value);

      default:
        return value;
    }
  } catch (error) {
    console.error(
      `Erreur de conversion pour la valeur "${value}" en type "${fieldType}":`,
      error
    );
    return null;
  }
};

const parseExcelDate = (value) => {
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  // Si c'est déjà un objet Date valide
  if (typeof value === "string") {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // Convertir en nombre - c'est le numéro de jour Excel
  const excelDateNumber = typeof value === "number" ? value : parseFloat(value);

  if (isNaN(excelDateNumber)) {
    return null;
  }

  // Excel date system: 1 = 1900-01-01
  // Correction pour le bug Excel qui considère 1900 comme année bissextile
  const excelEpoch = new Date(1900, 0, 1);
  const daysToAdd = excelDateNumber - (excelDateNumber > 60 ? 2 : 1); // Correction pour le 29/02/1900 qui n'existe pas

  const resultDate = new Date(
    excelEpoch.getTime() + daysToAdd * 24 * 60 * 60 * 1000
  );

  return isNaN(resultDate.getTime()) ? null : resultDate;
};

const formatFrenchDate = (date) => {
  if (!date || isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

module.exports = {
  getDaysInMonth,
  convertField,
};
