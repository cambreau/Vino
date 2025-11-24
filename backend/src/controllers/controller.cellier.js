import ModeleCellier from "../models/modele.cellier.js";

export const ajouterCellier = async (req, res) => {
  try {
    const { id_utilisateur, nom = "Mon Cellier" } = req.body;

    if (!id_utilisateur) {
      return res.status(400).json({
        message: "Id utilisateur requis pour créer un cellier",
      });
    }
    const id = await ModeleCellier.ajouter(nom, id_utilisateur);

    res.status(201).json({
      message: "Cellier créé avec succès",
      id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur serveur",
    });
  }
};

export const recupererCellier = async (req, res) => {};

export const modifierCellier = async (req, res) => {};

export const supprimerCellier = async (req, res) => {};
