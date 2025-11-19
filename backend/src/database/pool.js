/**
 * @source backend/src/database/pool.js
 * Objectif:
 * Prolonger `connexion.exemple.js` en documentant les variables requises
 * et en exposant un pool MySQL partage pour l'application Vino.
 */


import mysql from "mysql2/promise";
import "dotenv/config";

const pool = mysql.createPool({
  host: process.env.DB_HOTE || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_UTILISATEUR || "root",
  password: process.env.DB_MOT_DE_PASSE || "",
  database: process.env.DB_BASE_DE_DONNEES || "vino_db",
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_LIMITE_CONNEXIONS || 10),
  namedPlaceholders: true,
  timezone: "Z",
});

export default pool;
