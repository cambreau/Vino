import express from "express";
const router = express.Router();

export default router;

import {
  recupererDegustationsBouteille,
  recupererDegustationsUtilisateur,
  ajouterDegustation,
  modifierDegustation,
  supprimerDegustation,
} from "../controllers/controller.degustation.js";

// Récupérer les dégustations d'une bouteille par son id
router.get("/bouteille/:id_bouteille", recupererDegustationsBouteille);

// Récupérer les dégustations d'un utilisateur par son id
router.get("/utilisateur/:id_utilisateur", recupererDegustationsUtilisateur);

// Ajouter une dégustation
router.post("/", ajouterDegustation);

// Modifier une dégustastion
router.put("/", modifierDegustation);

// Supprimer une dégustation
router.delete("/:id_bouteille/:id_utilisateur", supprimerDegustation);
