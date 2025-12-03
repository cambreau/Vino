import BoutonQuantite from "@components/components-partages/Boutons/BoutonQuantite";
import BoutonAction from "@components/components-partages/Boutons/BoutonAction";
import Icon from "@components/components-partages/Icon/Icon";
import Bouton from "@components/components-partages/Boutons/Bouton";
import iconNotez from "@assets/images/evaluation.svg";
import { formatDetailsBouteille } from "@lib/utils.js";
const CarteNoteDegustation = ({}) => {
  /**
   * Génère les contrôles (boutons) selon le type :
   * - catalogue : bouton "Ajouter au cellier"
   * - cellier : boutons + / - et quantité
   */
  //   const genererControles = () => {
  //     /* ------------------------------
  //      *         MODE CATALOGUE
  //      * ------------------------------ */
  //     if (type === "catalogue") {
  //       return (
  //         <BoutonAction
  //           texte={disabled ? "Déjà dans le cellier" : "Ajouter au cellier"}
  //           onClick={() => onAjouter(bouteille)}
  //           type="secondaire"
  //           disabled={disabled}
  //         />
  //       );
  //     }

  //     /* ------------------------------
  //      *          MODE CELLIER
  //      * ------------------------------ */
  //     if (type === "cellier") {
  //       return (
  //         <div className="flex flex-row gap-2 items-center w-full justify-center">
  //           {/* Contrôles de quantité */}
  //           <div className="flex items-center gap-2">
  //             {/* Bouton MOINS (-) */}
  //             <BoutonQuantite
  //               type="diminuer"
  //               onClick={() => onDiminuer(bouteille.id)}
  //               disabled={disabled || bouteille.quantite <= 0}
  //             />

  //             {/* Quantité affichée */}
  //             <span
  //               className="flex items-center justify-center min-w-8 px-2
  //                              text-texte-principal font-bold text-(length:--taille-normal)"
  //             >
  //               {bouteille.quantite || 0}
  //             </span>

  //             {/* Bouton PLUS (+) */}
  //             <BoutonQuantite
  //               type="augmenter"
  //               onClick={() => onAugmenter(bouteille.id)}
  //               disabled={disabled}
  //             />
  //           </div>
  //         </div>
  //       );
  //     }
  //   };

  return (
    <div
      className="
      flex gap-(--rythme-serre)
      bg-fond-secondaire p-(--rythme-base) 
      rounded-(--arrondi-grand) shadow-md"
    >
      {/* Section INFORMATIONS de la bouteille */}
      <div className="flex-1 flex flex-col gap-(--rythme-serre) mb-4">
        {/* Nom */}
        <div>
          <header className="flex justify-between items-center mb-(--rythme-tres-serre)">
            <h2 className="text-(length:--taille-normal) font-semibold text-principal-300">
              nom utilisateur
            </h2>
            {/* Étoiles pour la notation */}
            <div className="flex justify-center items-center gap-(--rythme-serre)">
              <Icon
                nom={"etoile"}
                size={24}
                couleur="principal-200"
                className="transition-colors"
              />
              <Icon
                nom={"etoile"}
                size={24}
                couleur="principal-200"
                className="transition-colors"
              />
              <Icon
                nom={"etoile"}
                size={24}
                couleur="principal-200"
                className="transition-colors"
              />
            </div>
          </header>
          <hr className="my-(--rythme-serre)"/>
        </div>

        {/* Type ou couleur et description */}
        <div className="flex flex-col gap-(--rythme-serre)">
          <p className="text-(length:--taille-petit) text-texte-secondaire">
            Description:{" "}
            <strong className="font-semibold text-principal-300">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi,
              praesentium quod. Sapiente vero recusandae aliquid, quia
              repellendus porro ex modi deserunt enim alias aperiam nobis,
              voluptates laborum corporis, velit dolorum.
            </strong>
          </p>
          <p className="text-(length:--taille-petit) text-texte-secondaire">
            date:{" "}
            <strong className="font-semibold text-principal-300">
              12/12/2025
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CarteNoteDegustation;
