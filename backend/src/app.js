import express from 'express';
import vinoRouter from './routes/routes.js';

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Routes api
app.use('/api/vino', vinoRouter);

// Test route ( Future page d'accueil )
app.get('/', (req, res) => {
  res.send('Backend fonctionne!');
});

export default app;
