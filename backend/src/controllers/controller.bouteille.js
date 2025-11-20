/**
 * @source backend/src/controllers/controller.bouteille.js
 * Objectif:
 * Orchestrer les flux REST autour du domaine bouteille et exposer
 * explicitement dependances et reponses attendues.
 */

import modeleBouteille from "../models/modele.bouteille.js";

export const listerBouteilles = async (req, res) => {
	try {
		const bouteilles = await modeleBouteille.trouverTout();

		return res.status(200).json({
			message: "Liste des bouteilles",
			total: bouteilles.length,
			donnees: bouteilles,
		});
	} catch (error) {
		console.error("Erreur lors de la récupération des bouteilles", error);
		return res.status(500).json({
			message: "Impossible de récupérer les bouteilles",
			erreur: error.message,
		});
	}
};

export const recupererBouteille = async (req, res) => {
	try {
		const { id } = req.params;
		const identifiant = Number.parseInt(id, 10);
		if (!Number.isInteger(identifiant) || identifiant <= 0) {
			return res.status(400).json({
				message: "Identifiant de bouteille invalide",
			});
		}

		const bouteille = await modeleBouteille.trouverParId(identifiant);
		if (!bouteille) {
			return res.status(404).json({
				message: "Bouteille introuvable",
			});
		}

		return res.status(200).json({
			message: "Bouteille récupérée",
			donnees: bouteille,
		});
	} catch (error) {
		console.error("Erreur lors de la récupération d'une bouteille", error);
		return res.status(500).json({
			message: "Impossible de récupérer la bouteille",
			erreur: error.message,
		});
	}
};

export const creerBouteille = async (req, res) => {

};

export const modifierBouteille = async (req, res) => {

};

export const supprimerBouteille = async (req, res) => {

};

export const rechercherBouteilleParAttributs = async (req, res) => {
	try {
		const {
			nom,
			region,
			cepage,
			pays,
			type,
		} = req.query;

		const filtresBruts = {
			nom,
			region,
			cepage,
			pays,
			type,
		};

		const filtres = Object.entries(filtresBruts).reduce((acc, [cle, valeur]) => {
			if (typeof valeur === "string") {
				const nettoye = valeur.trim();
				if (nettoye) acc[cle] = nettoye;
			}
			return acc;
		}, {});

		if (!Object.keys(filtres).length) {
			return res.status(400).json({
				message: "Au moins un attribut (nom, region, cepage, pays, type) est requis",
			});
		}

		const bouteilles = await modeleBouteille.trouverParAttributs(filtres);
		if (!bouteilles.length) {
			return res.status(404).json({
				message: "Aucune bouteille ne correspond aux attributs fournis",
			});
		}

		return res.status(200).json({
			message: "Bouteilles correspondant aux attributs",
			total: bouteilles.length,
			donnees: bouteilles,
		});
	} catch (error) {
		console.error("Erreur lors de la recherche par attributs", error);
		return res.status(500).json({
			message: "Impossible de rechercher les bouteilles",
			erreur: error.message,
		});
	}
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
