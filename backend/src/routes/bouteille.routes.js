/**
 * @source backend/src/routes/bouteille.routes.js
 * Sources:
 * 1. Express.Router — composition de routes modulaires.
 *    1.1. https://expressjs.com/fr/guide/routing.html
 * 2. Convention REST CRUD — correspondance GET/POST/PUT/DELETE.
 *    2.1. https://restfulapi.net/http-methods/
 * 3. Documentation interne (`routes.exemple.js`) — structure declarative retenue.
 *    3.1. Voir backend/src/routes
 * Objectif:
 * Rattacher les actions du controleur aux routes Express et documenter
 * explicitement la surface REST exposee par le domaine bouteille.
 */


import express from "express";
import {
  creerBouteille,
  importerBouteillesDepuisSAQ,
  listerBouteilles,
  modifierBouteille,
  recupererBouteille,
  supprimerBouteille,
} from "../controllers/controller.bouteille.js";

const router = express.Router();

// GET / - Lister toutes les bouteilles
router.get("/", listerBouteilles);
// GET /:id - Recuperer une bouteille par ID
router.get("/:id", recupererBouteille);
// POST / - Creer une nouvelle bouteille
router.post("/", creerBouteille);
// PUT /:id - Modifier une bouteille existante
router.put("/:id", modifierBouteille);
// DELETE /:id - Supprimer une bouteille
router.delete("/:id", supprimerBouteille);
// POST /import - Importer des bouteilles depuis SAQ
router.post("/import", importerBouteillesDepuisSAQ);

export default router;
