function Bouton({
	texte,
	type = "primaire",
	taille = "", // Si, on ne met rien aucune taille donc grand, Taille 'moyen' = 320px
	action,
	typeHtml = "button",
	disabled = false,
	icone = null,
	variante = "normal" , // 'normal' ou 'icone' pour le bouton avec icône
	className = ""
}) {
	// Classes de base pour les boutons normaux
	const classesBase = `
    block text-center p-(--rythme-serre)
    font-semibold
    rounded-(--arrondi-grand) shadow-md
    hover:shadow-lg hover:-translate-y-0.5
    transition-all duration-300 cursor-pointer
  `;

	// Classes pour le bouton avec icône
	const classesIcone = `
	flex items-center gap-2
	p-2 rounded-full text-principal-200 
	border-1 border-(--color-principal-200) 
	shadow-md hover:bg-principal-200 hover:text-principal-100 
	transition-all cursor-pointer
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
    p-1 bg-principal-100
    text-texte-premier
    border border-principal-100
    hover:bg-(--color-fond)
    hover:text-principal-300
  `;

	// les classes selon le type
	const classesType =
		type === "secondaire" ? classesSecondaire : classesPrimaire;

	const classesFinales = variante === "icone" 
		? classesIcone 
		: `${classesBase} ${classesType} ${taille === "moyen" ? "max-w-[320px]" : ""}`;	

	const auClick = (e) => {
		if (!disabled && action) {
			action(e);
		}
	};

	return (
		<button
			type={typeHtml}
			className={`${classesFinales} ${className} ${
				disabled
					? "opacity-50 disabled:cursor-not-allowed disabled:hover:bg-fond disabled:hover:translate-y-0"
					: ""
			}`}
			onClick={auClick}
			disabled={disabled}
			aria-label={variante === "icone" && !texte ? "Ajouter à la liste" : undefined}
		>
			{variante === "icone" && icone}
			{texte && <span>{texte}</span>}
		</button>
	);
}

export default Bouton;
