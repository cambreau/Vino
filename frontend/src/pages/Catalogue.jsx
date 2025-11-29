import { useState, useEffect, useCallback, useRef } from "react";
import MenuEnHaut from "@components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "@components/components-partages/MenuEnBas/MenuEnBas";
import CarteBouteille from "@components/carte/CarteBouteille";
import Message from "@components/components-partages/Message/Message";
import BoiteModale from "@components/components-partages/BoiteModale/BoiteModale";

import Bouton from "@components/components-partages/Boutons/Bouton";
import BoutonQuantite from "@components/components-partages/Boutons/BoutonQuantite";
import FormulaireSelect from "@components/components-partages/Formulaire/FormulaireSelect/FormulaireSelect";

import {
  recupererBouteilles,
  ajouterBouteilleCellier,
  recupererTousCellier,
  verifierBouteilleCellier,
} from "@lib/requetes";

import authentificationStore from "@store/authentificationStore";

function Catalogue() {
  // Récupération de l'utilisateur connecté
  const utilisateur = authentificationStore((state) => state.utilisateur);
  // Référence vers le conteneur principal pour le scroll infini
  const mainRef = useRef(null);
  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [scrollLoading, setScrollLoading] = useState(false);

  // État global du composant regroupé dans un seul useState
  const [etat, setEtat] = useState({
    chargement: true,
    bouteilles: [],
    celliers: [],
    cellierSelectionne: "",
    message: { texte: "", type: "" },
    modale: {
      ouverte: false,
      bouteille: null,
      quantite: 1,
      existe: false,
    },
  });

  // Chargement des bouteilles + celliers de l’utilisateur
  useEffect(() => {
    if (!utilisateur?.id) return;

    let ignore = false;

    const charger = async () => {
      try {
        // Chargement parallèle des données
        // Récupération des bouteilles (page 1, 10 par page)
        const dataBouteilles = await recupererBouteilles(1, 10);
        const dataCelliers = await recupererTousCellier(utilisateur.id);

        if (ignore) return;

        const bouteilles = dataBouteilles?.donnees ?? [];
        const celliers = dataCelliers?.donnees ?? dataCelliers ?? [];

        setHasMore(dataBouteilles?.meta?.hasMore ?? false);

        // Sélectionne automatiquement le premier cellier
        const premierCellier =
          celliers.length > 0 ? String(celliers[0].id_cellier) : "";

        // Mise à jour de l’état global
        setEtat((e) => ({
          ...e,
          chargement: false,
          bouteilles,
          celliers,
          cellierSelectionne: premierCellier,
          message:
            celliers.length === 0
              ? {
                  texte: "Vous devez d'abord créer un cellier",
                  type: "information",
                }
              : { texte: "", type: "" },
        }));
      } catch (err) {
        console.error(err);
        if (!ignore) {
          // Message d’erreur si problème de chargement
          setEtat((e) => ({
            ...e,
            chargement: false,
            message: { texte: "Erreur lors du chargement", type: "erreur" },
          }));
        }
      }
    };

    charger();
    return () => {
      ignore = true;
    };
  }, [utilisateur?.id]);

  // Scroll infini pour charger les bouteilles 10 à la fois
  const chargerPlus = async () => {
    if (scrollLoading) return; // on ne charge pas si déjà en cours
    setScrollLoading(true);

    const prochainePage = page + 1;
    const res = await recupererBouteilles(prochainePage, 10);
    console.log("➡️ Réponse API:", res);

    const nouvelles = res?.donnees ?? [];

    if (nouvelles.length > 0) {
      // Ajoute les nouvelles bouteilles à celles déjà chargées
      setEtat((e) => ({
        ...e,
        bouteilles: [...e.bouteilles, ...nouvelles],
      }));
      setPage(prochainePage); // mise à jour de la page actuelle
    }

    setHasMore(res?.meta?.hasMore ?? false); // vérifie s’il y a encore des pages
    setScrollLoading(false);
  };

  // Gestion du scroll infini
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => {
      const nearBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - 200;

      // Si proche du bas, qu’il reste plus de bouteilles et qu’on ne charge pas déjà
      if (nearBottom && hasMore && !scrollLoading) {
        chargerPlus();
      }
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [page, hasMore, scrollLoading]);

  /*============================================================================ */
  // Ouvre la modale pour une bouteille sélectionnée
  const ouvrirModale = useCallback(
    (bouteille) => {
      setEtat((e) => ({
        ...e,
        modale: { ouverte: true, bouteille, quantite: 1, existe: false },
      }));

      // Vérifie si la bouteille est déjà dans le cellier sélectionné
      verifierBouteilleCellier(etat.cellierSelectionne, bouteille.id).then(
        (res) => {
          if (res.existe) {
            // Met à jour la modale si la bouteille existe déjà
            setEtat((e) => ({
              ...e,
              modale: {
                ...e.modale,
                existe: true,
                quantite: res.quantite,
              },
            }));
          }
        }
      );
    },
    [etat.cellierSelectionne]
  );

  /*============================================================================ */
  // Fermer la modale
  const fermerModale = useCallback(() => {
    setEtat((e) => ({
      ...e,
      modale: { ouverte: false, bouteille: null, quantite: 1, existe: false },
    }));
  }, []);

  /*============================================================================ */
  // Incrémente ou décrémente la quantité affichée dans la modale
  const modifierQuantite = useCallback((action) => {
    setEtat((e) => ({
      ...e,
      modale: {
        ...e.modale,
        quantite:
          action === "augmenter"
            ? e.modale.quantite + 1
            : Math.max(1, e.modale.quantite - 1),
      },
    }));
  }, []);

  /*============================================================================ */
  // Changer cellier
  const changerCellier = useCallback(
    (idCellier) => {
      setEtat((e) => ({
        ...e,
        cellierSelectionne: idCellier,
        modale: { ...e.modale, existe: false, quantite: 1 },
      }));

      // Re-vérifie si la bouteille existe dans le nouveau cellier
      if (!etat.modale.bouteille) return;

      verifierBouteilleCellier(idCellier, etat.modale.bouteille.id).then(
        (res) => {
          if (res.existe) {
            setEtat((e) => ({
              ...e,
              modale: { ...e.modale, existe: true, quantite: res.quantite },
            }));
          }
        }
      );
    },
    [etat.modale.bouteille]
  );

  // Ajout final de la bouteille dans le cellier
  const confirmerAjout = useCallback(async () => {
    if (!etat.cellierSelectionne) {
      setEtat((e) => ({
        ...e,
        message: { texte: "Veuillez sélectionner un cellier", type: "erreur" },
      }));
      return;
    }

    try {
      const donnees = {
        id_bouteille: etat.modale.bouteille.id,
        quantite: etat.modale.quantite,
      };

      const resultat = await ajouterBouteilleCellier(
        etat.cellierSelectionne,
        donnees
      );

      //Récupère le nom du cellier pour le message de confirmation
      if (resultat.succes) {
        const cellier =
          etat.celliers.find(
            (c) => String(c.id_cellier) === String(etat.cellierSelectionne)
          )?.nom ?? "";

        setEtat((e) => ({
          ...e,
          message: {
            texte: `${etat.modale.bouteille.nom} a été ajouté au cellier ${cellier}`,
            type: "succes",
          },
        }));

        fermerModale();
      } else {
        setEtat((e) => ({
          ...e,
          message: { texte: "Erreur lors de l'ajout", type: "erreur" },
        }));
      }
    } catch {
      setEtat((e) => ({
        ...e,
        message: { texte: "Erreur lors de l'ajout", type: "erreur" },
      }));
    }
  }, [etat]);

  const {
    chargement,
    bouteilles,
    message,
    modale,
    celliers,
    cellierSelectionne,
  } = etat;

  // Affichage si non connecté
  if (!utilisateur?.id) {
    return (
      <div className="h-screen font-body grid grid-rows-[auto_1fr_auto] overflow-hidden">
        <header>
          <MenuEnHaut />
        </header>
        <main ref={mainRef} className="bg-fond overflow-y-auto">
          <section className="pt-(--rythme-espace) px-(--rythme-serre)">
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
          <section className="pt-(--rythme-espace) px-(--rythme-serre)">
            {message.texte && (
              <Message texte={message.texte} type={message.type} />
            )}

            {chargement ? (
              <Message texte="Chargement du catalogue..." type="information" />
            ) : (
              <>
                {bouteilles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {bouteilles.map((b) => (
                      <CarteBouteille
                        key={b.id}
                        bouteille={b}
                        type="catalogue"
                        onAjouter={ouvrirModale}
                      />
                    ))}
                    {scrollLoading && (
                      <div className="flex justify-center mt-4">
                        <Message
                          texte="Chargement de plus de bouteilles..."
                          type="information"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <Message
                    texte="Aucune bouteille disponible"
                    type="information"
                  />
                )}
              </>
            )}
          </section>
        </main>

        <MenuEnBas />
      </div>

      {/* Fenêtre modale d’ajout  */}
      {modale.ouverte && modale.bouteille && (
        <BoiteModale
          texte="Confirmation d'ajout"
          contenu={
            <div className="w-full">
              <p className="text-texte-principal font-bold text-center mb-(--rythme-base)">
                {modale.bouteille.nom}
              </p>

              <div className="mb-(--rythme-base)">
                <FormulaireSelect
                  nom="Cellier"
                  genre="un"
                  estObligatoire={true}
                  arrayOptions={celliers.map((c) => c.nom)}
                  value={
                    celliers.find(
                      (c) => String(c.id_cellier) === cellierSelectionne
                    )?.nom || ""
                  }
                  onChange={(e) => {
                    const c = celliers.find((x) => x.nom === e.target.value);
                    if (c) changerCellier(String(c.id_cellier));
                  }}
                  classCouleur="Clair"
                  fullWidth={true}
                />
              </div>

              {modale.existe ? (
                <Message
                  texte={`Cette bouteille est déjà dans ce cellier (quantité : ${modale.quantite})`}
                  type="information"
                />
              ) : (
                <div className="flex items-center justify-center gap-(--rythme-serre)">
                  <span className="text-texte-secondaire">Quantité :</span>

                  <BoutonQuantite
                    type="diminuer"
                    onClick={() => modifierQuantite("diminuer")}
                    disabled={modale.quantite <= 1}
                  />

                  <span className="min-w-8 px-2 text-texte-principal font-bold">
                    {modale.quantite}
                  </span>

                  <BoutonQuantite
                    type="augmenter"
                    onClick={() => modifierQuantite("augmenter")}
                  />
                </div>
              )}
            </div>
          }
          bouton={
            <>
              <Bouton
                texte="Ajouter"
                type="primaire"
                typeHtml="button"
                action={confirmerAjout}
                disabled={modale.existe}
              />
              <Bouton
                texte="Annuler"
                type="secondaire"
                typeHtml="button"
                action={fermerModale}
              />
            </>
          }
        />
      )}
    </>
  );
}

export default Catalogue;
