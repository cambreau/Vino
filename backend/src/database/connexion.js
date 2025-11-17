import "dotenv/config";

export const connexion = {
  moteur: "mysql",
  hote: process.env.DB_HOST,
  port: process.env.DB_PORT,
  nomBase: process.env.DB_NAME,
  utilisateur: process.env.DB_ROOT_USER,
  motDePasse: process.env.DB_PASSWORD,
};

export const requetesCritiques = [
  {
    nom: "recupererProduitsDisponibles",
    pseudoSql:
      "SELECT * FROM produits WHERE disponibilite = TRUE ORDER BY popularite DESC;",
    indexSuggere: ["produits(disponibilite, popularite)"],
  },
];
