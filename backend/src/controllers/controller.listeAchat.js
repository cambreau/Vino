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
export const recupererListe = async (req, res) => {};

/**
 * Fonction asynchrone qui supprime une bouteille a la liste achat.
 */
export const supprimerBouteilleListe = async (req, res) => {};

/**
 * Fonction asynchrone qui modifie la quantite d'une bouteille de la liste achat.
 */
export const modifierBouteilleListe = async (req, res) => {};
