import { useState } from "react";
import BoutonQuantite from "@components/components-partages/Boutons/BoutonQuantite";
import BoutonAction from "@components/components-partages/Boutons/BoutonAction";
import iconNotez from "@assets/images/evaluation.svg";
import Bouton from "@components/components-partages/Boutons/Bouton";
import BoiteModaleNotes from "@components/boiteModaleNotes/boiteModaleNotes";

const CarteBouteille = ({
  bouteille,
  type = "catalogue",
  onAugmenter = () => {},
  onDiminuer = () => {},
  onAjouter = () => {},
  disabled = false, //désactiver le bouton
}) => {
  const [estModaleNotezOuverte, setEstModaleNotezOuverte] = useState(false);

  const ouvrirBoiteModaleNotez = (idBouteille) => {
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
        <BoutonAction
          texte={disabled ? "Déjà dans le cellier" : "Ajouter au cellier"}
          onClick={() => onAjouter(bouteille)}
          type="secondaire"
          disabled={disabled}
        />
      );
    }

    /* ------------------------------
     *          MODE CELLIER
     * ------------------------------ */
    if (type === "cellier") {
      return (
        <div className="flex flex-row gap-2 items-center w-full justify-center">
          {/* Contrôles de quantité */}
          <div className="flex items-center gap-2 mr-(--rythme-base)">
            {/* Bouton MOINS (-) */}
            <BoutonQuantite
              type="diminuer"
              onClick={() => onDiminuer(bouteille.id)}
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
              onClick={() => onAugmenter(bouteille.id)}
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
            action={() => ouvrirBoiteModaleNotez(bouteille.id)}
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

  return (
    <div
      className="
      flex flex-col 
      bg-fond-secondaire p-(--rythme-serre) 
      rounded-(--arrondi-grand) shadow-md"
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
      <div className="flex-1 mb-4">
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
      <div
        className="flex justify-center items-center gap-3"
        onClick={handleAjouter}
      >
        {genererControles()}
      </div>

      {/* Boîte modale pour noter la bouteille */}
      {estModaleNotezOuverte && (
        <BoiteModaleNotes
          nomBouteille={bouteille.nom}
          onFermer={fermerBoiteModaleNotez}
          onValider={validerNote}
        />
      )}
    </div>
  );
};

export default CarteBouteille;
