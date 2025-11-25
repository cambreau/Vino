import ModeleCellier from "../models/modele.cellier.js";

export const ajouterCellier = async (req, res) => {
  try {
    // Récupérer l'id utilisateur depuis les paramètres de l'URL
    const { id_utilisateur } = req.params;
    // Récupérer le nom depuis le body
    const { nom } = req.body;

    // Retour d'erreur si Id non trouvé
    if (!id_utilisateur) {
      return res.status(400).json({
        message: "Id utilisateur requis pour créer un cellier",
      });
    }

    // Retour d'erreur si nom non fourni
    if (!nom || typeof nom !== "string" || nom.trim().length === 0) {
      return res.status(400).json({
        message: "Le nom du cellier est requis",
      });
    }

    // Action d'ajout de cellier, l'id est récupéré grâce à return insertId dans le model
    const id = await ModeleCellier.ajouter(nom, id_utilisateur);

    // Message de succès si tout est OK
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

export const recupererTousCelliers = async (req, res) => {
  try {
    const { id_utilisateur } = req.query;

    if (!id_utilisateur) {
      return res.status(400).json({
        message: "Id utilisateur requis pour récupérer les celliers",
      });
    }

    const celliers = await ModeleCellier.recupererTous(id_utilisateur);

    return res.status(200).json(celliers);
  } catch (err) {
    console.error("Erreur lors de la récupération des celliers :", err);
    return res.status(500).json({
      error: "Erreur serveur lors de la récupération des celliers.",
    });
  }
};

export const recupererCellier = async (req, res) => {};

export const modifierCellier = async (req, res) => {};

export const supprimerCellier = async (req, res) => {};
