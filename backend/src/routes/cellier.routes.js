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
router.get("/:idUtilisateur/:idCellier", recupererCellier); // cellier spécifique

// Ajouter un cellier
router.post("/:idUtilisateur", ajouterCellier);

// Modifier un cellier (nom ou autre info)
router.put("/:idUtilisateur/:idCellier", modifierCellier);

// Supprimer un cellier
router.delete("/:idUtilisateur/:idCellier", supprimerCellier);

export default router;
