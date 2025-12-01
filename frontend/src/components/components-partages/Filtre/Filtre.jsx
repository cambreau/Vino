import { useEffect, useMemo, useState } from "react";
import Bouton from "@components/components-partages/Boutons/Bouton";
import {
	formatString,
	filtrerBouteilles as filtres,
} from "@lib/utils";
import { FaFilter, FaExchangeAlt, FaWarehouse} from "react-icons/fa";
import { GiGrapes } from "react-icons/gi";
import { BiWorld } from "react-icons/bi";
import { MdOutlineCalendarMonth } from "react-icons/md";

const extraireValeurs = (liste = [], cles = [], { numeric = false } = {}) => {
	const valeurs = new Set();
	liste.forEach((item) => {
		if (!item) return;
		for (const cle of cles) {
			const brut = item[cle];
			if (brut === undefined || brut === null) continue;
			const valeur = String(brut).trim();
			if (!valeur || valeur === "Millésime non disponible") continue;
			valeurs.add(valeur);
			break;
		}
	});
	const tableau = Array.from(valeurs);
	if (numeric) {
		return tableau
			.map((valeur) => Number(valeur))
			.filter(Number.isFinite)
			.sort((a, b) => b - a)
			.map((valeur) => valeur.toString());
	}
	return tableau.sort((a, b) =>
		a.localeCompare(b, "fr", { sensitivity: "base" }),
	);
};


function Filtres({
	bouteilles = [],
	valeursInitiales = {},
	onFiltrer,
	onTri,
	titreFiltrer = "Filtrer",
	titreTri = "Tri",
	texteBouton = "Chercher",
	className = "",
}) {
	const [criteres, setCriteres] = useState(() => ({
		type: "",
		pays: "",
		region: "",
		annee: "",
		...valeursInitiales,
	}));

	useEffect(() => {
		setCriteres((precedent) => ({ ...precedent, ...valeursInitiales }));
	}, [valeursInitiales]);

	const options = useMemo(
		() => ({
			types: extraireValeurs(bouteilles, ["type", "couleur"]),
			pays: extraireValeurs(bouteilles, ["pays", "country", "origine"]),
			regions: extraireValeurs(bouteilles, ["region", "appellation"]),
			annees: extraireValeurs(
				bouteilles,
				["annee", "millenisme", "vintage"],
				{ numeric: true },
			),
		}),
		[bouteilles],
	);

	const resultats = useMemo(() => {
		if (!bouteilles.length) return [];
		return filtres(bouteilles, {
			type: criteres.type,
			pays: criteres.pays,
			region: criteres.region,
			annee: criteres.annee,
		});
	}, [bouteilles, criteres.type, criteres.pays, criteres.region, criteres.annee]);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setCriteres((precedent) => ({ ...precedent, [name]: value }));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		onFiltrer?.(resultats, criteres);
	};

	const champSelects = [
		{
			id: "type",
			label: "Type",
			icone: <GiGrapes className="text-principal-200" />,
			options: options.types,
		},
		{
			id: "pays",
			label: "Pays",
			icone: <BiWorld className="text-principal-200" />,
			options: options.pays,
		},
		{
			id: "region",
			label: "Region",
			icone: <FaWarehouse className="text-principal-200" />,
			options: options.regions,
		},
	];

	return (
		<section
			className={`w-full max-w-[380px] bg-fond-secondaire border border-principal-100 rounded-(--arrondi-tres-grand) p-(--rythme-base) shadow-md flex flex-col gap-(--rythme-base) ${className}`}>
			<header className="flex items-center justify-between text-(length:--taille-petit) font-semibold text-principal-200 uppercase">
				<div className="flex items-center gap-2">
					<FaFilter />
					<span>{titreFiltrer}</span>
				</div>
				<div className="h-6 w-px bg-principal-100" aria-hidden="true" />
				<button
					type="button"
					onClick={onTri}
					className="flex items-center gap-2 text-principal-200">
					<FaExchangeAlt />
					<span>{titreTri}</span>
				</button>
			</header>
			<form className="flex flex-col gap-(--rythme-base)" onSubmit={handleSubmit}>
				{champSelects.map((champ) => (
					<div key={champ.id} className="flex flex-col gap-(--rythme-tres-serre)">
						<label
							htmlFor={champ.id}
							className="flex items-center gap-2 text-(length:--taille-petit) text-texte-secondaire">
								{champ.icone}
								<span>{champ.label} :</span>
							</label>
							<select
								id={champ.id}
								name={champ.id}
								value={criteres[champ.id]}
								onChange={handleChange}
								className="w-full rounded-(--arrondi-grand) border border-principal-100 px-(--rythme-base) py-(--rythme-tres-serre) text-(length:--taille-normal) text-texte-secondaire focus:outline-none focus:border-principal-200">
								<option value="">Choisissez</option>
								{champ.options.map((option) => (
									<option key={`${champ.id}-${formatString(option)}`} value={option}>
										{option}
									</option>
								))}
							</select>
						</div>
					))}
				<div className="flex flex-col gap-(--rythme-tres-serre)">
					<label
						htmlFor="annee"
						className="flex items-center gap-2 text-(length:--taille-petit) text-texte-secondaire">
							<MdOutlineCalendarMonth className="text-principal-200" />
							<span>Année :</span>
						</label>
					<input
						type="number"
						id="annee"
						name="annee"
						min="1900"
						max="2100"
						list="liste-annees"
						value={criteres.annee}
						onChange={handleChange}
						placeholder="Choisissez"
						className="w-full rounded-(--arrondi-grand) border border-principal-100 px-(--rythme-base) py-(--rythme-tres-serre) text-(length:--taille-normal) text-texte-secondaire focus:outline-none focus:border-principal-200"
					/>
					<datalist id="liste-annees">
						{options.annees.map((option) => (
							<option key={`annee-${option}`} value={option} />
						))}
					</datalist>
				</div>
				<div className="flex flex-col gap-(--rythme-tres-serre)">
					<p className="text-(length:--taille-petit) text-texte-secondaire">
						{resultats.length} résultat{resultats.length > 1 ? "s" : ""} trouvé{resultats.length > 1 ? "s" : ""}
					</p>
					<Bouton texte={texteBouton} typeHtml="submit" taille="moyen" />
				</div>
			</form>
		</section>
	);
}

export default Filtres;
