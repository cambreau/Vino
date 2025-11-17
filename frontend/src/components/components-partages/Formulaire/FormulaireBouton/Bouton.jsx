function Bouton({ 
  texte, 
  type = "primaire",
  action,
  typeHtml = "button"
}) {

  // Classes de base pour les boutons 
  const classesBase = `
    block w-full text-center px-8 py-3
    font-semibold
    rounded-[var(--arrondi-grand)] shadow-md
    hover:shadow-lg hover:-translate-y-0.5 
    transition-all duration-300 cursor-pointer
  `;

  // Classes selon le type
  const classesPrimaire = `
    bg-[var(--color-principal-200)] 
    text-[color:var(--color-fond)]
    border-1 border-[var(--color-principal-200)]
    hover:bg-[var(--color-principal-premier-plan)]
    hover:text-[var(--color-principal-300)]
  `;

  const classesSecondaire = `
    bg-[var(--color-principal-100)] 
    text-[var(--color-texte-premier)] 
    border border-[var(--color-principal-100)]
    hover:bg-[var(--color-principal-premier-plan)]
    hover:text-[var(--color-principal-300)]
  `;

  // les classes selon le type
  const classesType = type === "secondaire" ? classesSecondaire : classesPrimaire;

  return (
    <button 
      type={typeHtml}
      className={`${classesBase} ${classesType}`}
      onClick={action}
    >
      {texte}
    </button>
  );
}

export default Bouton;
