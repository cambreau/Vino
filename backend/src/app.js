// Framework principal pour créer le serveur HTTP et gérer les routes
import express from "express";
// Middleware pour autoriser les requêtes cross-origin
import cors from "cors";
// Middleware pour afficher les requêtes HTTP dans la console
import morgan from "morgan";
// Middleware pour charger les variables d'environnement depuis un fichier .env
import "dotenv/config";
// Routeur principal de l'application
import vinoRouter from "./routes/routes.js";

// Création de l'application Express
const app = express();

// Logger HTTP : affiche les requêtes entrantes dans la console
app.use(morgan("short"));

// Autorise les requêtes provenant d'autres domaines (React)
app.use(cors());

// Middleware pour parser le JSON
app.use(express.json());
// Parse les données de formulaires
app.use(express.urlencoded({ extended: true }));

// Routes api
app.use("/api/vino", vinoRouter);

// Test route
app.get("/", (req, res) => {
  res.send("Backend fonctionne!");
});

export default app;
