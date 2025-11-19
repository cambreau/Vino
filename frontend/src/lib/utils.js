/**
 * Fonction qui prend en parametre un string et le transforme en format utilisable pour id et src.
 * @param {string} nomString
 * @returns {string}
 */
export const formatString = (nomString) => {
  // Faire une copie du string dans une nouvelle constante
  let mot = nomString;
  // Supprimer les espaces de tabulation
  mot = mot.trim();
  // Supprimer les accents
  mot = mot.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // Mettre en minuscule
  mot = mot.toLowerCase();
  // Remplacer les espaces et les underscores par des tirets
  mot = mot.replaceAll(" ", " ").replaceAll("_", " ");
  return mot;
};

/**
 * Fonction qui transforme la premìere lettre en majuscule d'un string.
 * @param {string} string
 * @returns string transformé.
 */
export function formatMajDebut(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
