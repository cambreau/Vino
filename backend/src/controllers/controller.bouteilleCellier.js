/**
 * @source backend/src/controllers/controller.bouteille.js
 * Objectif:
 * Gérer les bouteilles dans un cellier spécifique.
 */

import modeleBouteilleCellier from "../models/modele.bouteilleCellier.js";

export const recupererBouteilleDuCellier = async (req, res) => {
  try {
    const { idCellier } = req.params;
    const id = Number.parseInt(idCellier, 10);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "ID de cellier invalide",
      });
    }

    const bouteilles = await modeleBouteilleCellier.recuperer(id);

    return res.status(200).json({
      message: "Bouteilles du cellier récupérées avec succès",
      donnees: bouteilles,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des bouteilles du cellier",
      error
    );
    return res.status(500).json({
      message:
        "Erreur serveur lors de la récupération des bouteilles du cellier",
      erreur: error.message,
    });
  }
};

export const modifierBouteilleDuCellier = async (req, res) => {};

export const ajouterBouteilleDuCellier = async (req, res) => {
  try {
    // Obtiens le idCellier avec l'url grâce à la route en utilisant req.params
    const { idCellier } = req.params;
    const identifiantCellier = Number.parseInt(idCellier, 10);

    // Obtiens le id_bouteille avec req.body
    const { id_bouteille, quantite } = req.body;
    const identifiantBouteille = Number.parseInt(id_bouteille, 10);
    const quantiteAjout = Number.parseInt(quantite, 10) || 1;

    // Vérifie si la bouteille existe déjà dans le cellier (via le modèle)
    const bouteilleExistante = await modeleBouteilleCellier.verifierExistence(
      identifiantCellier,
      identifiantBouteille
    );

    // Si la bouteille existe déjà, retourner un message
    if (bouteilleExistante) {
      return res.status(200).json({
        message: "La bouteille existe déjà dans le cellier",
      });
    }

    // Requête pour ajouter une nouvelle bouteille
    const action = await modeleBouteilleCellier.ajouter(
      identifiantCellier,
      identifiantBouteille,
      quantiteAjout
    );

    res
      .status(201)
      .json({ message: "Bouteille ajoutée au cellier", id: action });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const supprimerBouteilleDuCellier = async (req, res) => {
  try {
    const { idCellier, idBouteille } = req.params;

    const resultat = await modeleBouteilleCellier.supprimer(
      idCellier,
      idBouteille
    );

    if (resultat) {
      res
        .status(200)
        .json({ message: "Bouteille supprimée du cellier avec succès" });
    } else {
      res
        .status(404)
        .json({ message: "Bouteille non trouvée dans le cellier" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors de la suppression" });
  }
};
