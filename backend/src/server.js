// Charger les variables d'environnement depuis un fichier .env (si présent)
import 'dotenv/config';
import app from './app.js';

// Définir le port d'écoute
const PORT = process.env.PORT || 3000;

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur roule sur http://localhost:${PORT}`);
});
