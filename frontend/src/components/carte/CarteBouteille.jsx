import BoutonQuantite from "../components-partages/Boutons/BoutonQuantite";
import BoutonAction from "../components-partages/Boutons/BoutonAction";

const CarteBouteille = ({ 
  bouteille, 
  type = "catalogue", 
  onAugmenter = () => {},
  onDiminuer = () => {}, 
  onBoire = () => {}
}) => {


  // Fonction qui génère les boutons selon le type (catalogue ou cellier)
  const genererControles = () => {
    // Si on est dans le CATALOGUE: on affiche seulement le bouton "Boire"
    if (type === "catalogue") {
      return (
        <BoutonAction 
          texte="Boire"
          onClick={() => onBoire(bouteille)} 
          type="primaire"
        />
      );
    }
    
    // Si on est dans le CELLIER: on affiche les boutons +/- et "Boire"
    if (type === "cellier") {
      return (
        <div className="flex flex-row justify-between gap-2 items-center w-full">
          
          {/* Bouton Boire - désactivé si quantité = 0 */}
          <BoutonAction 
            texte="Boire"
            onClick={() => onBoire(bouteille)}
            type="primaire"
            disabled={bouteille.quantite <= 0}
          />

          {/* Section des contrôles de quantité */}
          <div className="flex items-center gap-2">
            
            {/* Bouton MOINS (-) */}
            <BoutonQuantite 
              type="diminuer"
              onClick={() => onDiminuer(bouteille.id)}
              disabled={bouteille.quantite <= 0}
            />
            
            {/* Affichage du nombre de bouteilles */}
            <span className="flex items-center justify-center min-w-8 px-2 
                           text-texte-principal font-bold text-(length:--taille-normal)">
              {bouteille.quantite || 0}
            </span>
            
            {/* Bouton PLUS (+) */}
            <BoutonQuantite 
              type="augmenter"
              onClick={() => onAugmenter(bouteille.id)} 
            />
          </div>

        </div>
      );
    }
  };

  return (
    <div className="
    flex flex-col 
    bg-fond-secondaire p-(--rythme-serre) 
    rounded-(--arrondi-grand) shadow-md">
      
      {/* Section IMAGE de la bouteille */}
      <div className="
      flex items-center justify-center bg-fond-secondaire 
      rounded-(--arrondi-grand) mb-(--rythme-tres-serre)">
        <img src={bouteille.image || '/placeholder-bottle.png'} alt={bouteille.nom} className="h-40 w-auto object-contain" 
        />
      </div>

      {/* Section INFORMATIONS de la bouteille */}
      <div className="flex-1 mb-4">
        {/* Nom de la bouteille */}
        <h2 className="mb-2 text-(length:--taille-normal) font-bold text-texte-secondaire">
          {bouteille.nom}
        </h2>
        
        {/* Type ou couleur du vin */}
        <p className="text-(length:--taille-petit) text-texte-secondaire">
          {bouteille.type || bouteille.couleur}
        </p>
      </div>

      {/* Section (boutons) - généré selon le type */}
      <div className="flex justify-between items-center justify-center gap-3">
        {genererControles()}
      </div>
    </div>
  );
};

export default CarteBouteille;