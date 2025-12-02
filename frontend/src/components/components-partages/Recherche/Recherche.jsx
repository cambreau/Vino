import { useState, useId, useMemo } from "react";
import Bouton from "@components/components-partages/Boutons/Bouton";
import { rechercherBouteilles } from "@lib/utils";
import { FaSearch, FaChevronDown, FaFilter } from "react-icons/fa";
import { GiGrapes } from "react-icons/gi";
import { BiWorld } from "react-icons/bi";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { LuWine } from "react-icons/lu";

/**
 * Composant Recherche - Permet de rechercher des bouteilles par texte
 * Affiche un panneau déroulant avec des champs de saisie pour la recherche
 *
 * @param {Object} props - Les propriétés du composant
 * @param {Array} props.bouteilles - Liste des bouteilles à rechercher
 * @param {Object} props.valeursInitiales - Les valeurs initiales des champs de recherche
 * @param {Function} props.onRechercher - Callback appelé lors de la soumission de la recherche
 * @param {Function} props.onFiltrer - Callback pour basculer vers le mode filtres
 * @param {string} props.titreRecherche - Titre affiché dans l'en-tête
 * @param {string} props.texteBouton - Texte du bouton de soumission
 * @param {string} props.className - Classes CSS additionnelles
 */
function Recherche({
	bouteilles = [],
	valeursInitiales = {},
	onRechercher,
	onFiltrer,
	titreRecherche = "Rechercher",
	texteBouton = "Rechercher",
	className = "",
}) {
	const [estOuvert, setEstOuvert] = useState(true);
	const [criteres, setCriteres] = useState(() => ({
		nom: "",
		type: "",
		pays: "",
		annee: "",
		...valeursInitiales,
	}));
	const formulaireId = useId();

	// Calculer les résultats de recherche en temps réel
	const resultats = useMemo(() => {
		if (!bouteilles.length) return [];
		return rechercherBouteilles(bouteilles, criteres);
	}, [bouteilles, criteres]);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setCriteres((precedent) => ({ ...precedent, [name]: value }));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		onRechercher?.(criteres);
	};

	const handleReinitialiser = () => {
		setCriteres({
			nom: "",
			type: "",
			pays: "",
			annee: "",
		});
	};

	const champsRecherche = [
		{
			id: "nom",
			label: "Nom de la bouteille",
			icone: <LuWine className="text-principal-200" />,
			placeholder: "Ex: Château Margaux",
			type: "text",
		},
		{
			id: "type",
			label: "Type de vin",
			icone: <GiGrapes className="text-principal-200" />,
			placeholder: "Ex: Rouge, Blanc, Rosé",
			type: "text",
		},
		{
			id: "pays",
			label: "Pays d'origine",
			icone: <BiWorld className="text-principal-200" />,
			placeholder: "Ex: France, Italie",
			type: "text",
		},
		{
			id: "annee",
			label: "Année / Millésime",
			icone: <MdOutlineCalendarMonth className="text-principal-200" />,
			placeholder: "Ex: 2020",
			type: "number",
			min: "1900",
			max: "2100",
		},
	];

	const aDesCriteres = Object.values(criteres).some(
		(valeur) => valeur !== undefined && valeur !== null && valeur !== ""
	);

	return (
		<section
			className={`w-full max-w-[380px] bg-fond-secondaire border border-principal-100 rounded-(--arrondi-tres-grand) p-(--rythme-base) shadow-md flex flex-col gap-(--rythme-base) ${className}`}
			data-ouvert={estOuvert}>
			<header className="flex items-center justify-between text-(length:--taille-petit) font-semibold text-principal-200 uppercase">
				<button
					type="button"
					onClick={() => setEstOuvert((ouvertActuel) => !ouvertActuel)}
					className="flex flex-1 items-center justify-between gap-2 pr-4 text-left"
					aria-expanded={estOuvert}
					aria-controls={formulaireId}>
					<span className="flex items-center gap-2">
						<FaSearch />
						<span>{titreRecherche}</span>
					</span>
					<FaChevronDown
						className={`transition-transform duration-200 ${
							estOuvert ? "rotate-180" : ""
						}`}
					/>
				</button>
				<div className="h-6 w-px bg-principal-100" aria-hidden="true" />
				<button
					type="button"
					onClick={onFiltrer ?? undefined}
					disabled={!onFiltrer}
					className="flex items-center gap-2 px-4 text-principal-200 disabled:opacity-50 disabled:cursor-not-allowed"
					aria-label="Filtrer">
					<FaFilter />
				</button>
			</header>
			{estOuvert && (
				<form
					id={formulaireId}
					className="flex flex-col gap-(--rythme-base)"
					onSubmit={handleSubmit}>
					{champsRecherche.map((champ) => (
						<div key={champ.id} className="flex flex-col gap-(--rythme-tres-serre)">
							<label
								htmlFor={champ.id}
								className="flex items-center gap-2 text-(length:--taille-petit) text-texte-secondaire">
								{champ.icone}
								<span>{champ.label} :</span>
							</label>
							<input
								type={champ.type}
								id={champ.id}
								name={champ.id}
								value={criteres[champ.id]}
								onChange={handleChange}
								placeholder={champ.placeholder}
								min={champ.min}
								max={champ.max}
								className="w-full rounded-(--arrondi-grand) border border-principal-100 px-(--rythme-base) py-(--rythme-tres-serre) text-(length:--taille-normal) text-texte-secondaire placeholder:text-texte-tertiaire focus:outline-none focus:border-principal-200"
							/>
						</div>
					))}
					<div className="flex flex-col gap-(--rythme-tres-serre)">
						{aDesCriteres && (
							<button
								type="button"
								onClick={handleReinitialiser}
								className="text-(length:--taille-petit) text-principal-200 hover:text-principal-300 transition-colors underline self-start">
								Réinitialiser
							</button>
						)}
						<p className="text-(length:--taille-petit) text-texte-secondaire">
							{resultats.length} résultat{resultats.length > 1 ? "s" : ""} trouvé{resultats.length > 1 ? "s" : ""}
						</p>
						<Bouton texte={texteBouton} typeHtml="submit" taille="moyen" />
					</div>
				</form>
			)}
		</section>
	);
}

export default Recherche;
