import express from "express";

import bouteilleRoutes from "./bouteille.routes.js";
import utilisateurRoutes from "./utilisateur.routes.js";
import bouteilleCellierRoutes from "./bouteilleCellier.routes.js";
import cellierRoutes from "./cellier.routes.js";
import listeAchatRoutes from "./listeAchat.routes.js";

const router = express.Router();

// Routes backend de VINO
router.use("/utilisateurs", utilisateurRoutes);
router.use("/bouteilles", bouteilleRoutes);
router.use("/bouteillesCellier", bouteilleCellierRoutes);
router.use("/cellier", cellierRoutes);
router.use("/listeAchat", listeAchatRoutes);

export default router;
