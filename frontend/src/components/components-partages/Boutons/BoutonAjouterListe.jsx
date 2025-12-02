import { GiNotebook } from "react-icons/gi";

/**
 * Composant bouton pour ajouter une bouteille à la liste d'achat
 */
function BoutonAjouterListe({ 
  onClick = () => {}, 
  disabled = false,
  size = 20 
}) {
  // Arrêter la propagation pour éviter de déclencher d'autres événements
  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onClick(e);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="
        p-2 rounded-full text-principal-200 
        border-1 border-(--color-principal-200) 
        shadow-md  hover:bg-principal-200 hover:text-principal-100 
        transition-all 
        cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
      "
      aria-label="Ajouter à la liste d'achat"
    >
      <GiNotebook size={size} />
    </button>
  );
}

export default BoutonAjouterListe;