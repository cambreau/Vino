/**
 * @source backend/src/controllers/controller.bouteille.js
 * Objectif:
 * Orchestrer les flux REST autour du domaine bouteille et exposer
 * explicitement dependances et reponses attendues.
 */

import modeleBouteille from "../models/modele.bouteille.js";

export const listerBouteilles = async (req, res) => {

};

export const recupererBouteille = async (req, res) => {

};

export const creerBouteille = async (req, res) => {

};

export const modifierBouteille = async (req, res) => {

};

export const supprimerBouteille = async (req, res) => {

};

/**
 * Déclenche l'import SAQ en passant une limite optionnelle (query ou body).
 */
export const importerBouteillesDepuisSAQ = async (req, res) => {
	try {
		const limiteBrute = req.query.limite ?? req.body?.limite;
		const limite = Number.parseInt(limiteBrute, 10);
		const resultat = await modeleBouteille.importerDepuisEnregistrementsSaq({
			limite: Number.isInteger(limite) && limite > 0 ? limite : undefined,
		});

		return res.status(201).json({
			message: "Importation des bouteilles SAQ complétée",
			resultat,
		});
	} catch (error) {
		console.error("Erreur lors de l'import SAQ", error);
		return res.status(500).json({
			message: "Impossible d'importer les bouteilles depuis la SAQ",
			erreur: error.message,
		});
	}
};
