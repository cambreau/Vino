import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import MenuEnHaut from "@components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "@components/components-partages/MenuEnBas/MenuEnBas";
import Bouton from "@components/components-partages/Boutons/Bouton";
import Message from "@components/components-partages/Message/Message";
import CarteBouteille from "@components/carte/CarteBouteille";
import Filtres from "@components/components-partages/Filtre/Filtre";
import NonTrouver from "@components/components-partages/NonTrouver/NonTrouverLazy";
import {
  recupererCellier,
  recupererBouteillesCellier,
  modifierBouteilleCellier,
  recupererNotesUtilisateur,
} from "@lib/requetes.js";
import {
  useDocumentTitle,
  filtrerBouteilles,
  rechercherBouteilles,
  useListeAchat,
} from "@lib/utils.js";
import authentificationStore from "@store/authentificationStore";
import listeAchatStore from "@store/listeAchatStore";


function Cellier() {
  const navigate = useNavigate();
  // Récupérer id du cellier dans l'URL
  const { idCellier } = useParams();
  const utilisateur = authentificationStore((state) => state.utilisateur);

  // Charger la liste d'achat UNE SEULE FOIS au niveau du Cellier
  const chargerListeAchat = listeAchatStore((state) => state.chargerListeAchat);
  useEffect(() => {
    if (utilisateur?.id) {
      chargerListeAchat(utilisateur.id);
    }
  }, [utilisateur?.id, chargerListeAchat]);

  //============  Hook pour gérer l'état et les messages de la liste d'achat
  const { etat, dispatch, ACTIONS } = useListeAchat();
  
  // Etat pour le cellier : nom
  const [cellier, setCellier] = useState({
    nom: "",
  });
  useDocumentTitle(cellier.nom ? `Cellier - ${cellier.nom}` : "Cellier");

  useEffect(() => {
    const chargerCellier = async () => {
      const donneesCellier = await recupererCellier(idCellier);
      setCellier({
        nom: donneesCellier.nom || "",
      });
    };
    chargerCellier();
  }, [idCellier]);

  // Etat pour les bouteilles : récupérer les bouteilles complètes du cellier
  const [bouteillesCellier, setBouteillesCellier] = useState([]);
  const [chargementBouteilles, setChargementBouteilles] = useState(false);
  const [messageAction, setMessageAction] = useState({ texte: "", type: "" });
  const [bouteillesEnTraitement, setBouteillesEnTraitement] = useState(
    () => new Set()
  );
  // État pour stocker les notes de l'utilisateur
  const [notesUtilisateur, setNotesUtilisateur] = useState([]);

  useEffect(() => {
    const chargerBouteillesCellier = async () => {
      setChargementBouteilles(true);
      const datas = await recupererBouteillesCellier(idCellier);
      console.log("Bouteilles récupérées pour le cellier:", datas);
      setBouteillesCellier(datas || []);
      setChargementBouteilles(false);
    };
    chargerBouteillesCellier();
  }, [idCellier]);

  // Récupérer toutes les notes de l'utilisateur
  useEffect(() => {
    const chargerNotesUtilisateur = async () => {
      if (!utilisateur?.id) {
        setNotesUtilisateur([]);
        return;
      }

      const notes = await recupererNotesUtilisateur(utilisateur.id);
      setNotesUtilisateur(notes || []);
    };

    chargerNotesUtilisateur();
  }, [utilisateur?.id]);

  // Calculer les IDs des bouteilles notées à partir des notes récupérées
  const bouteillesNotees = useMemo(() => {
    const bouteillesNoteesSet = new Set();
    if (notesUtilisateur && Array.isArray(notesUtilisateur)) {
      notesUtilisateur.forEach((note) => {
        if (note.id_bouteille) {
          bouteillesNoteesSet.add(note.id_bouteille);
        }
      });
    }
    return bouteillesNoteesSet;
  }, [notesUtilisateur]);

  const definirTraitement = (idBouteille, actif) => {
    setBouteillesEnTraitement((courant) => {
      const prochain = new Set(courant);
      if (actif) {
        prochain.add(idBouteille);
      } else {
        prochain.delete(idBouteille);
      }
      return prochain;
    });
  };

  const mettreAJourQuantite = async (idBouteille, variation) => {
    if (bouteillesEnTraitement.has(idBouteille)) {
      return;
    }

    const bouteilleCible = bouteillesCellier.find((b) => b.id === idBouteille);

    if (!bouteilleCible) {
      return;
    }

    const prochaineQuantite = Math.max(
      0,
      (bouteilleCible.quantite || 0) + variation
    );
    definirTraitement(idBouteille, true);
    const resultat = await modifierBouteilleCellier(
      bouteilleCible.idCellier ?? Number.parseInt(idCellier, 10),
      idBouteille,
      prochaineQuantite
    );
    definirTraitement(idBouteille, false);

    if (!resultat?.succes) {
      setMessageAction({
        texte:
          resultat?.erreur ||
          "Impossible de mettre à jour la quantité pour cette bouteille.",
        type: "erreur",
      });
      return;
    }

    // Nettoyer un éventuel ancien message d'erreur
    setMessageAction({ texte: "", type: "" });

    setBouteillesCellier((precedent) => {
      if (prochaineQuantite === 0 || resultat.supprime) {
        return precedent.filter((b) => b.id !== idBouteille);
      }

      return precedent.map((b) =>
        b.id === idBouteille
          ? { ...b, quantite: resultat.quantite ?? prochaineQuantite }
          : b
      );
    });
  };

  const handleAugmenter = (idBouteille) => mettreAJourQuantite(idBouteille, 1);
  const handleDiminuer = (idBouteille) => mettreAJourQuantite(idBouteille, -1);

  // États pour les filtres
  const [criteresFiltres, setCriteresFiltres] = useState({});
  const [modeRecherche, setModeRecherche] = useState(false);
  const [resultatsFiltres, setResultatsFiltres] = useState(null);
  const [modeTri, setModeTri] = useState("nom_asc");

  // Vérifie si des filtres sont actifs
  const filtresActifs = useMemo(
    () =>
      Object.values(criteresFiltres ?? {}).some((valeur) => Boolean(valeur)),
    [criteresFiltres]
  );

  // Handler pour le filtrage
  const handleFiltrer = useCallback((criteres, resultats) => {
    const actifs = Object.values(criteres ?? {}).some((valeur) =>
      Boolean(valeur)
    );
    setModeRecherche(false);
    setCriteresFiltres(criteres);
    setResultatsFiltres(actifs ? resultats : null);
  }, []);

  // Handler pour la recherche
  const handleRecherche = useCallback(
    (recherche) => {
      const criteres =
        typeof recherche === "string" ? { nom: recherche } : recherche ?? {};
      const actifs = Object.values(criteres ?? {}).some((valeur) =>
        Boolean(valeur)
      );
      if (!actifs) {
        setResultatsFiltres(null);
        setModeRecherche(false);
        setCriteresFiltres(criteres);
        return;
      }
      setModeRecherche(true);
      setCriteresFiltres(criteres);
      const resultats = rechercherBouteilles(bouteillesCellier, criteres);
      setResultatsFiltres(resultats);
    },
    [bouteillesCellier]
  );

  // Handler pour le tri
  const handleTri = useCallback(() => {
    setModeTri((prev) => (prev === "nom_asc" ? "nom_desc" : "nom_asc"));
  }, []);

  // Handler pour supprimer un filtre
  const handleSupprimerFiltre = useCallback((cle) => {
    setCriteresFiltres((prev) => {
      const nouveauxCriteres = { ...prev, [cle]: "" };
      if (cle === "pays") {
        nouveauxCriteres.region = "";
      }
      return nouveauxCriteres;
    });
  }, []);

  // Handler pour réinitialiser les filtres
  const handleReinitialiserFiltres = useCallback(() => {
    setCriteresFiltres({});
    setModeRecherche(false);
    setResultatsFiltres(null);
  }, []);

  // Fonction de tri des bouteilles
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

  // Bouteilles à afficher (filtrées et triées)
  const bouteillesAffichees = useMemo(
    () => trierBouteilles(resultatsFiltres ?? bouteillesCellier, modeTri),
    [resultatsFiltres, bouteillesCellier, modeTri, trierBouteilles]
  );

  const etiquetteTri = modeTri === "nom_asc" ? "A → Z" : "Z → A";

  return (
    <div className="h-screen font-body grid grid-rows-[auto_1fr_auto] overflow-hidden">
      <header>
        <MenuEnHaut />
      </header>

      <main className="bg-fond overflow-y-auto">
        <section className="pt-(--rythme-espace) pb-(--rythme-base) px-(--rythme-serre)">
          <h1 className="text-(length:--taille-grand) text-center font-display font-semibold text-principal-300">
            Cellier - {cellier.nom}
          </h1>

          <article className="mt-(--rythme-base) p-(--rythme-serre) min-h-[200px]">
            {/* Affiche le message de GestionListeAchat */}
            {etat.message.texte && (
              <div className="mb-(--rythme-base)">
                <Message
                  type={etat.message.type}
                  texte={etat.message.texte}
                />
              </div>
            )} 
            
            {messageAction.texte && (
              <div className="mb-(--rythme-base)">
                <Message
                  type={messageAction.type}
                  texte={messageAction.texte}
                />
              </div>
            )}
            {chargementBouteilles ? (
              <Message
                type="information"
                texte="Chargement des bouteilles du cellier..."
              />
            ) : bouteillesCellier.length > 0 ? (
              <>
                <div className="mb-(--rythme-base)">
                  <Filtres
                    bouteilles={bouteillesCellier}
                    filtresActuels={criteresFiltres}
                    rechercheActuelle={modeRecherche ? criteresFiltres.nom || "" : ""}
                    onFiltrer={handleFiltrer}
                    onRecherche={handleRecherche}
                    onTri={handleTri}
                    onSupprimerFiltre={handleSupprimerFiltre}
                    onReinitialiserFiltres={handleReinitialiserFiltres}
                    titreTri={etiquetteTri}
                  />
                </div>
                {bouteillesAffichees.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {bouteillesAffichees.map((bouteille) => (
                      <Link
                        key={bouteille.id}
                        to={`/bouteilles/${bouteille.id}`}
                      >
                        <CarteBouteille
                          key={bouteille.id}
                          bouteille={bouteille}
                          type="cellier"
                          onAugmenter={handleAugmenter}
                          onDiminuer={handleDiminuer}
                          disabled={bouteillesEnTraitement.has(bouteille.id)}
                          aNote={bouteillesNotees.has(bouteille.id)}
                           dispatch={dispatch}
                          ACTIONS={ACTIONS}
                        />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center py-(--rythme-espace)">
                    <NonTrouver
                      size={180}
                      message={
                        modeRecherche
                          ? "Aucune bouteille ne correspond à votre recherche"
                          : "Aucune bouteille ne correspond à vos filtres"
                      }
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-(--rythme-base)">
                <div className="mb-(--rythme-base) w-full">
                  <Message
                    type="information"
                    texte="Vous n'avez pas encore de bouteilles dans ce cellier."
                  />
                </div>

                <Bouton
                  taille="moyen"
                  texte="Ajouter une bouteille"
                  type="primaire"
                  typeHtml="button"
                  action={() => {
                    navigate("/catalogue");
                  }}
                />
              </div>
            )}
          </article>
        </section>
      </main>

      <MenuEnBas />
    </div>
  );
}

export default Cellier;
