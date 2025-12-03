import Bouton from "@components/components-partages/Boutons/Bouton";
import BoutonQuantite from "@components/components-partages/Boutons/BoutonQuantite";
import { formatDetailsBouteille } from "@lib/utils.js";

const CarteListeAchat = ({
  bouteille,
  onAjouterCellier = () => {},
  disabled = false,
}) => {

  const handleAugmenter = (e, idCellier) => {
    e.stopPropagation();
    e.preventDefault();
    onAjouterCellier(bouteille.id, idCellier);
  };

  const handleDiminuer = (e, idCellier, quantiteActuelle) => {
    e.stopPropagation();
    e.preventDefault();
    if (quantiteActuelle > 0) {
      onAjouterCellier(bouteille.id, idCellier, -1);
    }
  };

  return (
    <div className="flex flex-col bg-fond-secondaire rounded-(--arrondi-grand) shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Section superieure : Image + Info principale */}
      <div className="flex gap-(--rythme-base) p-(--rythme-base)">
        {/* Image */}
        <div className="flex-shrink-0">
          <img
            src={bouteille.image || "/placeholder-bottle.png"}
            alt={`Photo de la bouteille ${bouteille.nom}`}
            className="h-[160px] w-auto object-cover rounded-(--arrondi-moyen)"
          />
        </div>

        {/* Informations principales */}
        <div className="flex-1 flex flex-col gap-(--rythme-serre)">
          <h2 className="text-(length:--taille-normal) font-semibold 
          text-principal-300 line-clamp-2">
            {bouteille.nom}
          </h2>
          
          <div className="flex flex-col gap-1">
            <p className="text-(length:--taille-petit) text-texte-secondaire">
              <span className="font-medium">Couleur:</span>{" "}
              <span className="text-principal-300">{bouteille.type || bouteille.couleur}</span>
            </p>
            <p className="text-(length:--taille-petit) text-texte-secondaire line-clamp-2">
              {formatDetailsBouteille(bouteille.description)}
            </p>
          </div>
        </div>
      </div>

      {/* Separateur */}
      <hr className="border-principal-100" />

      {/* Section celliers */}
      <div className="p-(--rythme-base) bg-principal-200">
        <div className="flex items-center justify-between mb-(--rythme-serre)">
          <h3 className="text-(length:--taille-petit) font-semibold text-fond-secondaire">
            Dans vos celliers
          </h3>
        </div>
        
        {bouteille.celliers && bouteille.celliers.length > 0 ? (
          <div className="flex flex-col gap-2 mb-(--rythme-base)">
            {bouteille.celliers.map((cellier) => (
              <div 
                key={cellier.idCellier} 
                className="flex items-center justify-between p-(--rythme-serre)  bg-fond-secondaire rounded-(--arrondi-moyen) border border-principal-100"
              >
                <span className="text-(length:--taille-petit) font-medium text-principal-300">
                  {cellier.nomCellier}
                </span>
                
                {/* Controles de quantite */}
                <div className="flex items-center gap-2">
                  <BoutonQuantite
                    type="diminuer"
                    onClick={(e) => handleDiminuer(e, cellier.idCellier, cellier.quantite)}
                    disabled={disabled || cellier.quantite <= 0}
                  />
                  
                  <span className="flex items-center justify-center min-w-8 px-2 text-texte-principal font-bold text-(length:--taille-normal)">
                    {cellier.quantite || 0}
                  </span>
                  
                  <BoutonQuantite
                    type="augmenter"
                    onClick={(e) => handleAugmenter(e, cellier.idCellier)}
                    disabled={disabled}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-(length:--taille-petit) text-texte-secondaire italic mb-(--rythme-base)">
            Cette bouteille n'est dans aucun cellier
          </p>
        )}

        {/* Bouton Supprimer */}
        <Bouton
          texte="Retirer de ma liste"
          type="secondaire"
          typeHtml="button"
          disabled={disabled}
          className="w-full text-(length:--taille-petit)"
        />
      </div>
    </div>
  );
};

export default CarteListeAchat;