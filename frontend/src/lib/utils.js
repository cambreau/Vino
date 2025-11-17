/**
 * Fonction qui prend en parametre un string et le transforme en format utilisable pour id et src.
 * @param {string} nomString
 * @returns {string}
 */
export const formatteString = (nomString) => {
  //Faire une copie du string dans une nouvelle constante.
  let nom = nomString;
  //Supprimer les espaces de tabulation
  nom = nom.trim();
  //Supprimer les accents
  nom = nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  //Mettre en minuscule
  nom = nom.toLowerCase();
  //Remplacer les espaces
  nom = nom.replaceAll(" ", "-");
  return nom;
};
