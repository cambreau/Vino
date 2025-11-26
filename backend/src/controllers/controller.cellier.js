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

export const modifierCellier = async (req, res) => {
  try {
    // Récupère les ID depuis les paramètres de l'URL
    const { id_utilisateur, id_cellier } = req.params;

    // Récupère le nom depuis le corps de la requête
    const { nom } = req.body;

    // Validation des entrées
    if (!id_utilisateur || !id_cellier) {
      return res.status(400).json({
        message: "ID utilisateur et ID cellier requis",
      });
    }

    if (!nom || typeof nom !== "string" || nom.trim().length === 0) {
      return res.status(400).json({ message: "Nom invalide" });
    }

    // Appel du modèle pour modifier le cellier
    const action = await ModeleCellier.modifier(
      id_cellier,
      id_utilisateur,
      nom
    );

    // Si aucun cellier n'a été modifié
    if (!action) {
      return res.status(404).json({ message: "Cellier non trouvé" });
    }

    // Réponse de succès
    res.status(200).json({
      message: "Cellier modifié avec succès",
      id: action,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const supprimerCellier = async (req, res) => {
  try {
    // Récupère les ID depuis les paramètres de l'URL
    const { id_cellier, id_utilisateur } = req.params;

    // Validation des entrées
    if (!id_utilisateur || !id_cellier) {
      return res.status(400).json({
        message: "Identifiant de cellier invalide",
      });
    }

    // Applique la requête SQL
    const resultat = await ModeleCellier.supprimer(id_cellier, id_utilisateur);

    // Si retourne faux, retourne un message d'erreur, sinon on envoie la requête
    if (!resultat) {
      return res.status(404).json({
        message: "Cellier introuvable ou déjà supprimée",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Cellier supprimée avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de ce cellier", error);
    return res.status(500).json({
      message: "Impossible de supprimer le cellier",
    });
  }
};
