import Icon from "@components/components-partages/Icon/Icon";

const CarteNoteDegustation = ({}) => {
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
            <h3 className="text-(length:--taille-normal) font-semibold text-principal-300">
              nom utilisateur
            </h3>
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
          <hr className="my-(--rythme-serre)" />
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
