import "dotenv/config";
import mysql from "mysql2/promise";

const configuration = {
  host: process.env.DB_HOST || process.env.DB_HOTE || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_ROOT_USER || process.env.DB_UTILISATEUR || "root",
  password: process.env.DB_PASSWORD || process.env.DB_MOT_DE_PASSE || "",
  database: process.env.DB_NAME || process.env.DB_BASE_DE_DONNEES || "vino_db",
  timezone: "Z",
};

const connexion = await mysql.createConnection(configuration);

// Offre une API ressemblant au pool historique pour limiter les changements.
connexion.getConnection = async () => connexion;
connexion.release = async () => {};
connexion.releaseConnection = async () => {};
const boundQuery = connexion.query.bind(connexion);
const boundExecute = connexion.execute.bind(connexion);
connexion.query = boundQuery;
connexion.execute = boundExecute;

export { connexion };
export default connexion;

export const requetesCritiques = [
  {
    nom: "recupererProduitsDisponibles",
    pseudoSql:
      "SELECT * FROM produits WHERE disponibilite = TRUE ORDER BY popularite DESC;",
    indexSuggere: ["produits(disponibilite, popularite)"],
  },
];
