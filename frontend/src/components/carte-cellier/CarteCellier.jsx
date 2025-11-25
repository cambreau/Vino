import { Link } from "react-router-dom";
import Bouton from "../components-partages/Boutons/Bouton";

function CarteCellier({ titre, idCellier, onModifier, onSupprimer }) {
  return (
    <div
      className="
        relative
        aspect-square
        rounded-(--arrondi-grand)
        border-2
        border-[var(--color-principal-200)]
        bg-[var(--color-fond-secondaire)]
        shadow-md
        p-(--rythme-serre)
        content-center
        text-center
      "
    >
      <Link
        to={`/cellier/${idCellier}`}
        className="
          text-[var(--color-texte-premier)]
          text-(length:--taille-moyen)
          font-bold
          text-center
          mb-(--rythme-serre)
          hover:text-[var(--color-principal-200)]
          hover:underline
          transition-colors
        "
      >
        {titre}
      </Link>
      <div className="flex gap-(--rythme-tres-serre) justify-center mt-(--rythme-serre)">
        <Bouton
          texte="Modifier"
          type="secondaire"
          typeHtml="button"
          action={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onModifier) onModifier(idCellier);
          }}
        />
        <Bouton
          texte="Supprimer"
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
