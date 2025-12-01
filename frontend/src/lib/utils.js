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
	let texteFormate = texte.replaceAll("|", ",");

	formatMajDebut(texte);

	// Nettoyer les espaces multiples
	texteFormate = texteFormate.replace(/\s+/g, " ").trim();

	return texteFormate;
};

export const normaliserTexte = (valeur) => {
  if (valeur === undefined || valeur === null) return "";
  return valeur
    .toString()
    .normalize("NFD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase();
};

/**
 * Filtre une liste de bouteilles selon différents critères optionnels.
 * @param {Array<Object>} bouteilles - Liste complete des bouteilles.
 * @param {Object} filtres - Combination des filtres actifs.
 * @param {string} [filtres.type] - Couleur/type à filtrer (doit correspondre au select de couleurs).
 * @param {string} [filtres.pays] - Pays tapé librement par l'utilisateur.
 * @param {string} [filtres.region] - Région tapée librement par l'utilisateur.
 * @param {string|number} [filtres.annee] - Année choisie dans le select.
 * @returns {Array<Object>} Bouteilles respectant les filtres actifs.
 */
export const filtrerBouteilles = (bouteilles = [], filtres = {}) => {
  if (!Array.isArray(bouteilles) || bouteilles.length === 0) {
    return [];
  }

  const typeFiltre = normaliserTexte(filtres.type);
  const paysFiltre = normaliserTexte(filtres.pays);
  const regionFiltre = normaliserTexte(filtres.region);
  const anneeFiltre = filtres.annee ? Number(filtres.annee) : null;

  const typeActif = typeFiltre && typeFiltre !== "tous";

  return bouteilles.filter((bouteille) => {
    if (!bouteille) return false;

    if (typeActif) {
      const typeBouteille = normaliserTexte(
        bouteille.type ?? bouteille.couleur,
      );
      if (!typeBouteille || typeBouteille !== typeFiltre) {
        return false;
      }
    }

    if (paysFiltre) {
      const paysBouteille = normaliserTexte(
        bouteille.pays ?? bouteille.country ?? bouteille.origine,
      );
      if (!paysBouteille || !paysBouteille.includes(paysFiltre)) {
        return false;
      }
    }

    if (regionFiltre) {
      const regionBouteille = normaliserTexte(
        bouteille.region ?? bouteille.appellation,
      );
      if (!regionBouteille || !regionBouteille.includes(regionFiltre)) {
        return false;
      }
    }

    if (anneeFiltre) {
      const anneeSource =
        bouteille.annee ??
        bouteille.millesime ??
        bouteille.millenisme ??
        bouteille.vintage;
      const anneeBouteille = Number(anneeSource);
      if (!anneeBouteille || anneeBouteille !== anneeFiltre) {
        return false;
      }
    }

    return true;
  });
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
      // ignore
		}
	}, [titre, suffixe]);
}
