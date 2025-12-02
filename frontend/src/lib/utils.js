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
  const anneeFiltre =
    filtres.annee !== undefined && filtres.annee !== null && `${filtres.annee}` !== ""
      ? Number(filtres.annee)
      : null;

  const typeActif = Boolean(typeFiltre && typeFiltre !== "tous");
  const paysActif = Boolean(paysFiltre);
  const regionActif = Boolean(regionFiltre);
  const anneeActif = Number.isFinite(anneeFiltre);

  if (!typeActif && !paysActif && !regionActif && !anneeActif) {
    return [...bouteilles];
  }

  // Cherche la première propriété non vide parmi la liste puis la normalise.
  const obtenirValeurNormalisee = (source, champs) => {
    for (const champ of champs) {
      const valeur = source[champ];
      if (valeur !== undefined && valeur !== null && valeur !== "") {
        return normaliserTexte(valeur);
      }
    }
    return "";
  };

  return bouteilles.filter((bouteille) => {
    if (!bouteille || typeof bouteille !== "object") return false;

    if (typeActif) {
      const typeBouteille = obtenirValeurNormalisee(bouteille, [
        "type",
        "couleur",
      ]);
      if (!typeBouteille || typeBouteille !== typeFiltre) {
        return false;
      }
    }

    if (paysActif) {
      const paysBouteille = obtenirValeurNormalisee(bouteille, [
        "pays",
        "country",
        "origine",
      ]);
      if (!paysBouteille || !paysBouteille.includes(paysFiltre)) {
        return false;
      }
    }

    if (regionActif) {
      const regionBouteille = obtenirValeurNormalisee(bouteille, [
        "region",
        "appellation",
      ]);
      if (!regionBouteille || !regionBouteille.includes(regionFiltre)) {
        return false;
      }
    }

    if (anneeActif) {
      const champsAnnees = ["annee", "millesime", "vintage"];
      let anneeBouteille = null;
      for (const champ of champsAnnees) {
        const valeur = bouteille[champ];
        const nombre = Number(valeur);
        if (Number.isFinite(nombre)) {
          anneeBouteille = nombre;
          break;
        }
      }
      if (anneeBouteille !== anneeFiltre) {
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

/**
 * Recherche des bouteilles selon des critères textuels (recherche partielle).
 * Contrairement à filtrerBouteilles qui fait une correspondance exacte sur les selects,
 * cette fonction effectue une recherche partielle sur les champs textuels.
 *
 * @param {Array<Object>} bouteilles - Liste complète des bouteilles.
 * @param {Object} criteres - Critères de recherche.
 * @param {string} [criteres.nom] - Texte à rechercher dans le nom de la bouteille.
 * @param {string} [criteres.type] - Texte à rechercher dans le type/couleur.
 * @param {string} [criteres.pays] - Texte à rechercher dans le pays.
 * @param {string|number} [criteres.annee] - Année à rechercher (correspondance exacte).
 * @returns {Array<Object>} Bouteilles correspondant aux critères de recherche.
 */
export const rechercherBouteilles = (bouteilles = [], criteres = {}) => {
	if (!Array.isArray(bouteilles) || bouteilles.length === 0) {
		return [];
	}

	const nomRecherche = normaliserTexte(criteres.nom);
	const typeRecherche = normaliserTexte(criteres.type);
	const paysRecherche = normaliserTexte(criteres.pays);
	const anneeRecherche =
		criteres.annee !== undefined && criteres.annee !== null && `${criteres.annee}` !== ""
			? Number(criteres.annee)
			: null;

	const nomActif = Boolean(nomRecherche);
	const typeActif = Boolean(typeRecherche);
	const paysActif = Boolean(paysRecherche);
	const anneeActif = Number.isFinite(anneeRecherche);

	// Si aucun critère n'est actif, retourner toutes les bouteilles
	if (!nomActif && !typeActif && !paysActif && !anneeActif) {
		return [...bouteilles];
	}

	// Cherche la première propriété non vide parmi la liste puis la normalise.
	const obtenirValeurNormalisee = (source, champs) => {
		for (const champ of champs) {
			const valeur = source[champ];
			if (valeur !== undefined && valeur !== null && valeur !== "") {
				return normaliserTexte(valeur);
			}
		}
		return "";
	};

	return bouteilles.filter((bouteille) => {
		if (!bouteille || typeof bouteille !== "object") return false;

		// Recherche partielle sur le nom
		if (nomActif) {
			const nomBouteille = obtenirValeurNormalisee(bouteille, [
				"nom",
				"name",
				"titre",
				"title",
				"description",
			]);
			if (!nomBouteille || !nomBouteille.includes(nomRecherche)) {
				return false;
			}
		}

		// Recherche partielle sur le type/couleur
		if (typeActif) {
			const typeBouteille = obtenirValeurNormalisee(bouteille, [
				"type",
				"couleur",
			]);
			if (!typeBouteille || !typeBouteille.includes(typeRecherche)) {
				return false;
			}
		}

		// Recherche partielle sur le pays
		if (paysActif) {
			const paysBouteille = obtenirValeurNormalisee(bouteille, [
				"pays",
				"country",
				"origine",
			]);
			if (!paysBouteille || !paysBouteille.includes(paysRecherche)) {
				return false;
			}
		}

		// Correspondance exacte sur l'année
		if (anneeActif) {
			const champsAnnees = ["annee", "millesime", "vintage"];
			let anneeBouteille = null;
			for (const champ of champsAnnees) {
				const valeur = bouteille[champ];
				const nombre = Number(valeur);
				if (Number.isFinite(nombre)) {
					anneeBouteille = nombre;
					break;
				}
			}
			if (anneeBouteille !== anneeRecherche) {
				return false;
			}
		}

		return true;
	});
};

