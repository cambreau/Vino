import {
  useEffect,
  useCallback,
  useRef,
  useReducer,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";
import MenuEnHaut from "@components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "@components/components-partages/MenuEnBas/MenuEnBas";
import CarteBouteille from "@components/carte/CarteBouteille";
import Message from "@components/components-partages/Message/Message";
import Filtres from "@components/components-partages/Filtre/Filtre";
import NonTrouver from "@components/components-partages/NonTrouver/NonTrouver";
import Spinner from "@components/components-partages/Spinner/Spinner";

import { recupererBouteilles, ajouterBouteilleListe } from "@lib/requetes";

import authentificationStore from "@store/authentificationStore";
import {
  useDocumentTitle,
  filtrerBouteilles,
  rechercherBouteilles,
} from "@lib/utils.js";
import filtresStore from "@store/filtresStore";

/*
 * Constante: nombre d'éléments à charger par page lors de la pagination.
 */
const LIMITE_BOUTEILLES = 10;
const LIMITE_CHARGEMENT_CATALOGUE = 250;

/*
 * Crée l'état initial du catalogue. Propriété par propriété :
 *  - chargementInitial: indique si l'écran affiche un chargement initial.
 *  - scrollLoading: indique si un chargement lors du scroll est en cours.
 *  - bouteilles: liste des bouteilles chargées pour l'affichage.
 *  - celliers: liste des celliers de l'utilisateur.
 *  - cellierSelectionne: id du cellier sélectionné par défaut pour l'ajout.
 *  - page: numéro de page actuellement chargé (utilisé pour la pagination).
 *  - hasMore: indique si la ressource a d'autres pages disponibles.
 *  - message: objet contenant un message global à afficher (texte, type).
 *  - modale: état de la modale d'ajout (ouverte, bouteille, quantité, existe si déjà là).
 */
const creerEtatInitial = () => ({
  chargementInitial: true,
  scrollLoading: false,
  bouteilles: [],
  page: 1,
  hasMore: true,
  message: { texte: "", type: "" },
});

/*
 * Actions pour le reducer — utilisation pour manipuler l'état local du catalogue.
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
 * Reducer central de la page Catalogue :
 * - Permet d'appliquer des mutations immuables à l'état en fonction d'actions.
 */
const catalogueReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.RESET:
      // Réinitialise tout l'état (comme si l'utilisateur venait d'ouvrir la page).
      return creerEtatInitial();
    case ACTIONS.INIT_SUCCESS:
      // Chargement initial réussi : on enregistre les bouteilles et les celliers reçus.
      return {
        ...state,
        chargementInitial: false,
        scrollLoading: false,
        bouteilles: action.payload.bouteilles,
        page: 1,
        hasMore: action.payload.hasMore,
        message: action.payload.message ?? { texte: "", type: "" },
      };
    case ACTIONS.INIT_ERROR:
      // Échec du chargement initial : on affiche un message d'erreur.
      return {
        ...state,
        chargementInitial: false,
        scrollLoading: false,
        message: action.payload,
      };
    case ACTIONS.LOAD_MORE_START:
      // Début d'un chargement additionnel (pagination par scroll)
      return { ...state, scrollLoading: true };
    case ACTIONS.LOAD_MORE_SUCCESS: {
      // Succès d'un chargement additionnel : on concatène les nouvelles bouteilles.
      const nouvelles = action.payload.bouteilles ?? [];
      if (!nouvelles.length) {
        return { ...state, scrollLoading: false, hasMore: false };
      }
      return {
        ...state,
        bouteilles: [...state.bouteilles, ...nouvelles],
        page: action.payload.page,
        hasMore: action.payload.hasMore,
        scrollLoading: false,
      };
    }
    case ACTIONS.LOAD_MORE_ERROR:
      // Erreur lors du chargement additionnel : on stoppe l'indicateur.
      return {
        ...state,
        scrollLoading: false,
        message: action.payload,
      };
    case ACTIONS.SET_MESSAGE:
      // Permet d'afficher un message global à l'utilisateur (succès / erreur / info).
      return { ...state, message: action.payload };
    default:
      return state;
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
    setModeTri: setModeTriStore,
    toggleModeTri: toggleModeTriStore,
    supprimerCritere: supprimerCritereStore,
    reinitialiserFiltres: reinitialiserFiltresStore,
  } = filtresStore();
  // Référence vers le conteneur scrollable principal (utilisé pour l'observer et le fallback).
  const mainRef = useRef(null);
  const sentinelRef = useRef(null);
  const scrollStateRef = useRef({ hasMore: true, scrollLoading: false });
  const [etat, dispatch] = useReducer(
    catalogueReducer,
    undefined,
    creerEtatInitial
  );
  const etatRef = useRef(etat);
  const sentinelPretRef = useRef(true);
  // Référence de contrôle pour éviter les réponses asynchrones obsolètes lors des vérifications
  // (incrémentée à chaque requête pour s'assurer que la réponse correspond à la dernière requête).
  const [resultatsFiltres, setResultatsFiltres] = useState(null);
  const [catalogueComplet, setCatalogueComplet] = useState([]);
  const [chargementCatalogueComplet, setChargementCatalogueComplet] =
    useState(false);
  const [erreurCatalogueComplet, setErreurCatalogueComplet] = useState(null);

  // Utiliser les valeurs du store pour les critères et le mode
  const criteresFiltres = modeRechercheStore
    ? criteresRechercheStore
    : criteresFiltresStore;
  const modeRecherche = modeRechercheStore;
  const modeTri = modeTriStore;

  const filtresActifs = useMemo(
    () =>
      Object.values(criteresFiltres ?? {}).some((valeur) => Boolean(valeur)),
    [criteresFiltres]
  );
  const donneesFiltres = useMemo(
    () => (catalogueComplet.length ? catalogueComplet : etat.bouteilles),
    [catalogueComplet, etat.bouteilles]
  );

  const handleFiltrer = useCallback(
    (resultats, criteres) => {
      const actifs = Object.values(criteres ?? {}).some((valeur) =>
        Boolean(valeur)
      );
      desactiverModeRechercheStore();
      setCriteresStore(criteres);
      setResultatsFiltres(actifs ? resultats : null);
    },
    [desactiverModeRechercheStore, setCriteresStore]
  );

  const handleRecherche = useCallback(
    (criteres) => {
      const actifs = Object.values(criteres ?? {}).some((valeur) =>
        Boolean(valeur)
      );
      if (!actifs) {
        setResultatsFiltres(null);
        desactiverModeRechercheStore();
        return;
      }
      setModeRechercheStore(criteres);
      const resultats = rechercherBouteilles(donneesFiltres, criteres);
      setResultatsFiltres(resultats);
    },
    [donneesFiltres, setModeRechercheStore, desactiverModeRechercheStore]
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
    setResultatsFiltres(null);
  }, [reinitialiserFiltresStore]);

  const trierBouteilles = useCallback((liste = [], mode = "nom_asc") => {
    if (!Array.isArray(liste)) return [];
    const copie = [...liste];
    const direction = mode === "nom_desc" ? -1 : 1;
    return copie.sort((a = {}, b = {}) => {
      const nomA = a?.nom ?? "";
      const nomB = b?.nom ?? "";
      return (
        nomA.localeCompare(nomB, "fr", { sensitivity: "base" }) * direction
      );
    });
  }, []);

  const bouteillesAffichees = useMemo(
    () => trierBouteilles(resultatsFiltres ?? etat.bouteilles, modeTri),
    [resultatsFiltres, etat.bouteilles, modeTri, trierBouteilles]
  );

  const etiquetteTri = modeTri === "nom_asc" ? "A → Z" : "Z → A";

  // Effet principal: charge les bouteilles et les celliers de l'utilisateur au montage
  // et à chaque changement d'id d'utilisateur.
  useEffect(() => {
    etatRef.current = etat;
  }, [etat]);

  useEffect(() => {
    if (!filtresActifs) return;
    // Réappliquer les filtres ou la recherche selon le mode actif
    if (modeRecherche) {
      setResultatsFiltres(
        rechercherBouteilles(donneesFiltres ?? [], criteresFiltres)
      );
    } else {
      setResultatsFiltres(
        filtrerBouteilles(donneesFiltres ?? [], criteresFiltres)
      );
    }
  }, [donneesFiltres, filtresActifs, criteresFiltres, modeRecherche]);

  useEffect(() => {
    scrollStateRef.current = {
      hasMore: etat.hasMore,
      scrollLoading: etat.scrollLoading,
    };
  }, [etat.hasMore, etat.scrollLoading]);

  useEffect(() => {
    if (!filtresActifs) {
      sentinelPretRef.current = true;
    }
  }, [filtresActifs]);

  useEffect(() => {
    if (!utilisateur?.id) {
      dispatch({ type: ACTIONS.RESET });
      setCatalogueComplet([]);
      return;
    }

    let ignore = false;

    // Fonction asynchrone interne qui effectue toutes les requêtes initiales.
    const charger = async () => {
      dispatch({ type: ACTIONS.RESET });

      try {
        const dataBouteilles = await recupererBouteilles(1, LIMITE_BOUTEILLES);

        if (ignore) return;

        // `dataBouteilles` et `dataCelliers` proviennent des endpoints API :
        // - `donnees` contient la liste des éléments si le format de la réponse est normalisé.
        const bouteilles = dataBouteilles?.donnees ?? [];
        const hasMore = dataBouteilles?.meta?.hasMore ?? false;
        const message = { texte: "", type: "" };

        dispatch({
          type: ACTIONS.INIT_SUCCESS,
          payload: {
            bouteilles,
            hasMore,
            message,
          },
        });
      } catch (error) {
        console.error(error);
        if (ignore) return;

        dispatch({
          type: ACTIONS.INIT_ERROR,
          payload: {
            texte: "Erreur lors du chargement",
            type: "erreur",
          },
        });
      }
    };

    // Lance le chargement initial de la page.
    charger();
    return () => {
      ignore = true;
    };
  }, [utilisateur?.id]);

  useEffect(() => {
    if (!utilisateur?.id) {
      setCatalogueComplet([]);
      setChargementCatalogueComplet(false);
      setErreurCatalogueComplet(null);
      return;
    }

    let ignore = false;

    const chargerCatalogueComplet = async () => {
      setChargementCatalogueComplet(true);
      setErreurCatalogueComplet(null);
      const toutesLesBouteilles = [];
      let page = 1;
      let continuer = true;

      while (continuer && !ignore) {
        try {
          const reponse = await recupererBouteilles(
            page,
            LIMITE_CHARGEMENT_CATALOGUE
          );
          const lot = Array.isArray(reponse?.donnees) ? reponse.donnees : [];
          toutesLesBouteilles.push(...lot);

          const metaHasMore = reponse?.meta?.hasMore;
          const aEncore =
            typeof metaHasMore === "boolean"
              ? metaHasMore
              : lot.length === LIMITE_CHARGEMENT_CATALOGUE;

          continuer = aEncore && lot.length > 0;
          page += 1;
        } catch (error) {
          console.error(
            "Erreur lors du chargement complet du catalogue",
            error
          );
          setErreurCatalogueComplet(
            "Impossible de charger toutes les bouteilles"
          );
          continuer = false;
        }
      }

      if (!ignore) {
        setCatalogueComplet(toutesLesBouteilles);
        setChargementCatalogueComplet(false);
      }
    };

    chargerCatalogueComplet();
    return () => {
      ignore = true;
    };
  }, [utilisateur?.id]);

  // Paginer — charger la page suivante de bouteilles.
  // Appelée par l'IntersectionObserver ou par le fallback du scroll.
  const chargerPlus = useCallback(async () => {
    const { scrollLoading, hasMore, page } = etatRef.current;
    if (scrollLoading || !hasMore) return;

    dispatch({ type: ACTIONS.LOAD_MORE_START });
    scrollStateRef.current = { hasMore, scrollLoading: true };
    const pageToLoad = page + 1;

    try {
      const res = await recupererBouteilles(pageToLoad, LIMITE_BOUTEILLES);
      const nouvelles = Array.isArray(res?.donnees) ? res.donnees : [];
      const metaHasMore = res?.meta?.hasMore;
      const aEncoreDesPages =
        typeof metaHasMore === "boolean"
          ? metaHasMore
          : nouvelles.length === LIMITE_BOUTEILLES;

      scrollStateRef.current = {
        hasMore: nouvelles.length ? aEncoreDesPages : false,
        scrollLoading: false,
      };

      dispatch({
        type: ACTIONS.LOAD_MORE_SUCCESS,
        payload: {
          bouteilles: nouvelles,
          page: pageToLoad,
          hasMore: aEncoreDesPages,
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
  }, []);

  const demanderChargement = useCallback(() => {
    if (!sentinelPretRef.current) return;
    sentinelPretRef.current = false;
    chargerPlus();
  }, [chargerPlus]);

  // Fallback pour les environnements où l'IntersectionObserver manque le sentinel
  const verifierScrollEtCharger = useCallback(() => {
    if (filtresActifs) return;
    const node = mainRef.current;
    if (!node) return;

    const { scrollTop, clientHeight, scrollHeight } = node;
    const distanceRestante = scrollHeight - (scrollTop + clientHeight);
    if (distanceRestante > 400) {
      sentinelPretRef.current = true;
    }
    const { hasMore, scrollLoading } = scrollStateRef.current;
    if (distanceRestante <= 200 && hasMore && !scrollLoading) {
      demanderChargement();
    }
  }, [demanderChargement, filtresActifs]);

  // Effet de mise en place d'un IntersectionObserver pour détecter quand le sentinel
  // (élément placé en bas de la liste) devient visible, déclenchant alors le chargement
  // additionnel (pagination).
  useEffect(() => {
    if (etat.chargementInitial || filtresActifs) return;

    const root = mainRef.current;
    const sentinel = sentinelRef.current;
    if (!root || !sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry) return;

        if (!entry.isIntersecting) {
          sentinelPretRef.current = true;
          return;
        }

        const { hasMore, scrollLoading } = scrollStateRef.current;
        if (!hasMore || scrollLoading) return;

        demanderChargement();
      },
      { root, rootMargin: "0px 0px 200px 0px", threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [
    demanderChargement,
    etat.bouteilles.length,
    etat.chargementInitial,
    filtresActifs,
  ]);

  // Effet qui installe le fallback du scroll sur le conteneur principal pour
  // déclencher `verifierScrollEtCharger` quand l'utilisateur scroll.
  useEffect(() => {
    if (etat.chargementInitial || filtresActifs) return;

    const node = mainRef.current;
    if (!node) return;

    node.addEventListener("scroll", verifierScrollEtCharger, {
      passive: true,
    });
    verifierScrollEtCharger();
    return () => {
      node.removeEventListener("scroll", verifierScrollEtCharger);
    };
  }, [verifierScrollEtCharger, etat.chargementInitial, filtresActifs]);

  /*================================= */
  //Ajouter a la liste
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
    [utilisateur.id]
  );
  /*================================= */

  const { chargementInitial, message, scrollLoading, hasMore } = etat;
  const messageListeVide = filtresActifs
    ? "Aucune bouteille ne correspond à vos filtres"
    : "Aucune bouteille disponible";

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
    <>
      <div className="h-screen font-body grid grid-rows-[auto_1fr_auto] overflow-hidden">
        <header>
          <MenuEnHaut />
        </header>

        <main ref={mainRef} className="bg-fond overflow-y-auto">
          <h1 className="text-(length:--taille-grand)  mt-(--rythme-base) text-center font-display font-semibold text-principal-300">
            Catalogue des vins
          </h1>
          <section className="pt-(--rythme-espace) px-(--rythme-serre)">
            {message.texte && (
              <Message texte={message.texte} type={message.type} />
            )}

            <div className="flex flex-col gap-(--rythme-espace) lg:flex-row">
              <div className="space-y-(--rythme-base)">
                <Filtres
                  bouteilles={donneesFiltres}
                  valeursInitiales={criteresFiltresStore}
                  onFiltrer={handleFiltrer}
                  onRecherche={handleRecherche}
                  onTri={handleTri}
                  onSupprimerFiltre={handleSupprimerFiltre}
                  onReinitialiserFiltres={handleReinitialiserFiltres}
                  titreTri={etiquetteTri}
                  className="shrink-0"
                />
                {chargementCatalogueComplet && (
                  <p className="text-(length:--taille-petit) text-texte-secondaire">
                    Chargement de toutes les bouteilles...
                  </p>
                )}
                {erreurCatalogueComplet && (
                  <Message texte={erreurCatalogueComplet} type="erreur" />
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
                ) : bouteillesAffichees.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {bouteillesAffichees.map((b) => (
                        <Link key={b.id} to={`/bouteilles/${b.id}`}>
                          <CarteBouteille
                            key={b.id}
                            bouteille={b}
                            type="catalogue"
                            onAjouterListe={ajouterALaListe}
                          />
                        </Link>
                      ))}
                    </div>
                    {!filtresActifs && scrollLoading && hasMore && (
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

            {!filtresActifs && (
              <div
                ref={sentinelRef}
                className="h-1 w-full"
                aria-hidden="true"
              />
            )}
          </section>
        </main>

        <MenuEnBas />
      </div>
    </>
  );
}

export default Catalogue;
