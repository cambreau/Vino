import { useState, useEffect, useCallback } from "react";
import BoiteModale from "@components/components-partages/BoiteModale/BoiteModale";
import FormulaireSelect from "@components/components-partages/Formulaire/FormulaireSelect/FormulaireSelect";
import BoutonQuantite from "@components/components-partages/Boutons/BoutonQuantite";
import Bouton from "@components/components-partages/Boutons/Bouton";
import Message from "@components/components-partages/Message/Message";
import Spinner from "@components/components-partages/Spinner/Spinner";
import {
  recupererTousCellier,
  verifierBouteilleCellier,
  ajouterBouteilleCellier,
  modifierBouteilleCellier,
} from "@lib/requetes";
import authentificationStore from "@store/authentificationStore";

/**
 * Composant modale pour ajouter ou modifier une bouteille au cellier.
 * Le composant charge automatiquement les celliers depuis l'API.
 *
 * @param {Object} props - Les propriétés du composant
 * @param {string|number} props.id_bouteille - ID de la bouteille à ajouter/modifier
 * @param {string} props.nom_bouteille - Nom de la bouteille à afficher
 * @param {boolean} props.estOuverte - Contrôle l'ouverture/fermeture de la modale
 * @param {Function} props.onFermer - Callback appelé pour fermer la modale
 * @param {string|number} [props.cellierSelectionne] - ID du cellier sélectionné (optionnel, peut être vide string ou un ID)
 */
