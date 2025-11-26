import express from "express";
const router = express.Router();

import {
  ajoutBouteilleListe,
  recupererListe,
  supprimerBouteilleListe,
  modifierBouteilleListe,
} from "../controllers/controller.listeAchat.js";

// Récupérer la liste d'achat d'un utilisateur
router.get("/:id_utilisateur", recupererListe);

// Ajouter une bouteille à la liste d'achat
router.post("/:id_utilisateur/:id_bouteille", ajoutBouteilleListe);

// Modifier la quantité d'une bouteille dans la liste d'achat
router.put("/:id_utilisateur/:id_bouteille", modifierBouteilleListe);

// Supprimer une bouteille de la liste d'achat
router.delete("/:id_utilisateur/:id_bouteille", supprimerBouteilleListe);

export default router;
