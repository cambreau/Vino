/**
 * @source backend/src/controllers/controller.bouteille.js
 * Objectif:
 * Gérer les bouteilles dans un cellier spécifique.
 */

import modeleBouteilleCellier from "../models/modele.bouteilleCellier.js";

export const afficherBouteilleDuCellier = async (req, res) => {};

export const modifierBouteilleDuCellier = async (req, res) => {};

export const ajouterBouteilleDuCellier = async (req, res) => {
  try {
    const { idCellier } = req.params;
    const identifiantCellier = Number.parseInt(idCellier, 10);

    const { idBouteille } = req.body;
    const identifiantBouteille = Number.parseInt(idBouteille, 10);

    let { quantite = 1 } = req.body;
    quantite = Number.parseInt(quantite, 10);

    // Validation des ID
    if (!identifiantCellier || !identifiantBouteille) {
      return res
        .status(400)
        .json({ message: "ID cellier et ID bouteille requis" });
    }

    const action = await modeleBouteilleCellier.ajouter(
      identifiantCellier,
      identifiantBouteille,
      quantite
    );

    res
      .status(201)
      .json({ message: "Bouteille ajoutée au cellier", id: action });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const supprimerBouteilleDuCellier = async (req, res) => {};
