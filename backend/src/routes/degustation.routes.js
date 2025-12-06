import express from "express";
const router = express.Router();

export default router;

import {
  recupererDegustationsBouteille,
  recupererDegustationsUtilisateur,
  recupererDegustationBouteille,
  ajouterDegustation,
  modifierDegustation,
  supprimerDegustation,
} from "../controllers/controller.degustation.js";

// IMPORTANT: Les routes plus spécifiques doivent être définies AVANT les routes génériques
// pour éviter que "utilisateur" soit interprété comme un id_utilisateur

// Récupérer les dégustations d'un utilisateur par son id
router.get("/utilisateur/:id_utilisateur", recupererDegustationsUtilisateur);

// Récupérer une note de dégustations d'une bouteille par son id
router.get("/:id_utilisateur/:id_bouteille", recupererDegustationBouteille);

// Récupérer les dégustations d'une bouteille par son id
router.get("/:id_bouteille", recupererDegustationsBouteille);

// Ajouter une dégustation
router.post("/", ajouterDegustation);

// Modifier une dégustation (id_utilisateur et id_bouteille dans l'URL)
router.put("/:id_utilisateur/:id_bouteille", modifierDegustation);

// Supprimer une dégustation (id_utilisateur et id_bouteille dans l'URL)
router.delete("/:id_utilisateur/:id_bouteille", supprimerDegustation);
