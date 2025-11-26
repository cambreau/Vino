import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import Bouton from "../components-partages/Boutons/Bouton";

function CarteCellier({ titre, idCellier, onModifier, onSupprimer }) {
  return (
    <div
      className="
        aspect-square
        min-w-[150px]
        max-w-[300px]
        rounded-(--arrondi-grand)
        border-2
        border-[var(--color-principal-200)]
        bg-[var(--color-fond-secondaire)]
        shadow-md
        p-(--rythme-espace)
        content-center
        text-center
      "
    >
      <Link
        to={`/cellier/${idCellier}`}
        className="
          text-[var(--color-texte-premier)]
          text-(length:--taille-normal)
          font-bold
          text-center
          hover:text-[var(--color-principal-200)]
          hover:underline
          transition-colors
        "
      >
        {titre}
      </Link>
      <div className="flex flex-wrap gap-(--rythme-base) justify-center my-(--rythme-serre)">
        <Bouton
          texte={<FaEdit />}
          type="secondaire"
          typeHtml="button"
          action={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onModifier) onModifier(idCellier);
          }}
        />
        <Bouton
          texte={<FaTrash />}
          type="primaire"
          typeHtml="button"
          action={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onSupprimer) onSupprimer(idCellier);
          }}
        />
      </div>
    </div>
  );
}

export default CarteCellier;
