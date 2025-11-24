function BoutonQuantite({ 
  type = "augmenter", // "augmenter" ou "diminuer"
  onClick, 
  disabled = false 
}) {
  const symbole = type === "augmenter" ? "+" : "-";
  const label = type === "augmenter" ? "Augmenter la quantité" : "Diminuer la quantité";

 // Classes d’arrondi selon le type

 const coins = type === "augmenter"
    ? "rounded-tr-(--arrondi-tres-grand) rounded-br-(--arrondi-tres-grand)"
    : "rounded-tl-(--arrondi-tres-grand) rounded-bl-(--arrondi-tres-grand)";

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`
        flex items-center justify-center w-7 h-8
        text-(length:--normal) font-bold text-principal-100
        rounded-0 ${coins}
        bg-principal-200
        hover:bg-principal-300 hover:shadow-lg
        cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
      `}
    >
      {symbole}
    </button>
  );
}

export default BoutonQuantite;