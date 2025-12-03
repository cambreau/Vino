import ModeleDegustation from "../models/modele.degustation.js";

export const recupererDegustationsUtilisateur = async (req, res) => {
  try {
    const { id_utilisateur } = req.params;
    const idUtilisateurNombre = parseInt(id_utilisateur, 10);

    if (!Number.isInteger(idUtilisateurNombre) || idUtilisateurNombre <= 0) {
      return res.status(400).json({ message: "ID utilisateur invalide" });
    }

    if (!id_utilisateur) {
      return res.status(400).json({ message: "ID utilisateur requis" });
    }

    const degustations = await ModeleDegustation.recupererParUtilisateur(
      idUtilisateurNombre
    );

    return res.status(200).json({
      message: "Dégustations récupérées",
      total: degustations.length,
      data: degustations,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des dégustations de l'utilisateur",
      error
    );
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

export const recupererDegustationsBouteille = async (req, res) => {
  try {
    const { id_bouteille } = req.params;
    const idBouteilleNombre = parseInt(id_bouteille, 10);

    if (!Number.isInteger(idBouteilleNombre) || idBouteilleNombre <= 0) {
      return res.status(400).json({ message: "ID bouteille invalide" });
    }

    if (!idBouteilleNombre) {
      return res.status(400).json({ message: "ID bouteille requis" });
    }

    const degustation = await ModeleDegustation.recupererParBouteille(
      idBouteilleNombre
    );

    return res.status(200).json({
      message: "Dégustation récupérée",
      total: degustation.length,
      data: degustation,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la dégustation de la bouteille",
      error
    );
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

export const ajouterDegustation = async (req, res) => {
  try {
    // Récupération des données du corps de la requête
    const { id_bouteille, id_utilisateur, note, commentaire } = req.body;

    // Appel du modèle pour ajouter la dégustation
    const resultat = await ModeleDegustation.ajouter(
      id_bouteille,
      id_utilisateur,
      note,
      commentaire
    );
    // Retour de succès
    return res.status(201).json({
      message: "Dégustation ajoutée",
      data: resultat,
    });
  } catch (error) {
    // Retour en cas d'erreur
    console.error("Erreur lors de l'ajout de la dégustation", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

export const modifierDegustation = async (req, res) => {};

export const supprimerDegustation = async (req, res) => {
  try {
    const { id_bouteille, id_utilisateur } = req.params;
    const { date_degustation } = req.query;

    const resultat = await ModeleDegustation.supprimer(
      id_utilisateur,
      id_bouteille,
      date_degustation
    );

    return res.status(200).json({
      message: "Dégustation supprimée",
      data: resultat,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de la dégustation", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
