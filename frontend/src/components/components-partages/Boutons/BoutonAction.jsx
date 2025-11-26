function BoutonAction({
  texte = "Action",
  onClick,
  disabled = false,
  type = "primaire", // "primaire" ou "secondaire"
}) {
  // Classes de base
  const classesBase = `
    block text-center
    px-(--rythme-base) py-(--rythme-tres-serre)
    font-semibold text-principal-100
    rounded-(--arrondi-tres-grand) shadow-md
    hover:shadow-lg
    transition-all cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
  `;

  // Classes selon le type
  const classesPrimaire = "bg-principal-300 hover:bg-principal-200 ";
  const classesSecondaire =
    "bg-principal-100 hover:bg-principal-200 text-principal-200 hover:text-principal-100";

  const classesType =
    type === "secondaire" ? classesSecondaire : classesPrimaire;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${classesBase} ${classesType}`}
    >
      {texte}
    </button>
  );
}

export default BoutonAction;
