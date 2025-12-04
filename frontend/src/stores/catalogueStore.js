import { create } from "zustand";

/**
 * Store Zustand optimisé pour le catalogue avec:
 * - Pagination infinie côté serveur
 * - Filtres et recherche côté serveur
 * - Cache intelligent des résultats
 * - Virtual scrolling support
 */

const LIMITE_PAR_PAGE = 20;

/**
 * Génère une clé de cache unique basée sur les filtres et le tri
 */
const genererCleCacheRequete = (filtres, tri) => {
  const filtresNormalises = Object.entries(filtres || {})
    .filter(([, v]) => Boolean(v))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join("|");
  return `${filtresNormalises}||${tri}`;
};

/**
 * État initial du store
 */
const etatInitial = {
  // Données
  bouteilles: [],
  total: 0,

  // État de chargement
  chargementInitial: false,
  chargementPlus: false,
  erreur: null,

  // Pagination
  page: 1,
  hasMore: true,

  // Filtres et recherche (côté serveur)
  filtres: {
    type: "",
    pays: "",
    region: "",
    annee: "",
  },
  recherche: "",
  modeRecherche: false,
  tri: "nom_asc",

  // Cache des requêtes pour éviter les re-fetch
  cache: new Map(),
  cleCache: "",
};

const catalogueStore = create((set, get) => ({
  ...etatInitial,

  /**
   * Réinitialise le store à son état initial
   */
  reinitialiser: () => {
    set({ ...etatInitial, cache: new Map() });
  },

  /**
   * Charge la première page de bouteilles avec les filtres actuels
   */
  chargerBouteilles: async () => {
    const { filtres, recherche, tri, cache } = get();

    // Construire les filtres pour l'API
    const filtresApi = { ...filtres };
    if (recherche) {
      filtresApi.recherche = recherche;
    }

    const cleCache = genererCleCacheRequete(filtresApi, tri);

    // Vérifier le cache
    if (cache.has(cleCache)) {
      const cached = cache.get(cleCache);
      set({
        bouteilles: cached.bouteilles,
        total: cached.total,
        hasMore: cached.hasMore,
        page: cached.page,
        cleCache,
        chargementInitial: false,
        erreur: null,
      });
      return;
    }

    set({ chargementInitial: true, erreur: null, bouteilles: [], page: 1 });

    try {
      const params = new URLSearchParams({
        page: "1",
        limit: String(LIMITE_PAR_PAGE),
        tri,
      });

      // Ajouter les filtres non vides
      Object.entries(filtresApi).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const reponse = await fetch(
        `${import.meta.env.VITE_BACKEND_BOUTEILLES_URL}?${params}`
      );

      if (!reponse.ok) {
        throw new Error(`Erreur HTTP: ${reponse.status}`);
      }

      const data = await reponse.json();
      const bouteilles = data?.donnees || [];
      const total = data?.meta?.total || 0;
      const hasMore = data?.meta?.hasMore ?? false;

      // Mettre en cache
      const nouvelleCache = new Map(cache);
      nouvelleCache.set(cleCache, {
        bouteilles,
        total,
        hasMore,
        page: 1,
      });

      set({
        bouteilles,
        total,
        hasMore,
        page: 1,
        cleCache,
        cache: nouvelleCache,
        chargementInitial: false,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des bouteilles:", error);
      set({
        erreur: "Impossible de charger les bouteilles",
        chargementInitial: false,
      });
    }
  },

  /**
   * Charge la page suivante de bouteilles (pagination infinie)
   */
  chargerPlus: async () => {
    const {
      page,
      hasMore,
      chargementPlus,
      filtres,
      recherche,
      tri,
      bouteilles,
    } = get();

    if (!hasMore || chargementPlus) return;

    set({ chargementPlus: true });

    try {
      const prochainePage = page + 1;

      const filtresApi = { ...filtres };
      if (recherche) {
        filtresApi.recherche = recherche;
      }

      const params = new URLSearchParams({
        page: String(prochainePage),
        limit: String(LIMITE_PAR_PAGE),
        tri,
      });

      Object.entries(filtresApi).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const reponse = await fetch(
        `${import.meta.env.VITE_BACKEND_BOUTEILLES_URL}?${params}`
      );

      if (!reponse.ok) {
        throw new Error(`Erreur HTTP: ${reponse.status}`);
      }

      const data = await reponse.json();
      const nouvellesBouteilles = data?.donnees || [];
      const hasMoreData = data?.meta?.hasMore ?? false;

      // Mettre à jour le cache avec les nouvelles données
      const { cache, cleCache } = get();
      const nouvelleCache = new Map(cache);
      const toutesLesBouteilles = [...bouteilles, ...nouvellesBouteilles];

      nouvelleCache.set(cleCache, {
        bouteilles: toutesLesBouteilles,
        total: data?.meta?.total || toutesLesBouteilles.length,
        hasMore: hasMoreData,
        page: prochainePage,
      });

      set({
        bouteilles: toutesLesBouteilles,
        page: prochainePage,
        hasMore: hasMoreData,
        cache: nouvelleCache,
        chargementPlus: false,
      });
    } catch (error) {
      console.error("Erreur lors du chargement de plus de bouteilles:", error);
      set({ chargementPlus: false });
    }
  },

  /**
   * Applique des filtres et recharge les bouteilles
   */
  appliquerFiltres: (nouveauxFiltres) => {
    set({
      filtres: { ...get().filtres, ...nouveauxFiltres },
      modeRecherche: false,
      recherche: "",
    });
    get().chargerBouteilles();
  },

  /**
   * Applique une recherche textuelle
   */
  appliquerRecherche: (texte) => {
    set({
      recherche: texte,
      modeRecherche: Boolean(texte),
    });
    get().chargerBouteilles();
  },

  /**
   * Change le mode de tri
   */
  changerTri: (nouveauTri) => {
    set({ tri: nouveauTri });
    get().chargerBouteilles();
  },

  /**
   * Bascule le tri entre A→Z et Z→A
   */
  toggleTri: () => {
    const nouveauTri = get().tri === "nom_asc" ? "nom_desc" : "nom_asc";
    get().changerTri(nouveauTri);
  },

  /**
   * Supprime un filtre spécifique
   */
  supprimerFiltre: (cle) => {
    const { filtres } = get();
    const nouveauxFiltres = { ...filtres, [cle]: "" };
    set({ filtres: nouveauxFiltres });
    get().chargerBouteilles();
  },

  /**
   * Réinitialise tous les filtres et la recherche
   */
  reinitialiserFiltres: () => {
    set({
      filtres: { type: "", pays: "", region: "", annee: "" },
      recherche: "",
      modeRecherche: false,
    });
    get().chargerBouteilles();
  },

  /**
   * Vérifie si des filtres sont actifs
   */
  aDesFiltresActifs: () => {
    const { filtres, recherche } = get();
    return Object.values(filtres).some((v) => Boolean(v)) || Boolean(recherche);
  },

  /**
   * Invalide le cache (à appeler après une modification de données)
   */
  invaliderCache: () => {
    set({ cache: new Map() });
  },
}));

export default catalogueStore;
