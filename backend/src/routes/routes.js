import express from "express";

import utilisateurRoutes from "./utilisateur.routes.js";

const router = express.Router();

// Routes backend de VINO
router.use("/utilisateurs", utilisateurRoutes);

export default router;
