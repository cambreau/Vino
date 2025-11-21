import express from "express";
const router = express.Router();

import {
  creerUtilisateur,
  recupererUtilisateur,
  recupererUtilisateurParCourriel,
  modifierUtilisateur,
  supprimerUtilisateur,
  connexionUtilisateur,

} from "../controllers/controller.utilisateur.js";

import {
  validerConnexionUtilisateur,
  validerDonneesUtilisateur,

} from "../middlewares/validation.utilisateur.js";

// POST / - Creer un utilisateur
router.post("/", validerDonneesUtilisateur, creerUtilisateur);

// GET //:id - Recuperer un utilisateur
router.get("/:id", recupererUtilisateur);

// GET //email/:email - Trouver par email
router.get("/email/:email", recupererUtilisateurParCourriel);

// PUT //:id - Mettre à jour un utilisateur
router.put("/:id", validerDonneesUtilisateur, modifierUtilisateur);

// DELETE //:id - Supprimer un utilisateur
router.delete("/:id", supprimerUtilisateur);

// POST /connexion - Connexion d'un utilisateur
router.post("/connexion", validerConnexionUtilisateur, connexionUtilisateur);

export default router;