function BoiteModaleAjoutBouteilleCellier({
  id_bouteille,
  nom_bouteille,
  estOuverte,
  onFermer,
  cellierSelectionne = "",
}) {
  // *** Récupère le store utilisateur pour l'id_utilisateur
  const utilisateur = authentificationStore((state) => state.utilisateur);

  // *** Les celliers de l'utilisateur
  const [celliers, setCelliers] = useState([]);
  const [chargementCelliers, setChargementCelliers] = useState(true);

  // Charger les celliers en fonction de l'ID utilisateur
  useEffect(() => {
    const chargerCelliers = async () => {
      if (!utilisateur?.id) {
        setChargementCelliers(false);
        return;
      }

      setChargementCelliers(true);
      const celliersData = await recupererTousCellier(utilisateur.id);

      // Gérer différents formats de réponse
      const celliersList =
        celliersData?.donnees ||
        celliersData?.data ||
        (Array.isArray(celliersData) ? celliersData : []);

      if (celliersList.length > 0) {
        setCelliers(celliersList);
        // Sélectionner le premier cellier par défaut si aucun n'est fourni en props
        if (!cellierSelectionne && celliersList.length > 0) {
          setBouteilleCellier((prev) => ({
            ...prev,
            id_cellier: String(celliersList[0].id_cellier),
          }));
        }
      } else {
        setCelliers([]);
      }
      setChargementCelliers(false);
    };

    // Charger les celliers SEULEMENT quand la modale s'ouvre
    if (estOuverte && utilisateur?.id) {
      chargerCelliers();
    }
  }, [utilisateur?.id, estOuverte, cellierSelectionne]);

  // *** État pour bouteille_cellier qui sera envoyé lors de l'ajout ou de la modification
  const [bouteilleCellier, setBouteilleCellier] = useState({
    id_bouteille: "",
    id_cellier: "",
    quantite: 0,
  });

  // La bouteille est déjà dans le cellier ?
  const [bouteilleExiste, setBouteilleExiste] = useState({
    existe: false,
    id_cellier: "",
    quantite: 0,
  });

  const [chargementAjout, setChargementAjout] = useState(false);
  const [chargementVerification, setChargementVerification] = useState(false);

  /**
   * Vérifie si la bouteille existe déjà dans le cellier sélectionné
   */
  const verifierBouteilleDansCellier = useCallback(
    async (idCellier) => {
      if (!id_bouteille || !idCellier) return;

      setChargementVerification(true);
      const resultat = await verifierBouteilleCellier(idCellier, id_bouteille);

      if (resultat?.existe) {
        setBouteilleExiste({
          existe: true,
          id_cellier: idCellier,
          quantite: resultat.quantite || 0,
        });
        // Mettre à jour bouteilleCellier avec les données de la bouteille existante
        setBouteilleCellier((prev) => ({
          ...prev,
          id_bouteille: id_bouteille,
          quantite: resultat.quantite || 0,
        }));
      } else {
        setBouteilleExiste({
          existe: false,
          id_cellier: "",
          quantite: 0,
        });
        // Réinitialiser la quantité à 0 si la bouteille n'existe pas (mode ajout)
        setBouteilleCellier((prev) => ({
          ...prev,
          id_bouteille: id_bouteille,
          quantite: 0,
        }));
      }
      setChargementVerification(false);
    },
    [id_bouteille]
  );

  // Mettre à jour id_cellier si cellierSelectionne
  useEffect(() => {
    if (cellierSelectionne) {
      setBouteilleCellier((prev) => ({
        ...prev,
        id_cellier: String(cellierSelectionne),
      }));
    }
  }, [cellierSelectionne]);

  // Réinitialiser la modale quand elle s'ouvre
  useEffect(() => {
    if (estOuverte && id_bouteille) {
      setBouteilleCellier({
        id_bouteille: id_bouteille,
        id_cellier: cellierSelectionne || "",
        quantite: 0,
      });
      setBouteilleExiste({
        existe: false,
        id_cellier: "",
        quantite: 0,
      });
    }
  }, [estOuverte, id_bouteille, cellierSelectionne]);

  // Vérifier la bouteille quand la modale s'ouvre ou que le cellier change
  useEffect(() => {
    if (
      estOuverte &&
      bouteilleCellier.id_bouteille &&
      bouteilleCellier.id_cellier
    ) {
      verifierBouteilleDansCellier(bouteilleCellier.id_cellier);
    }
  }, [
    estOuverte,
    bouteilleCellier.id_bouteille,
    bouteilleCellier.id_cellier,
    verifierBouteilleDansCellier,
  ]);

  /**
   * Gère le changement de cellier sélectionné
   */
  const gererChangementCellier = useCallback(
    (e) => {
      // e.target.value est maintenant l'ID du cellier
      const idCellier = e.target.value;
      if (idCellier) {
        setBouteilleCellier((prev) => ({
          ...prev,
          id_cellier: idCellier,
        }));
        verifierBouteilleDansCellier(idCellier);
      }
    },
    [verifierBouteilleDansCellier]
  );

  /**
   * Modifie la quantité dans la modale
   */
  const modifierQuantite = useCallback((action) => {
    setBouteilleCellier((prev) => ({
      ...prev,
      quantite:
        action === "augmenter"
          ? prev.quantite + 1
          : Math.max(0, prev.quantite - 1),
    }));
  }, []);

  /**
   * Confirme l'ajout ou la modification de la bouteille au cellier
   */
  const confirmerAjout = useCallback(async () => {
    setChargementAjout(true);

    try {
      const resultat = bouteilleExiste.existe
        ? await modifierBouteilleCellier(
            bouteilleCellier.id_cellier,
            bouteilleCellier.id_bouteille,
            bouteilleCellier.quantite
          )
        : await ajouterBouteilleCellier(bouteilleCellier.id_cellier, {
            id_bouteille: bouteilleCellier.id_bouteille,
            quantite: bouteilleCellier.quantite,
          });

      if (resultat?.succes) {
        setTimeout(() => {
          onFermer();
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setChargementAjout(false);
    }
  }, [bouteilleCellier, bouteilleExiste.existe, onFermer]);

  // Ne rien afficher si la modale n'est pas ouverte
  if (!estOuverte || !id_bouteille || !nom_bouteille) {
    return null;
  }

  // Préparer les options pour le select avec l'ID comme valeur
  // On crée un mapping pour pouvoir utiliser l'ID comme value
  const optionsCelliers = celliers.map((c) => ({
    valeur: String(c.id_cellier),
    texte: c.nom,
  }));

  return (
    <BoiteModale
      texte={
        bouteilleExiste.existe ? "Modifier la quantité" : "Confirmation d'ajout"
      }
      contenu={
        <div className="w-full">
          <p className="text-texte-principal font-bold text-center mb-(--rythme-base)">
            {nom_bouteille}
          </p>

          {chargementCelliers || chargementVerification ? (
            <div className="flex justify-center items-center py-(--rythme-base)">
              <Spinner />
            </div>
          ) : celliers.length === 0 ? (
            <Message
              texte="Vous n'avez aucun cellier. Veuillez en créer un d'abord."
              type="information"
            />
          ) : (
            <>
              <div className="mb-(--rythme-base)">
                <FormulaireSelect
                  nom="Cellier"
                  genre="un"
                  estObligatoire={true}
                  arrayOptions={optionsCelliers}
                  value={bouteilleCellier.id_cellier || ""}
                  onChange={gererChangementCellier}
                  classCouleur="Clair"
                  fullWidth={true}
                />
              </div>

              <div className="flex items-center justify-center gap-(--rythme-serre)">
                <span className="text-texte-secondaire">
                  Quantité au cellier :
                </span>
                <BoutonQuantite
                  type="diminuer"
                  onClick={() => modifierQuantite("diminuer")}
                  disabled={bouteilleCellier.quantite < 1}
                />
                <span className="min-w-8 px-2 text-texte-principal font-bold">
                  {bouteilleCellier.quantite}
                </span>
                <BoutonQuantite
                  type="augmenter"
                  onClick={() => modifierQuantite("augmenter")}
                />
              </div>
            </>
          )}
        </div>
      }
      bouton={
        <>
          <Bouton
            texte="Annuler"
            type="secondaire"
            typeHtml="button"
            action={onFermer}
            disabled={chargementAjout}
          />
          <Bouton
            texte={bouteilleExiste.existe ? "Modifier" : "Ajouter"}
            type="primaire"
            typeHtml="button"
            action={confirmerAjout}
            disabled={
              chargementAjout ||
              celliers.length === 0 ||
              !bouteilleCellier.id_cellier ||
              chargementCelliers ||
              chargementVerification
            }
          />
        </>
      }
    />
  );
}

export default BoiteModaleAjoutBouteilleCellier;
