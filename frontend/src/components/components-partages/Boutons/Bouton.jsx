function Bouton({
	texte,
	type = "primaire",
	taille = "", // Si, on ne met rien aucune taille donc grand, Taille 'moyen' = 320px
	action,
	typeHtml = "button",
	disabled = false,
}) {
	// Classes de base pour les boutons
	const classesBase = `
    block text-center p-(--rythme-serre)
    font-semibold
    rounded-(--arrondi-grand) shadow-md
    hover:shadow-lg hover:-translate-y-0.5
    transition-all duration-300 cursor-pointer
  `;
	// Classes selon le type
	const classesPrimaire = `
    bg-principal-200
    text-fond
    border border-principal-200
    hover:bg-(--color-fond)
    hover:text-principal-300
  `;
	// Classes pour le bouton secondaire
	const classesSecondaire = `
    bg-principal-100
    text-texte-premier
    border border-principal-100
    hover:bg-(--color-fond)
    hover:text-principal-300
  `;

	// les classes selon le type
	const classesType =
		type === "secondaire" ? classesSecondaire : classesPrimaire;

	return (
		<button
			type={typeHtml}
			className={`${classesBase} ${classesType} ${
				taille === "moyen" ? "max-w-[320px]" : ""
			} 
        ${
			disabled
				? "opacity-50 disabled:cursor-not-allowed  disabled:hover:bg-fond disabled:hover:translate-y-0"
				: ""
		}`}
			onClick={!disabled ? action : undefined}
			disabled={disabled}>
			{texte}
		</button>
	);
}

export default Bouton;
