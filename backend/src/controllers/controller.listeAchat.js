import modeleListeAchat from "../models/modele.listeAchat.js";

/**
 * Fonction asynchrone qui ajoute une bouteille a la liste achat.
 */
export const ajoutBouteilleListe = async (req, res) => {};

/**
 * Fonction asynchrone qui recupere la liste d'achat.
 */
export const recupererListe = async (req, res) => {};

/**
 * Fonction asynchrone qui supprime une bouteille a la liste achat.
 */
export const supprimerBouteilleListe = async (req, res) => {
  try {
    const { id_utilisateur, id_bouteille } = req.params;

    if (!id_utilisateur || !id_bouteille) {
      return res.status(400).json({
        message: "ID utilisateur et ID bouteille sont requis."
      });
    }

    const resultat = await modeleListeAchat.supprimerBouteilleListe(
      id_utilisateur,
      id_bouteille
    );

    if (!resultat) {
      return res.status(404).json({
        message: "Bouteille non trouvée dans la liste."
      });
    }

    return res.status(200).json({
      message: "Bouteille retirée de la liste d'achat."
    });
  } catch (err) {
    console.error("Erreur lors de la suppression:", err);
    return res.status(500).json({
      error: "Erreur serveur lors de la suppression."
    });
  }
};


/**
 * Fonction asynchrone qui modifie la quantite d'une bouteille de la liste achat.
 */
export const modifierBouteilleListe = async (req, res) => {};
