import { FiArrowLeft } from 'react-icons/fi';

function BoutonRetour({ action }) {
  return (
    <button 
      type="button"
      className="
        flex items-center justify-center
        w-12 h-12
        bg-[var(--color-fond-secondaire)]
        rounded-full
        shadow-md
        hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer
      "
      onClick={action}
    >
    <FiArrowLeft 
        size={24} 
        color="var(--color-texte-premier)"
    />
    </button>
  );
}

export default BoutonRetour;