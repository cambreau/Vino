/**
 * @source backend/src/database/pool.js
 * Objectif:
 * Prolonger `connexion.exemple.js` en documentant les variables requises
 * et en exposant un pool MySQL partage pour l'application Vino.
 */


import mysql from "mysql2/promise";
import "dotenv/config";

const pool = mysql.createPool({
  hote: process.env.DB_HOTE || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  utilisateur: process.env.DB_UTILISATEUR || "root",
  motDePasse: process.env.DB_MOT_DE_PASSE || "",
  baseDeDonnees: process.env.DB_BASE_DE_DONNEES || "vino_db",
  attendreLesConnexions: true,
  limiteDeConnexions: Number(process.env.DB_LIMITE_CONNEXIONS || 10),
  nomsDeParametres: true,
  fuseauHoraire: "Z",
});

export default pool;
