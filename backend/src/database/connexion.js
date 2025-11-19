import "dotenv/config";
import mysql from "mysql2/promise";

export const connexion = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_ROOT_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const requetesCritiques = [
  {
    nom: "recupererProduitsDisponibles",
    pseudoSql:
      "SELECT * FROM produits WHERE disponibilite = TRUE ORDER BY popularite DESC;",
    indexSuggere: ["produits(disponibilite, popularite)"],
  },
];
