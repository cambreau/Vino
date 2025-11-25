import { Link } from "react-router-dom";

function CarteCellier({ titre, idCellier }) {
  return (
    <Link
      className="
        block
        aspect-square
        p-(--rythme-base)
        rounded-(--arrondi-grand)
        border-2
        border-[var(--color-principal-200)]
        bg-[var(--color-fond-secondaire)]
        text-[var(--color-texte-premier)]
        shadow-md
        hover:bg-[var(--color-principal-200)]
        hover:text-[var(--color-principal-100)]
        transition-colors
        duration-300
        flex
        items-center
        justify-center
        text-center
      "
      to={`/cellier?${idCellier}`}
    >
      {titre}
    </Link>
  );
}

export default CarteCellier;
