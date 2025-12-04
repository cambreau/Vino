import { useEffect, useCallback, useRef, useMemo, useState, useReducer } from "react";
import { Link } from "react-router-dom";
import MenuEnHaut from "@components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "@components/components-partages/MenuEnBas/MenuEnBas";
import CarteBouteille from "@components/carte/CarteBouteille";
import Message from "@components/components-partages/Message/Message";
import NonTrouver from "@components/components-partages/NonTrouver/NonTrouver";
import Spinner from "@components/components-partages/Spinner/Spinner";
import FiltresCatalogue from "@components/components-partages/Filtre/FiltresCatalogue";

import { ajouterBouteilleListe } from "@lib/requetes";

import authentificationStore from "@store/authentificationStore";
import { useDocumentTitle } from "@lib/utils.js";
import filtresStore from "@store/filtresStore";

/*
 * Constante: nombre d'éléments à charger par page lors de la pagination.
 */
const LIMITE_BOUTEILLES = 20;

/*
 * Crée l'état initial du catalogue.
 */
const creerEtatInitial = () => ({
  chargementInitial: true,
  scrollLoading: false,
  bouteilles: [],
  page: 1,
  total: 0,
  hasMore: true,
  message: { texte: "", type: "" },
});

/*
 * Actions pour le reducer
 */
const ACTIONS = {
  RESET: "reset",
  INIT_SUCCESS: "init_success",
  INIT_ERROR: "init_error",
  LOAD_MORE_START: "load_more_start",
  LOAD_MORE_SUCCESS: "load_more_success",
  LOAD_MORE_ERROR: "load_more_error",
  SET_MESSAGE: "set_message",
};

/*
 * Reducer central de la page Catalogue
 */
