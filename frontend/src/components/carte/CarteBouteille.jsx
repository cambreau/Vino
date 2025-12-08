import { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import BoutonQuantite from "@components/components-partages/Boutons/BoutonQuantite";
import { IconCarnet } from "@components/components-partages/Icon/SvgIcons";
import iconNotez from "@assets/images/evaluation.svg";
import Bouton from "@components/components-partages/Boutons/Bouton";
import BoiteModaleNotes from "@components/boiteModaleNotes/boiteModaleNotes";
import BoiteModaleAjoutBouteilleCellier from "@components/boiteModaleAjoutBouteilleCellier/boiteModaleAjoutBouteilleCellier";
import MoyenneEtCompteurNotes from "@components/HistoriqueNotes/MoyenneEtCompteurNotes/MoyenneEtCompteurNotes";
import GestionListeAchat from "@components/components-partages/ListeAchat/GestionListeAchat";
import ImageOptimisee from "@components/components-partages/ImageOptimisee/ImageOptimisee";

const CarteBouteille = ({
  bouteille,
  type = "catalogue",
  onAugmenter = () => {},
  onDiminuer = () => {},
  disabled = false, //désactiver le bouton
  aNote = false, //indique si l'utilisateur a déjà noté la bouteille
  priority = false, // Si true, charge l'image en priorité (pour LCP)
  dispatch,
  ACTIONS,
}) => {
  const [estModaleNotezOuverte, setEstModaleNotezOuverte] = useState(false);
  const [estModaleAjoutOuverte, setEstModaleAjoutOuverte] = useState(false);

  const ouvrirBoiteModaleNotez = (e, idBouteille) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setEstModaleNotezOuverte(true);
  };

  const fermerBoiteModaleNotez = () => {
    setEstModaleNotezOuverte(false);
  };

  const ouvrirBoiteModaleAjout = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (disabled) return;
    setEstModaleAjoutOuverte(true);
  };

  const fermerBoiteModaleAjout = () => {
    setEstModaleAjoutOuverte(false);
  };

  /**
   * Génère les contrôles (boutons) selon le type :
   * - catalogue : bouton "Ajouter au cellier"
   * - cellier : boutons + / - et quantité
   */
  const genererControles = () => {
    /* ------------------------------
     *         MODE CATALOGUE
     * ------------------------------ */
    if (type === "catalogue") {
      return (
        <div className="grid grid-cols-[1fr_auto] gap-4 w-full items-center">
          <Bouton
            texte={disabled ? "Déjà dans le cellier" : "Ajouter au cellier"}
            type="secondaire"
            action={ouvrirBoiteModaleAjout}
            disabled={disabled}
          />

          <GestionListeAchat
            bouteille={bouteille}
            dispatch={dispatch}
            ACTIONS={ACTIONS}
          >
            {({ gererAjouterListe, dansListe }) => (
              <Bouton
                variante="icone"
                icone={<IconCarnet size={20} />}
                action={gererAjouterListe}
                disabled={disabled}
                className={
                  "transition-colors " +
                  (dansListe
                    ? "bg-principal-200 text-principal-100"
                    : "bg-principal-100 text-principal-300")
                }
              />
            )}
          </GestionListeAchat>
        </div>
      );
    }

    /* ------------------------------
     *          MODE CELLIER
     * ------------------------------ */
    if (type === "cellier") {
      return (
        <div className="flex flex-row gap-2 items-center w-full justify-center">
          {/* Contrôles de quantité */}
          <div className="flex items-center gap-2 justify-center mr-(--rythme-base)">
            {/* Bouton MOINS (-) */}
            <BoutonQuantite
              type="diminuer"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onDiminuer(bouteille.id);
              }}
              disabled={disabled || bouteille.quantite <= 0}
            />

            {/* Quantité affichée */}
            <span
              className="flex items-center justify-center min-w-8 px-2 
                             text-texte-principal font-bold text-(length:--taille-normal)"
            >
              {bouteille.quantite || 0}
            </span>

            {/* Bouton PLUS (+) */}
            <BoutonQuantite
              type="augmenter"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onAugmenter(bouteille.id);
              }}
              disabled={disabled}
            />
          </div>
          {aNote ? (
            <Link
              to={`/bouteilles/${bouteille.id}#historique-notes`}
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="block no-underline "
            >
              <Bouton
                texte={
                  <span className="flex items-center gap-(--rythme-tres-serre)">
                    Voir
                    <img
                      src={iconNotez}
                      alt="Icône évaluation"
                      className="w-5 h-5"
                    />
                  </span>
                }
                type="secondaire"
                typeHtml="button"
                disabled={false}
              />
            </Link>
          ) : (
            <Bouton
              texte={
                <span className="flex items-center gap-(--rythme-tres-serre)">
                  Notez
                  <img
                    src={iconNotez}
                    alt="Icône évaluation"
                    className="w-5 h-5"
                  />
                </span>
              }
              type="secondaire"
              action={(e) => ouvrirBoiteModaleNotez(e, bouteille.id)}
              typeHtml="button"
              disabled={false}
            />
          )}
        </div>
      );
    }
  };

  /**
   * Utilise createPortal pour rendre la modale directement dans le body
   * Cela garantit qu'elle est en dehors de la hiérarchie DOM (et donc du Link)
   * Ref: https://react.dev/reference/react-dom/createPortal
   */
  const modaleContent = estModaleNotezOuverte ? (
    <BoiteModaleNotes
      id_bouteille={bouteille.id}
      onFermer={fermerBoiteModaleNotez}
    />
  ) : null;

  const modaleAjoutContent = estModaleAjoutOuverte ? (
    <BoiteModaleAjoutBouteilleCellier
      id_bouteille={bouteille.id}
      nom_bouteille={bouteille.nom}
      estOuverte={estModaleAjoutOuverte}
      onFermer={fermerBoiteModaleAjout}
    />
  ) : null;

  return (
    <div className="relative flex flex-col justify-between bg-fond-secondaire p-(--rythme-serre) rounded-(--arrondi-grand) shadow-md min-h-80">
      {type === "cellier" && (
        <div className="absolute top-(--rythme-tres-serre) left-(--rythme-tres-serre) z-10">
          <GestionListeAchat
            bouteille={bouteille}
            dispatch={dispatch}
            ACTIONS={ACTIONS}
          >
            {({ gererAjouterListe, dansListe }) => (
              <Bouton
                variante="icone"
                icone={<IconCarnet size={20} />}
                action={gererAjouterListe}
                disabled={disabled}
                className={
                  "transition-colors " +
                  (dansListe
                    ? "bg-principal-200 text-principal-100"
                    : "bg-principal-100 text-principal-300")
                }
              />
            )}
          </GestionListeAchat>
        </div>
      )}

      {/* Badge moyenne + nombre de notes en haut à droite */}
      <div className="absolute top-(--rythme-tres-serre) right-(--rythme-tres-serre) z-10">
        <MoyenneEtCompteurNotes
          id_bouteille={bouteille.id}
          moyenneNotes={bouteille.moyenneNotes}
          nombreNotes={bouteille.nombreNotes}
        />
      </div>

      {/* Section IMAGE de la bouteille */}
      <div className="flex items-center justify-center bg-fond-secondaire rounded-(--arrondi-grand) mb-(--rythme-tres-serre) h-40 relative">
        <ImageOptimisee
          src={bouteille.image}
          alt={`Photo de la bouteille ${bouteille.nom}`}
          width={107}
          height={160}
          priority={priority}
          className="h-40 w-auto object-contain"
        />
      </div>

      {/* Section INFORMATIONS de la bouteille */}
      <div className="mb-4">
        {/* Nom */}
        <h2 className="mb-2 text-(length:--taille-normal) font-semibold text-texte-secondaire">
          {bouteille.nom}
        </h2>

        {/* Type ou couleur */}
        <p className="text-(length:--taille-petit) text-texte-secondaire">
          {bouteille.type || bouteille.couleur}
        </p>
      </div>

      {/* Section des contrôles (catalogue ou cellier) */}
      <div className="flex justify-center items-center gap-3">
        {genererControles()}
      </div>
      {/* Boîte modale pour noter la bouteille */}
      {modaleContent && createPortal(modaleContent, document.body)}
      {/* Boîte modale pour ajouter la bouteille au cellier (catalogue) */}
      {modaleAjoutContent && createPortal(modaleAjoutContent, document.body)}
    </div>
  );
};

export default CarteBouteille;
