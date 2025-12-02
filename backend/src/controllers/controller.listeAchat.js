import modeleListeAchat from "../models/modele.listeAchat.js";

/**
 * Fonction asynchrone qui ajoute une bouteille a la liste achat.
 */
export const ajoutBouteilleListe = async (req, res) => {
	try {
		const { id_utilisateur, id_bouteille: idBouteilleParam } = req.params;
		const { id_bouteille: idBouteilleBody, quantite: quantiteBrute } =
			req.body || {};

		const idBouteille = idBouteilleParam ?? idBouteilleBody;

		if (!id_utilisateur || !idBouteille) {
			return res.status(400).json({
				message: "Identifiants utilisateur et bouteille requis",
			});
		}

		const idUtilisateurNombre = parseInt(id_utilisateur, 10);
		const idBouteilleNombre = parseInt(idBouteille, 10);

		if (
			!Number.isInteger(idUtilisateurNombre) ||
			!Number.isInteger(idBouteilleNombre)
		) {
			return res.status(400).json({
				message: "Identifiants utilisateur et bouteille invalides",
			});
		}

		let quantite = parseInt(quantiteBrute, 10);
		if (!Number.isInteger(quantite) || quantite <= 0) {
			quantite = 1;
		}

		const resultat = await modeleListeAchat.ajoutBouteilleListe(
			idUtilisateurNombre,
			idBouteilleNombre,
			quantite
		);

		// Si la bouteille existe déjà dans la liste d'achat
		if (resultat.existe) {
			return res.status(409).json({
				message: "Cette bouteille existe déjà dans votre liste d'achat.",
				data: resultat.bouteilleExistante,
			});
		}

		return res.status(201).json({
			message: "Bouteille ajoutée à la liste d'achat",
			data: resultat,
		});
	} catch (error) {
		console.error("Erreur lors de l'ajout dans la liste d'achat", error);
		return res.status(500).json({ message: "Erreur serveur" });
	}
};

/**
 * Fonction asynchrone qui recupere la liste d'achat.
 */
export const recupererListe = async (req, res) => {
	try {
		const { id_utilisateur } = req.params;
		const idUtilisateurNombre = parseInt(id_utilisateur, 10);

		if (!Number.isInteger(idUtilisateurNombre) || idUtilisateurNombre <= 0) {
			return res.status(400).json({
				message: "Identifiant utilisateur invalide",
			});
		}

		const liste = await modeleListeAchat.recupererListe(
			idUtilisateurNombre
		);

		return res.status(200).json({
			message: "Liste d'achat récupérée",
			total: liste.length,
			data: liste,
		});
	} catch (error) {
		console.error(
			"Erreur lors de la récupération de la liste d'achat",
			error
		);
		return res.status(500).json({ message: "Erreur serveur" });
	}
};

/**
 * Fonction asynchrone qui modifie la quantite d'une bouteille de la liste achat.
 */
export const modifierBouteilleListe = async (req, res) => {};


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