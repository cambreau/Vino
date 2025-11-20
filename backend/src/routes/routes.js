import express from "express";

import bouteilleRoutes from "./bouteille.routes.js";
import utilisateurRoutes from "./utilisateur.routes.js";

const router = express.Router();

// Routes backend de VINO
router.use("/utilisateurs", utilisateurRoutes);
router.use("/bouteilles", bouteilleRoutes);

export default router;
