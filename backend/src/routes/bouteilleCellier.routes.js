import express from "express";
const router = express.Router();

import {
  modifierBouteilleDuCellier,
  ajouterBouteilleDuCellier,
  supprimerBouteilleDuCellier,
  recupererBouteilleDuCellier,
} from "../controllers/controller.bouteilleCellier.js";

router.get("/:idCellier", recupererBouteilleDuCellier);
router.post("/:idCellier", ajouterBouteilleDuCellier);
router.put("/:idCellier/:idBouteille", modifierBouteilleDuCellier);
router.delete("/:idCellier/:idBouteille", supprimerBouteilleDuCellier);

export default router;
