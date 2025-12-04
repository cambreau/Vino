import { useEffect, useCallback, useRef, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MenuEnHaut from "@components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "@components/components-partages/MenuEnBas/MenuEnBas";
import CarteBouteille from "@components/carte/CarteBouteille";
import Message from "@components/components-partages/Message/Message";
import BoiteModale from "@components/components-partages/BoiteModale/BoiteModale";
import Bouton from "@components/components-partages/Boutons/Bouton";
import BoutonQuantite from "@components/components-partages/Boutons/BoutonQuantite";
import FormulaireSelect from "@components/components-partages/Formulaire/FormulaireSelect/FormulaireSelect";
import Spinner from "@components/components-partages/Spinner/Spinner";
import InfiniteScrollGrid from "@components/components-partages/InfiniteScrollGrid/InfiniteScrollGrid";
import FiltresCatalogue from "@components/components-partages/Filtre/FiltresCatalogue";

import {
  ajouterBouteilleCellier,
  recupererTousCellier,
  verifierBouteilleCellier,
  ajouterBouteilleListe,
} from "@lib/requetes";

import authentificationStore from "@store/authentificationStore";
import catalogueStore from "@store/catalogueStore";
import { useDocumentTitle } from "@lib/utils.js";

function Catalogue() {
  useDocumentTitle("Catalogue");

  const utilisateur = authentificationStore((state) => state.utilisateur);
  const mainRef = useRef(null);

  // État du store catalogue
  const {
    bouteilles,
    total,
    chargementInitial,
    chargementPlus,
    hasMore,
    erreur,
    filtres,
    recherche,
    tri,
    chargerBouteilles,
    chargerPlus,
    appliquerFiltres,
    appliquerRecherche,
    toggleTri,
    supprimerFiltre,
    reinitialiserFiltres,
    aDesFiltresActifs,
  } = catalogueStore();

  // États locaux pour la modale et les celliers
  const [celliers, setCelliers] = useState([]);
  const [cellierSelectionne, setCellierSelectionne] = useState("");
  const [message, setMessage] = useState({ texte: "", type: "" });
  const [modale, setModale] = useState({
    ouverte: false,
    bouteille: null,
    quantite: 1,
    existe: false,
  });

  const verificationRef = useRef(0);

  // Charger les celliers et les bouteilles au montage
  useEffect(() => {
    if (!utilisateur?.id) {
      setCelliers([]);
      setCellierSelectionne("");
      return;
    }

    const chargerDonnees = async () => {
      try {
        // Charger les celliers
        const dataCelliers = await recupererTousCellier(utilisateur.id);
        const listeCelliers = dataCelliers?.donnees ?? dataCelliers ?? [];
        setCelliers(listeCelliers);

        if (listeCelliers.length > 0) {
          setCellierSelectionne(String(listeCelliers[0].id_cellier));
        } else {
          setMessage({
            texte: "Vous devez d'abord créer un cellier",
            type: "information",
          });
        }

        // Charger les bouteilles
        chargerBouteilles();
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        setMessage({
          texte: "Erreur lors du chargement",
          type: "erreur",
        });
      }
    };

    chargerDonnees();
  }, [utilisateur?.id, chargerBouteilles]);

  // Callbacks pour les filtres
  const handleFiltrer = useCallback(
    (criteres) => {
      appliquerFiltres(criteres);
    },
    [appliquerFiltres]
  );

  const handleRecherche = useCallback(
    (texte) => {
      appliquerRecherche(texte);
    },
    [appliquerRecherche]
  );

  const handleTri = useCallback(() => {
    toggleTri();
  }, [toggleTri]);

  const handleSupprimerFiltre = useCallback(
    (cle) => {
      supprimerFiltre(cle);
    },
    [supprimerFiltre]
  );

  const handleReinitialiserFiltres = useCallback(() => {
    reinitialiserFiltres();
  }, [reinitialiserFiltres]);

  // Ouvre la modale d'ajout
  const ouvrirModale = useCallback(
    (bouteille) => {
      setModale({
        ouverte: true,
        bouteille,
        quantite: 1,
        existe: false,
      });

      if (!cellierSelectionne) return;

      const verificationId = ++verificationRef.current;
      verifierBouteilleCellier(cellierSelectionne, bouteille.id).then((res) => {
        if (verificationRef.current !== verificationId) return;
        if (res?.existe) {
          setModale((prev) => ({
            ...prev,
            existe: true,
            quantite: res.quantite,
          }));
        }
      });
    },
    [cellierSelectionne]
  );

  // Ferme la modale
  const fermerModale = useCallback(() => {
    setModale({
      ouverte: false,
      bouteille: null,
      quantite: 1,
      existe: false,
    });
  }, []);

  // Modifie la quantité
  const modifierQuantite = useCallback((action) => {
    setModale((prev) => ({
      ...prev,
      quantite:
        action === "augmenter"
          ? prev.quantite + 1
          : Math.max(1, prev.quantite - 1),
    }));
  }, []);

  // Change le cellier sélectionné
  const changerCellier = useCallback(
    (idCellier) => {
      setCellierSelectionne(idCellier);
      setModale((prev) => ({
        ...prev,
        existe: false,
        quantite: 1,
      }));

      if (!modale.bouteille) return;

      const verificationId = ++verificationRef.current;
      verifierBouteilleCellier(idCellier, modale.bouteille.id).then((res) => {
        if (verificationRef.current !== verificationId) return;
        if (res?.existe) {
          setModale((prev) => ({
            ...prev,
            existe: true,
            quantite: res.quantite,
          }));
        }
      });
    },
    [modale.bouteille]
  );

  // Confirme l'ajout au cellier
  const confirmerAjout = useCallback(async () => {
    if (!cellierSelectionne || !modale.bouteille) {
      setMessage({
        texte: "Veuillez sélectionner un cellier",
        type: "erreur",
      });
      return;
    }

    try {
      const donnees = {
        id_bouteille: modale.bouteille.id,
        quantite: modale.quantite,
      };

      const resultat = await ajouterBouteilleCellier(
        cellierSelectionne,
        donnees
      );

      if (resultat?.succes) {
        const cellier =
          celliers.find(
            (c) => String(c.id_cellier) === String(cellierSelectionne)
          )?.nom ?? "";

        setMessage({
          texte: `${modale.bouteille.nom} a été ajouté au cellier ${cellier}`,
          type: "succes",
        });
        fermerModale();
      } else {
        setMessage({
          texte: "Erreur lors de l'ajout",
          type: "erreur",
        });
      }
    } catch (error) {
      console.error(error);
      setMessage({
        texte: "Erreur lors de l'ajout",
        type: "erreur",
      });
    }
  }, [cellierSelectionne, celliers, modale, fermerModale]);

  // Ajouter à la liste d'achat
  const ajouterALaListe = useCallback(
    async (bouteille) => {
      try {
        const resultat = await ajouterBouteilleListe(utilisateur.id, {
          id_bouteille: bouteille.id,
        });

        if (resultat?.succes) {
          setMessage({
            texte: `${bouteille.nom} a été ajouté à votre liste avec succès`,
            type: "succes",
          });
        } else {
          setMessage({
            texte: resultat?.erreur || "Erreur lors de l'ajout à la liste",
            type: "erreur",
          });
        }
      } catch (error) {
        console.error(error);
        setMessage({
          texte: "Erreur lors de l'ajout à la liste",
          type: "erreur",
        });
      }
    },
    [utilisateur?.id]
  );

  // Computed values
  const optionsCelliers = useMemo(() => celliers.map((c) => c.nom), [celliers]);
  const cellierCourant = useMemo(
    () =>
      celliers.find((c) => String(c.id_cellier) === cellierSelectionne) ?? null,
    [celliers, cellierSelectionne]
  );
  const etiquetteTri = tri === "nom_asc" ? "A → Z" : "Z → A";
  const filtresActifs = aDesFiltresActifs();
  const messageListeVide = filtresActifs
    ? "Aucune bouteille ne correspond à vos filtres"
    : "Aucune bouteille disponible";

  // Rendu d'une carte bouteille
  const renderBouteille = useCallback(
    (bouteille) => (
      <Link key={bouteille.id} to={`/bouteilles/${bouteille.id}`}>
        <CarteBouteille
          bouteille={bouteille}
          type="catalogue"
          onAjouter={ouvrirModale}
          onAjouterListe={ajouterALaListe}
        />
      </Link>
    ),
    [ouvrirModale, ajouterALaListe]
  );

  // Si l'utilisateur n'est pas connecté
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
          <h1 className="text-(length:--taille-moyen) my-(--rythme-espace) text-center font-display font-semibold text-principal-300">
            Catalogue des vins
          </h1>

          <section className="pt-(--rythme-espace) px-(--rythme-serre)">
            {message.texte && (
              <Message texte={message.texte} type={message.type} />
            )}

            {erreur && <Message texte={erreur} type="erreur" />}

            <div className="flex flex-col gap-(--rythme-espace) lg:flex-row">
              <div className="space-y-(--rythme-base)">
                <FiltresCatalogue
                  filtresActuels={filtres}
                  rechercheActuelle={recherche}
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
                  <InfiniteScrollGrid
                    items={bouteilles}
                    renderItem={renderBouteille}
                    onLoadMore={chargerPlus}
                    hasMore={hasMore}
                    isLoading={chargementPlus}
                    loadingComponent={
                      <Spinner
                        size={140}
                        ariaLabel="Chargement de nouvelles bouteilles"
                      />
                    }
                    emptyComponent={
                      <Message texte={messageListeVide} type="information" />
                    }
                    scrollContainerRef={mainRef}
                  />
                ) : (
                  <Message texte={messageListeVide} type="information" />
                )}
              </div>
            </div>
          </section>
        </main>

        <MenuEnBas />
      </div>

      {/* Modale d'ajout au cellier */}
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
                  arrayOptions={optionsCelliers}
                  value={cellierCourant?.nom || ""}
                  onChange={(e) => {
                    const cellierCible = celliers.find(
                      (x) => x.nom === e.target.value
                    );
                    if (cellierCible) {
                      changerCellier(String(cellierCible.id_cellier));
                    }
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
