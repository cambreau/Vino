import express from "express";
const router = express.Router();

import {
  ajouterCellier,
  recupererCellier,
  modifierCellier,
  supprimerCellier,
  recupererTousCelliers,
} from "../controllers/controller.cellier.js";

// Récupérer tous les celliers d'un utilisateur ou un seul
router.get("/", recupererTousCelliers); // tous les celliers (avec query param id_utilisateur)
router.get("/:id_utilisateur/:id_cellier", recupererCellier); // cellier spécifique

// Ajouter un cellier
router.post("/:id_utilisateur", ajouterCellier);

// Modifier un cellier (nom ou autre info)
router.put("/:id_utilisateur/:id_cellier", modifierCellier);

// Supprimer un cellier
router.delete("/:id_utilisateur/:id_cellier", supprimerCellier);

export default router;
