/**
 * Utilitaires et constantes pour le catalogue
 */

/**
 * Nombre d'éléments à charger par page lors de la pagination.
 */
export const LIMITE_BOUTEILLES = 20;

/**
 * Actions pour le reducer du catalogue
 */
export const ACTIONS = {
  RESET: "reset",
  INIT_SUCCESS: "init_success",
  INIT_ERROR: "init_error",
  LOAD_MORE_START: "load_more_start",
  LOAD_MORE_SUCCESS: "load_more_success",
  LOAD_MORE_ERROR: "load_more_error",
  SET_MESSAGE: "set_message",
};

/**
 * Crée l'état initial du catalogue.
 * @returns {Object} État initial
 */
export const creerEtatInitial = () => ({
  chargementInitial: true,
  scrollLoading: false,
  bouteilles: [],
  page: 1,
  total: 0,
  hasMore: true,
  message: { texte: "", type: "" },
});

/**
 * Reducer central de la page Catalogue
 * @param {Object} state - État actuel
 * @param {Object} action - Action à exécuter
 * @returns {Object} Nouvel état
 */
export const catalogueReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.RESET:
      return creerEtatInitial();
    case ACTIONS.INIT_SUCCESS:
      return {
        ...state,
        chargementInitial: false,
        scrollLoading: false,
        bouteilles: action.payload.bouteilles,
        page: 1,
        total: action.payload.total,
        hasMore: action.payload.hasMore,
        message: action.payload.message ?? { texte: "", type: "" },
      };
    case ACTIONS.INIT_ERROR:
      return {
        ...state,
        chargementInitial: false,
        scrollLoading: false,
        message: action.payload,
      };
    case ACTIONS.LOAD_MORE_START:
      return { ...state, scrollLoading: true };
    case ACTIONS.LOAD_MORE_SUCCESS: {
      const nouvelles = action.payload.bouteilles ?? [];
      if (!nouvelles.length) {
        return { ...state, scrollLoading: false, hasMore: false };
      }
      return {
        ...state,
        bouteilles: [...state.bouteilles, ...nouvelles],
        page: action.payload.page,
        total: action.payload.total,
        hasMore: action.payload.hasMore,
        scrollLoading: false,
      };
    }
    case ACTIONS.LOAD_MORE_ERROR:
      return {
        ...state,
        scrollLoading: false,
        message: action.payload,
      };
    case ACTIONS.SET_MESSAGE:
      return { ...state, message: action.payload };
    default:
      return state;
  }
};

/**
 * Récupère les bouteilles avec filtres côté serveur
 * @param {number} page - Numéro de page
 * @param {number} limit - Limite par page
 * @param {Object} filtres - Critères de filtrage
 * @param {string} tri - Mode de tri
 * @returns {Promise<Object|null>} Données des bouteilles ou null en cas d'erreur
 */
export const recupererBouteillesAvecFiltres = async (
  page,
  limit,
  filtres = {},
  tri = "nom_asc"
) => {
  try {
    const params = new URLSearchParams();
    params.set("page", page);
    params.set("limit", limit);
    params.set("tri", tri);

    // Ajouter les filtres à la requête
    if (filtres.type) params.set("type", filtres.type);
    if (filtres.pays) params.set("pays", filtres.pays);
    if (filtres.region) params.set("region", filtres.region);
    if (filtres.annee) params.set("annee", filtres.annee);
    if (filtres.recherche) params.set("recherche", filtres.recherche);

    const reponse = await fetch(
      `${import.meta.env.VITE_BACKEND_BOUTEILLES_URL}?${params.toString()}`
    );

    if (!reponse.ok) {
      throw new Error(`Erreur HTTP: ${reponse.status}`);
    }

    return await reponse.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des bouteilles:", error);
    return null;
  }
};

/**
 * Construit les filtres pour l'API à partir de l'état du store
 * @param {boolean} modeRecherche - Si le mode recherche est actif
 * @param {Object|string} criteresRecherche - Critères de recherche
 * @param {Object} criteresFiltres - Critères de filtrage
 * @returns {Object} Filtres formatés pour l'API
 */
export const construireFiltresAPI = (modeRecherche, criteresRecherche, criteresFiltres) => {
  if (modeRecherche && criteresRecherche) {
    const texteRecherche =
      typeof criteresRecherche === "string"
        ? criteresRecherche
        : criteresRecherche.nom || "";
    return { recherche: texteRecherche };
  }

  const filtres = {};
  if (criteresFiltres?.type) filtres.type = criteresFiltres.type;
  if (criteresFiltres?.pays) filtres.pays = criteresFiltres.pays;
  if (criteresFiltres?.region) filtres.region = criteresFiltres.region;
  if (criteresFiltres?.annee) filtres.annee = criteresFiltres.annee;
  return filtres;
};
