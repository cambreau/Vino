import express from "express";
const router = express.Router();

import {
  ajouterCellier,
  recupererCellier,
  modifierCellier,
  supprimerCellier,
} from "../controllers/controller.cellier.js";

// Récupérer tous les celliers d'un utilisateur ou un seul
router.get("/", recupererCellier); // tous les celliers
router.get("/:idCellier", recupererCellier); // cellier spécifique

// Ajouter un cellier
router.post("/", ajouterCellier);

// Modifier un cellier (nom ou autre info)
router.put("/:idCellier", modifierCellier);

// Supprimer un cellier
router.delete("/:idCellier", supprimerCellier);

export default router;
