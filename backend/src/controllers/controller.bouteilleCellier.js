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
    // Obtiens le idCellier avec l'url grâce à la route en utilisant req.params
    const { idCellier } = req.params;
    const identifiantCellier = Number.parseInt(idCellier, 10);

    // Obtiens le idBouteille avec
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

    // Vérifie si la bouteille existe déjà dans le cellier
    const [rows] = await connexion.query(
      "SELECT * FROM bouteilleCellier WHERE id_cellier = ? AND id_bouteille = ?",
      [identifiantCellier, identifiantBouteille]
    );

    // Si on obtiens une rangée contenant la même bouteille, lance un message d'erreur
    if (rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Cette bouteille est déjà dans le cellier" });
    }

    // Requête pour ajouter avec informations
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
