import express from "express";
const router = express.Router();

import {
  ajouterCellier,
  modifierCellier,
  supprimerCellier,
  recupererTousCelliers,
  recupererCellier,
} from "../controllers/controller.cellier.js";

// Récupérer tous les celliers d'un utilisateur
router.get("/", recupererTousCelliers); // tous les celliers (avec query param id_utilisateur)
// Récupérer un cellier par son id
router.get("/:id_cellier", recupererCellier);

// Ajouter un cellier
router.post("/:id_utilisateur", ajouterCellier);

// Modifier un cellier (nom ou autre info)
router.put("/:id_utilisateur/:id_cellier", modifierCellier);

// Supprimer un cellier
router.delete("/:id_utilisateur/:id_cellier", supprimerCellier);

export default router;
