import BoutonQuantite from "@components/components-partages/Boutons/BoutonQuantite";
import BoutonAction from "@components/components-partages/Boutons/BoutonAction";

import { formatDetailsBouteille } from "@lib/utils.js";
const CarteListeAchat = ({
  bouteille,
  type = "catalogue",
  onAugmenter = () => {},
  onDiminuer = () => {},
  onAjouter = () => {},
  disabled = false, //désactiver le bouton
}) => {
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
          <div className="flex items-center gap-2">
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
      flex gap-(--rythme-serre)
      bg-fond-secondaire p-(--rythme-base) 
      rounded-(--arrondi-grand) shadow-md"
    >
      {/* Section IMAGE de la bouteille */}
      <div>
        <img
          src={bouteille.image || "/placeholder-bottle.png"}
          alt={`Photo de la bouteille ${bouteille.nom}`}
          className="h-[200px] object-cover"
        />

        {/* Section des contrôles (catalogue ou cellier) */}
        <div className="mt-(--rythme-base)" onClick={handleAjouter}>
          {genererControles()}
        </div>
      </div>

      {/* Section INFORMATIONS de la bouteille */}
      <div className="flex-1 flex flex-col gap-(--rythme-serre) mb-4">
        {/* Nom */}
        <header>
          <h2 className="mb-2 text-(length:--taille-normal) font-semibold text-principal-300">
            {bouteille.nom}
          </h2>
          <hr />
        </header>

        {/* Type ou couleur et description */}
        <div className="flex flex-col gap-(--rythme-serre)">
          <p className="text-(length:--taille-petit) text-texte-secondaire">
            Couleur:{" "}
            <strong className="font-semibold text-principal-300">
              {bouteille.type || bouteille.couleur}
            </strong>
          </p>
          <p className="text-(length:--taille-petit) text-texte-secondaire">
            Description:{" "}
            <strong className="font-semibold text-principal-300">
              {formatDetailsBouteille(bouteille.description)}
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CarteListeAchat;
