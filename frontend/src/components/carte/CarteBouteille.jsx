const CarteBouteille = ({ bouteille, contenu }) => {
  return (
    <div className="flex gap-3 items-center
    max-w-sm bg-fond-secondaire
    p-(--rythme-serre) 
    rounded-(--arrondi-grand) shadow-md">
      
      {/* Conteneur de l'image */}
      <div className="flex h-40 w-32 flex-shrink-0 items-center justify-center 
      bg-fond-secondaire 
      rounded-(--arrondi-grand)">
        <img 
          src={bouteille.image || '/placeholder-bottle.png'} 
          alt={bouteille.nom} 
          className="h-36 object-cover" 
        />
      </div>

      {/* Informations de la bouteille */}
      <div className="flex-1">
        <h2 className="mb-2 text-(length:--taille-normal) font-bold text-texte-secondaire">
          {bouteille.nom}
        </h2>
        <p className="text-(length:--taille-petit) text-texte-secondaire">
          {bouteille.type || bouteille.couleur}
        </p>
        {bouteille.prix && (
          <p className="mt-1 text-(length:--taille-petit) font-semibold text-texte-secondaire">
            {bouteille.prix} $
          </p>
        )}
      </div>

      {/* Zone des contrôles */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {contenu}
      </div>
    </div>
  );
};

export default CarteBouteille;