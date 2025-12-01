/**
 * Fonction qui prend en parametre un string et le transforme en format utilisable pour id et src.
 * @param {string} nomString
 * @returns {string}
 */
import { useEffect } from "react";

export const formatString = (nomString) => {
	// Faire une copie du string dans une nouvelle constante
	let mot = nomString;
	// Supprimer les espaces de tabulation
	mot = mot.trim();
	// Supprimer les accents
	mot = mot.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	// Mettre en minuscule
	mot = mot.toLowerCase();
	// Remplacer les espaces et les underscores par des tirets
	mot = mot.replaceAll(" ", " ").replaceAll("_", " ");
	return mot;
};

/**
 * Fonction qui transforme la premìere lettre en majuscule d'un string.
 * @param {string} string
 * @returns string transformé.
 */
export function formatMajDebut(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Fonction qui transforme la description dans un format lisible
 * @param {string} string
 * @returns string transformé.
 */
export const formatDetailsBouteille = (texte) => {
	if (!texte) return "";

	// Remplacer les | par des virgules
	let texteFormate = texte.replaceAll("identite produit:", "");
	// Remplacer les | par des virgules
	let texteFormateFinal = texteFormate.replaceAll("|", ",");

	formatMajDebut(texteFormateFinal);

	// Nettoyer les espaces multiples
	texteFormate = texteFormateFinal.replace(/\s+/g, " ").trim();

	return texteFormate;
};

/**
 * Hook : set document title
 * @param {string} titre - Titre de la page
 * @param {string} suffixe - (optionnel) suffixe ajouté au titre (par défaut 'Vino')
 */
export function useDocumentTitle(titre, suffixe = "Vino") {
	useEffect(() => {
		try {
			if (!titre) {
				document.title = suffixe;
			} else {
				document.title = `${titre} - ${suffixe}`;
			}
		} catch (e) {
			// ignore si document n'est pas disponible (ex.: SSR)
		}
	}, [titre, suffixe]);
}
