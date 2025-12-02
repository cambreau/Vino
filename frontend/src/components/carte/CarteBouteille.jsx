import { useState } from "react";
import { createPortal } from "react-dom";
import BoutonQuantite from "@components/components-partages/Boutons/BoutonQuantite";
import { GiNotebook } from "react-icons/gi";
import iconNotez from "@assets/images/evaluation.svg";
import Bouton from "@components/components-partages/Boutons/Bouton";
import BoiteModaleNotes from "@components/boiteModaleNotes/boiteModaleNotes";

const CarteBouteille = ({
  bouteille,
  type = "catalogue",
  onAugmenter = () => {},
  onDiminuer = () => {},
  onAjouter = () => {},
  onAjouterListe = () => {},
  disabled = false, //désactiver le bouton
}) => {
  const [estModaleNotezOuverte, setEstModaleNotezOuverte] = useState(false);

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

  const validerNote = (data) => {
    console.log(
      "Note:",
      data.note,
      "Commentaire:",
      data.commentaire,
      "Bouteille ID:",
      bouteille.id
    );
    // Ici tu peux ajouter l'appel API pour sauvegarder la note
    fermerBoiteModaleNotez();
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
            action={handleAjouter}
            disabled={disabled}
          />

          <Bouton
            variante="icone"
            icone={<GiNotebook size={20} />}
            action={gererAjouterListe}
            disabled={disabled}
          />
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
        </div>
      );
    }
  };

  // Arreter la propagation et afficher le modale pour ajouter la bouteille
  const handleAjouter = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onAjouter(bouteille);
  };

  const gererAjouterListe = (e) => {
    if (e && typeof e.stopPropagation === "function") {
      e.stopPropagation();
      e.preventDefault();
    }
    onAjouterListe(bouteille);
  };

  /**
   * Utilise createPortal pour rendre la modale directement dans le body
   * Cela garantit qu'elle est en dehors de la hiérarchie DOM (et donc du Link)
   * Ref: https://react.dev/reference/react-dom/createPortal
   */
  const modaleContent = estModaleNotezOuverte ? (
    <BoiteModaleNotes
      nomBouteille={bouteille.nom}
      onFermer={fermerBoiteModaleNotez}
      onValider={validerNote}
    />
  ) : null;

  return (
    <div
      className="
      flex flex-col justify-between
      bg-fond-secondaire p-(--rythme-serre) 
      rounded-(--arrondi-grand) shadow-md min-h-[320px]"
    >
      {/* Section IMAGE de la bouteille */}
      <div
        className="
        flex items-center justify-center bg-fond-secondaire 
        rounded-(--arrondi-grand) mb-(--rythme-tres-serre)"
      >
        <img
          src={bouteille.image || "/placeholder-bottle.png"}
          alt={`Photo de la bouteille ${bouteille.nom}`}
          className="h-40 w-auto object-contain"
        />
      </div>
      {/* Section INFORMATIONS de la bouteille */}
      <div className="mb-4">
        {/* Nom */}
        <h2 className="mb-2 text-(length:--taille-normal) font-bold text-texte-secondaire">
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
    </div>
  );
};

export default CarteBouteille;
