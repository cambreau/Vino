import { useEffect, useCallback, useRef, useMemo, useReducer } from "react";
import filtresStore from "@store/filtresStore";
import {
  LIMITE_BOUTEILLES,
  ACTIONS,
  creerEtatInitial,
  catalogueReducer,
  recupererBouteillesAvecFiltres,
  construireFiltresAPI,
} from "@lib/catalogueUtils";

/**
 * Hook personnalisé pour gérer toute la logique du catalogue
 * @param {string|null} utilisateurId - ID de l'utilisateur connecté
 * @returns {Object} État et fonctions du catalogue
 */
export function useCatalogue(utilisateurId) {
  // Store des filtres persistants
  const {
    criteres: criteresFiltresStore,
    modeRecherche: modeRechercheStore,
    criteresRecherche: criteresRechercheStore,
    modeTri: modeTriStore,
    setCriteres: setCriteresStore,
    setModeRecherche: setModeRechercheStore,
    desactiverModeRecherche: desactiverModeRechercheStore,
    toggleModeTri: toggleModeTriStore,
    supprimerCritere: supprimerCritereStore,
    reinitialiserFiltres: reinitialiserFiltresStore,
  } = filtresStore();

  // Références
  const mainRef = useRef(null);
  const sentinelRef = useRef(null);
  const scrollStateRef = useRef({ hasMore: true, scrollLoading: false });
  const loadTimeoutRef = useRef(null);

  // État du catalogue
  const [etat, dispatch] = useReducer(catalogueReducer, undefined, creerEtatInitial);
  const etatRef = useRef(etat);

  // Variables dérivées
  const modeTri = modeTriStore;
  const modeRecherche = modeRechercheStore;

  // Construire les filtres pour l'API
  const filtresAPI = useMemo(
    () => construireFiltresAPI(modeRecherche, criteresRechercheStore, criteresFiltresStore),
    [modeRecherche, criteresRechercheStore, criteresFiltresStore]
  );

  const filtresActifs = useMemo(
    () => Object.values(filtresAPI).some((v) => Boolean(v)),
    [filtresAPI]
  );

  const etiquetteTri = modeTri === "nom_asc" ? "A → Z" : "Z → A";

  // Synchroniser l'état avec la ref
  useEffect(() => {
    etatRef.current = etat;
  }, [etat]);

  useEffect(() => {
    scrollStateRef.current = {
      hasMore: etat.hasMore,
      scrollLoading: etat.scrollLoading,
    };
  }, [etat.hasMore, etat.scrollLoading]);

  // Fonction pour charger les bouteilles (initiales ou après changement de filtres)
  const chargerBouteilles = useCallback(async () => {
    if (!utilisateurId) return;

    dispatch({ type: ACTIONS.RESET });

    try {
      const data = await recupererBouteillesAvecFiltres(
        1,
        LIMITE_BOUTEILLES,
        filtresAPI,
        modeTri
      );

      if (!data) {
        dispatch({
          type: ACTIONS.INIT_ERROR,
          payload: { texte: "Erreur lors du chargement", type: "erreur" },
        });
        return;
      }

      const bouteilles = data?.donnees ?? [];
      const hasMore = data?.meta?.hasMore ?? false;
      const total = data?.meta?.total ?? 0;

      dispatch({
        type: ACTIONS.INIT_SUCCESS,
        payload: { bouteilles, hasMore, total, message: { texte: "", type: "" } },
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: ACTIONS.INIT_ERROR,
        payload: { texte: "Erreur lors du chargement", type: "erreur" },
      });
    }
  }, [utilisateurId, filtresAPI, modeTri]);

  // Charger les bouteilles au montage et lors de changements de filtres/tri
  useEffect(() => {
    chargerBouteilles();
  }, [chargerBouteilles]);

  // Charger plus de bouteilles (pagination)
  const chargerPlus = useCallback(async () => {
    const { scrollLoading, hasMore, page } = etatRef.current;
    if (scrollLoading || !hasMore) return;

    dispatch({ type: ACTIONS.LOAD_MORE_START });
    scrollStateRef.current = { hasMore, scrollLoading: true };

    const pageToLoad = page + 1;

    try {
      const res = await recupererBouteillesAvecFiltres(
        pageToLoad,
        LIMITE_BOUTEILLES,
        filtresAPI,
        modeTri
      );

      const nouvelles = Array.isArray(res?.donnees) ? res.donnees : [];
      const hasMorePages = res?.meta?.hasMore ?? false;
      const total = res?.meta?.total ?? etatRef.current.total;

      scrollStateRef.current = {
        hasMore: nouvelles.length ? hasMorePages : false,
        scrollLoading: false,
      };

      dispatch({
        type: ACTIONS.LOAD_MORE_SUCCESS,
        payload: {
          bouteilles: nouvelles,
          page: pageToLoad,
          total,
          hasMore: hasMorePages,
        },
      });
    } catch (error) {
      console.error(error);
      scrollStateRef.current = {
        hasMore: scrollStateRef.current.hasMore,
        scrollLoading: false,
      };
      dispatch({
        type: ACTIONS.LOAD_MORE_ERROR,
        payload: {
          texte: "Erreur lors du chargement de nouvelles bouteilles",
          type: "erreur",
        },
      });
    }
  }, [filtresAPI, modeTri]);

  // Debounce pour éviter les chargements multiples rapides
  const demanderChargement = useCallback(() => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    loadTimeoutRef.current = setTimeout(() => {
      chargerPlus();
    }, 150);
  }, [chargerPlus]);

  // IntersectionObserver pour le scroll infini
  useEffect(() => {
    if (etat.chargementInitial) return;

    const root = mainRef.current;
    const sentinel = sentinelRef.current;
    if (!root || !sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;

        const { hasMore, scrollLoading } = scrollStateRef.current;
        if (!hasMore || scrollLoading) return;

        demanderChargement();
      },
      { root, rootMargin: "0px 0px 100px 0px", threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [demanderChargement, etat.chargementInitial]);


  return {
    // Références
    mainRef,
    sentinelRef,

    // État
    etat,
    filtresActifs,
    etiquetteTri,

    // Données du store
    criteresFiltresStore,
    criteresRechercheStore,

    // Handlers filtres
    handleFiltrer: useCallback(
      (criteres) => {
        setCriteresStore(criteres);
        desactiverModeRechercheStore();
      },
      [setCriteresStore, desactiverModeRechercheStore]
    ),
    handleRecherche: useCallback(
      (texte) => {
        setModeRechercheStore({ nom: texte });
      },
      [setModeRechercheStore]
    ),
    handleTri: useCallback(() => {
      toggleModeTriStore();
    }, [toggleModeTriStore]),
    handleSupprimerFiltre: useCallback(
      (cle) => {
        supprimerCritereStore(cle);
      },
      [supprimerCritereStore]
    ),
    handleReinitialiserFiltres: useCallback(() => {
      reinitialiserFiltresStore();
    }, [reinitialiserFiltresStore]),

  };
}