const catalogueReducer = (state, action) => {
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
 * Fonction pour récupérer les bouteilles avec filtres côté serveur
 */
const recupererBouteillesAvecFiltres = async (page, limit, filtres = {}, tri = "nom_asc") => {
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

function Catalogue() {
  useDocumentTitle("Catalogue");
  const utilisateur = authentificationStore((state) => state.utilisateur);

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

  // État du catalogue
  const [etat, dispatch] = useReducer(catalogueReducer, undefined, creerEtatInitial);
  const etatRef = useRef(etat);

  // Référence pour le debounce du chargement
  const loadTimeoutRef = useRef(null);

  // Variables dérivées
  const modeTri = modeTriStore;
  const modeRecherche = modeRechercheStore;

  // Construire les filtres pour l'API
  const filtresAPI = useMemo(() => {
    if (modeRecherche && criteresRechercheStore) {
      // En mode recherche, on utilise le champ "recherche" de l'API
      const texteRecherche = typeof criteresRechercheStore === 'string' 
        ? criteresRechercheStore 
        : criteresRechercheStore.nom || '';
      return { recherche: texteRecherche };
    }
    // En mode filtres, on utilise les critères du store
    const filtres = {};
    if (criteresFiltresStore?.type) filtres.type = criteresFiltresStore.type;
    if (criteresFiltresStore?.pays) filtres.pays = criteresFiltresStore.pays;
    if (criteresFiltresStore?.region) filtres.region = criteresFiltresStore.region;
    if (criteresFiltresStore?.annee) filtres.annee = criteresFiltresStore.annee;
    return filtres;
  }, [modeRecherche, criteresRechercheStore, criteresFiltresStore]);

  const filtresActifs = useMemo(() => {
    return Object.values(filtresAPI).some((v) => Boolean(v));
  }, [filtresAPI]);

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
    if (!utilisateur?.id) return;

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
  }, [utilisateur?.id, filtresAPI, modeTri]);

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

  // Handlers pour les filtres
  const handleFiltrer = useCallback(
    (criteres) => {
      setCriteresStore(criteres);
      desactiverModeRechercheStore();
    },
    [setCriteresStore, desactiverModeRechercheStore]
  );

  const handleRecherche = useCallback(
    (texte) => {
      setModeRechercheStore({ nom: texte });
    },
    [setModeRechercheStore]
  );

  const handleTri = useCallback(() => {
    toggleModeTriStore();
  }, [toggleModeTriStore]);

  const handleSupprimerFiltre = useCallback(
    (cle) => {
      supprimerCritereStore(cle);
    },
    [supprimerCritereStore]
  );

  const handleReinitialiserFiltres = useCallback(() => {
    reinitialiserFiltresStore();
  }, [reinitialiserFiltresStore]);

  // Ajouter à la liste d'achat
  const ajouterALaListe = useCallback(
    async (bouteille) => {
      try {
        const resultat = await ajouterBouteilleListe(utilisateur.id, {
          id_bouteille: bouteille.id,
        });

        if (resultat?.succes) {
          dispatch({
            type: ACTIONS.SET_MESSAGE,
            payload: {
              texte: `${bouteille.nom} a été ajouté à votre liste avec succès`,
              type: "succes",
            },
          });
        } else {
          dispatch({
            type: ACTIONS.SET_MESSAGE,
            payload: {
              texte: resultat?.erreur || "Erreur lors de l'ajout à la liste",
              type: "erreur",
            },
          });
        }
      } catch (error) {
        console.error(error);
        dispatch({
          type: ACTIONS.SET_MESSAGE,
          payload: {
            texte: "Erreur lors de l'ajout à la liste",
            type: "erreur",
          },
        });
      }
    },
    [utilisateur?.id]
  );

  // Extraire les valeurs de l'état
  const { chargementInitial, message, scrollLoading, hasMore, bouteilles, total } = etat;
  const messageListeVide = filtresActifs
    ? "Aucune bouteille ne correspond à vos critères"
    : "Aucune bouteille disponible";

  // Si l'utilisateur n'est pas connecté
  if (!utilisateur?.id) {
    return (
      <div className="h-screen font-body grid grid-rows-[auto_1fr_auto] overflow-hidden">
        <header>
          <MenuEnHaut />
        </header>
        <main ref={mainRef} className="bg-fond overflow-y-auto">
          <section className="pt-(--rythme-base) px-(--rythme-serre)">
            <Message
              texte="Vous devez être connecté pour accéder au catalogue"
              type="erreur"
            />
          </section>
        </main>
        <MenuEnBas />
      </div>
    );
  }

  return (
    <div className="h-screen font-body grid grid-rows-[auto_1fr_auto] overflow-hidden">
      <header>
        <MenuEnHaut />
      </header>

      <main ref={mainRef} className="bg-fond overflow-y-auto">
        <h1 className="text-(length:--taille-grand) mt-(--rythme-base) text-center font-display font-semibold text-principal-300">
          Catalogue des vins
        </h1>

        <section className="pt-(--rythme-espace) px-(--rythme-serre)">
          {message.texte && (
            <Message texte={message.texte} type={message.type} />
          )}

          <div className="flex flex-col gap-(--rythme-espace) lg:flex-row">
            <div className="space-y-(--rythme-base)">
              <FiltresCatalogue
                filtresActuels={criteresFiltresStore}
                rechercheActuelle={
                  typeof criteresRechercheStore === 'string'
                    ? criteresRechercheStore
                    : criteresRechercheStore?.nom || ''
                }
                onFiltrer={handleFiltrer}
                onRecherche={handleRecherche}
                onTri={handleTri}
                onSupprimerFiltre={handleSupprimerFiltre}
                onReinitialiserFiltres={handleReinitialiserFiltres}
                titreTri={etiquetteTri}
                className="shrink-0"
              />
              {total > 0 && (
                <p className="text-(length:--taille-petit) text-texte-secondaire">
                  {total} bouteille{total > 1 ? "s" : ""} trouvée
                  {total > 1 ? "s" : ""}
                </p>
              )}
            </div>

            <div className="flex-1">
              {chargementInitial ? (
                <div className="flex justify-center items-center py-(--rythme-espace)">
                  <Spinner
                    size={220}
                    ariaLabel="Chargement du catalogue de bouteilles"
                  />
                </div>
              ) : bouteilles.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {bouteilles.map((b) => (
                      <Link key={b.id} to={`/bouteilles/${b.id}`}>
                        <CarteBouteille
                          bouteille={b}
                          type="catalogue"
                          onAjouterListe={ajouterALaListe}
                        />
                      </Link>
                    ))}
                  </div>

                  {/* Sentinel pour le scroll infini */}
                  {hasMore && (
                    <div
                      ref={sentinelRef}
                      className="h-4 w-full"
                      aria-hidden="true"
                    />
                  )}

                  {scrollLoading && (
                    <div className="flex justify-center py-(--rythme-base)">
                      <Spinner
                        size={140}
                        ariaLabel="Chargement de nouvelles bouteilles"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex justify-center py-(--rythme-espace)">
                  <NonTrouver size={180} message={messageListeVide} />
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <MenuEnBas />
    </div>
  );
}

export default Catalogue;
