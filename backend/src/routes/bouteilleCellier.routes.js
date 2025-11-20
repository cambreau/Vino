import express from "express";
const router = express.Router();

import {
  afficherBouteilleDuCellier,
  modifierBouteilleDuCellier,
  ajouterBouteilleDuCellier,
  supprimerBouteilleDuCellier,
} from "../controllers/controller.bouteilleCellier.js";

router.get("/:idCellier", afficherBouteilleDuCellier);
router.post("/:idCellier", ajouterBouteilleDuCellier);
router.put("/:idCellier/:idBouteille", modifierBouteilleDuCellier);
router.delete("/:idCellier/:idBouteille", supprimerBouteilleDuCellier);

export default router;
