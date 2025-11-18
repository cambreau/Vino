import { FiArrowLeft } from "react-icons/fi";

function BoutonRetour({ action }) {
  return (
    <button
      type="button"
      className="
        flex items-center justify-center
        w-12 h-12
        bg-(--couleur-fond-secondaire)
        rounded-full
        shadow-md
        hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer
      "
      onClick={action}
    >
      <FiArrowLeft size={24} couleur="var(--couleur-texte-premier)" />
    </button>
  );
}

export default BoutonRetour;
