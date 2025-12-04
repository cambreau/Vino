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
router.get("/:id_bouteille", recupererDegustationsBouteille);

// Récupérer les dégustations d'un utilisateur par son id
router.get("/utilisateur/:id_utilisateur", recupererDegustationsUtilisateur);

// Ajouter une dégustation
router.post("/", ajouterDegustation);

// Modifier une dégustation (id_utilisateur et id_bouteille dans l'URL)
router.put("/:id_utilisateur/:id_bouteille", modifierDegustation);

// Supprimer une dégustation (id_utilisateur et id_bouteille dans l'URL)
router.delete("/:id_utilisateur/:id_bouteille", supprimerDegustation);
