import express from "express";
const router = express.Router();

import {
  creerUtilisateur,
  recupererUtilisateur,
  recupererUtilisateurParEmail,
  modifierUtilisateur,
  supprimerUtilisateur,
  connexionUtilisateur
} from "../controllers/controller.utilisateur.js";

// POST / - Creer un utilisateur
router.post("/", creerUtilisateur);

// GET //:id - Recuperer un utilisateur
router.get("/:id", recupererUtilisateur);

// GET //email/:email - Trouver par email
router.get("/email/:email", recupererUtilisateurParEmail);

// PUT //:id - Mettre à jour un utilisateur
router.put("/:id", modifierUtilisateur);

// DELETE //:id - Supprimer un utilisateur
router.delete("/:id", supprimerUtilisateur);


// POST /connexion - Connexion d'un utilisateur
router.post("/connexion", connexionUtilisateur);


export default router;
