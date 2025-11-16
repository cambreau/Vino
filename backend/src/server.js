// Charger les variables d'environnement depuis un fichier .env (si présent)
import 'dotenv/config';
import express from "express";

const app = express();
const PORT = 3000;

// Middleware pour analyser le JSON
app.use(express.json());

// route de test sur l'url de base
app.get("/", (req, res) => {
  res.send("Backend fonctionne! ");
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur roule sur http://localhost:${PORT}`);
});
