import { useCallback, useEffect, useId, useMemo, useState } from "react";
import Bouton from "@components/components-partages/Boutons/Bouton";
import {
	formatString,
	filtrerBouteilles as filtrerLocal,
	normaliserTexte,
} from "@lib/utils";
import {
	IconFiltre,
	IconEchange,
	IconEntrepot,
	IconChevronBas,
	IconRecherche,
	IconFermerX,
	IconRaisins,
	IconMonde,
	IconCalendrier,
} from "@components/components-partages/Icon/SvgIcons";

const DEFAULT_OPTIONS = {
	types: [],
	pays: [],
	regions: [],
	annees: [],
	regionsParPays: {},
};

const sontOptionsEgales = (a = DEFAULT_OPTIONS, b = DEFAULT_OPTIONS) => {
	return (
		JSON.stringify(a.types ?? []) === JSON.stringify(b.types ?? []) &&
		JSON.stringify(a.pays ?? []) === JSON.stringify(b.pays ?? []) &&
		JSON.stringify(a.regions ?? []) === JSON.stringify(b.regions ?? []) &&
		JSON.stringify(a.annees ?? []) === JSON.stringify(b.annees ?? []) &&
		JSON.stringify(a.regionsParPays ?? {}) === JSON.stringify(b.regionsParPays ?? {})
	);
};

const extrairePremiereValeur = (item = {}, cles = []) => {
	for (const cle of cles) {
		const brut = item?.[cle];
		if (brut === undefined || brut === null) continue;
		const valeur = String(brut).trim();
		if (!valeur || valeur === "Millésime non disponible") continue;
		return valeur;
	}
	return "";
};

const extraireValeurs = (liste = [], cles = [], { numeric = false } = {}) => {
	const valeurs = new Set();
	liste.forEach((item) => {
		if (!item) return;
		const valeur = extrairePremiereValeur(item, cles);
		if (valeur) valeurs.add(valeur);
	});
	const tableau = Array.from(valeurs);
	if (numeric) {
		return tableau
			.map((valeur) => Number(valeur))
			.filter(Number.isFinite)
			.sort((a, b) => b - a)
			.map((valeur) => valeur.toString());
	}
	return tableau.sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));
};

const construireIndexRegionsParPays = (liste = []) => {
	const index = new Map();
	liste.forEach((item) => {
		const pays = extrairePremiereValeur(item, ["pays", "country", "origine"]);
		const region = extrairePremiereValeur(item, ["region", "appellation"]);
		if (!pays || !region) return;
		const clePays = normaliserTexte(pays);
		if (!clePays) return;
		const regions = index.get(clePays) ?? new Set();
		regions.add(region);
		index.set(clePays, regions);
	});
	const resultat = {};
	index.forEach((regions, cle) => {
		resultat[cle] = Array.from(regions).sort((a, b) =>
			a.localeCompare(b, "fr", { sensitivity: "base" }),
		);
	});
	return resultat;
};

const extraireOptionsDepuisBouteilles = (bouteilles = []) => {
	if (!bouteilles.length) return DEFAULT_OPTIONS;
	const types = extraireValeurs(bouteilles, ["type", "couleur"]);
	const pays = extraireValeurs(bouteilles, ["pays", "country", "origine"]);
	const regions = extraireValeurs(bouteilles, ["region", "appellation"]);
	const annees = extraireValeurs(
		bouteilles,
		["millenisme", "annee", "millesime", "vintage"],
		{ numeric: true },
	);
	const regionsParPays = construireIndexRegionsParPays(bouteilles);
	return { types, pays, regions, annees, regionsParPays };
};

function Filtres({
	bouteilles = [],
	optionsExternes = null,
	chargerOptions,
	filtresActuels = {},
	valeursInitiales = {},
	rechercheActuelle = "",
	onFiltrer,
	onTri,
	onRecherche,
	onSupprimerFiltre,
	onReinitialiserFiltres,
	titreFiltrer = "Filtrer",
	titreTri = "Tri",
	texteBouton = "Chercher",
	className = "",
}) {
	const valeursInitialesCombinees = useMemo(
		() => ({
			type: "",
			pays: "",
			region: "",
			annee: "",
			...valeursInitiales,
			...filtresActuels,
		}),
		[valeursInitiales, filtresActuels],
	);

	const [estOuvert, setEstOuvert] = useState(false);
	const [modeRecherche, setModeRecherche] = useState(Boolean(rechercheActuelle));
	const [criteres, setCriteres] = useState(valeursInitialesCombinees);
	const [texteRecherche, setTexteRecherche] = useState(rechercheActuelle ?? "");
	const [options, setOptions] = useState(() => {
		if (optionsExternes) return { ...DEFAULT_OPTIONS, ...optionsExternes };
		if (bouteilles.length) return extraireOptionsDepuisBouteilles(bouteilles);
		return DEFAULT_OPTIONS;
	});
	const [chargementOptions, setChargementOptions] = useState(false);
	const formulaireId = useId();

	const aDesFiltresActifs = useMemo(
		() => Object.values(criteres).some((v) => Boolean(v)) || Boolean(texteRecherche),
		[criteres, texteRecherche],
	);

	const resultats = useMemo(() => {
		if (!bouteilles.length) return [];
		return filtrerLocal(bouteilles, {
			type: criteres.type,
			pays: criteres.pays,
			region: criteres.region,
			annee: criteres.annee,
		});
	}, [bouteilles, criteres.type, criteres.pays, criteres.region, criteres.annee]);

	const regionsDisponibles = useMemo(() => {
		if (criteres.pays && options.regionsParPays) {
			return options.regionsParPays[normaliserTexte(criteres.pays)] ?? options.regions;
		}
		return options.regions;
	}, [criteres.pays, options.regionsParPays, options.regions]);

	useEffect(() => {
		setTexteRecherche(rechercheActuelle ?? "");
		setModeRecherche(Boolean(rechercheActuelle));
	}, [rechercheActuelle]);

	useEffect(() => {
		if (optionsExternes) {
			setOptions((courant) => {
				const prochain = { ...DEFAULT_OPTIONS, ...optionsExternes };
				return sontOptionsEgales(courant, prochain) ? courant : prochain;
			});
			return;
		}
		if (bouteilles.length) {
			setOptions((courant) => {
				const prochain = extraireOptionsDepuisBouteilles(bouteilles);
				return sontOptionsEgales(courant, prochain) ? courant : prochain;
			});
		}
	}, [optionsExternes, bouteilles]);

	const chargerOptionsDistantes = useCallback(async () => {
		if (optionsExternes || bouteilles.length) return;
		setChargementOptions(true);
		try {
			const donnees = chargerOptions
				? await chargerOptions()
				: await fetch(
					`${import.meta.env.VITE_BACKEND_BOUTEILLES_URL}/options-filtres`,
				).then((r) => (r.ok ? r.json() : null));
			if (donnees) {
				setOptions((courant) => {
					const prochain = { ...DEFAULT_OPTIONS, ...donnees };
					return sontOptionsEgales(courant, prochain) ? courant : prochain;
				});
			}
		} catch (erreur) {
			console.error("Erreur lors du chargement des options:", erreur);
		} finally {
			setChargementOptions(false);
		}
	}, [optionsExternes, bouteilles.length, chargerOptions]);

	useEffect(() => {
		chargerOptionsDistantes();
	}, [chargerOptionsDistantes]);

	useEffect(() => {
		const aDesValeurs = Object.values(valeursInitialesCombinees).some(
			(valeur) => valeur !== undefined && valeur !== null && valeur !== "",
		);
		if (aDesValeurs || rechercheActuelle) {
			setEstOuvert(true);
		}
	}, [valeursInitialesCombinees, rechercheActuelle]);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setCriteres((precedent) => {
			const nouveauxCriteres = { ...precedent, [name]: value };
			if (name === "pays" && value !== precedent.pays) {
				nouveauxCriteres.region = "";
			}
			return nouveauxCriteres;
		});
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (modeRecherche) {
			onRecherche?.(texteRecherche, { nom: texteRecherche });
			return;
		}
		const resultatsSoumis = bouteilles.length ? resultats : null;
		onFiltrer?.(criteres, resultatsSoumis);
	};

	const handleSupprimerFiltre = (cle) => {
		setCriteres((precedent) => {
			const nouveauxCriteres = { ...precedent, [cle]: "" };
			if (cle === "pays") {
				nouveauxCriteres.region = "";
			}
			return nouveauxCriteres;
		});
		onSupprimerFiltre?.(cle);
	};

	const handleReinitialiser = () => {
		setCriteres(valeursInitialesCombinees);
		setTexteRecherche("");
		setModeRecherche(false);
		onReinitialiserFiltres?.();
	};

	const handleBasculerRecherche = () => {
		setModeRecherche(true);
	};

	const handleBasculerFiltres = () => {
		setModeRecherche(false);
		setTexteRecherche("");
	};

	const champSelects = [
		{
			id: "type",
			label: "Type",
			icone: <IconRaisins className="text-principal-200" />,
			options: options.types,
		},
		{
			id: "pays",
			label: "Pays",
			icone: <IconMonde className="text-principal-200" />,
			options: options.pays,
		},
		{
			id: "region",
			label: "Région",
			icone: <IconEntrepot className="text-principal-200" />,
			options: regionsDisponibles,
		},
	];

	if (modeRecherche) {
		return (
			<section
				className={`w-full max-w-[380px] bg-fond-secondaire border border-principal-100 rounded-(--arrondi-tres-grand) p-(--rythme-base) shadow-md flex flex-col gap-(--rythme-base) ${className}`}>
				<header className="flex items-center justify-between text-(length:--taille-petit) font-semibold text-principal-200 uppercase">
					<span className="flex items-center gap-2">
						<IconRecherche />
						<span>Recherche</span>
					</span>
					<button
						type="button"
						onClick={handleBasculerFiltres}
						className="flex items-center gap-2 px-4 text-principal-200 hover:text-principal-300 transition-colors"
						aria-label="Retour aux filtres">
						<IconFiltre />
					</button>
				</header>

				<form onSubmit={handleSubmit} className="flex flex-col gap-(--rythme-base)">
					<div className="relative">
						<input
							type="text"
							value={texteRecherche}
							onChange={(e) => setTexteRecherche(e.target.value)}
							placeholder="Rechercher un vin..."
							className="w-full rounded-(--arrondi-grand) border border-principal-100 px-(--rythme-base) py-(--rythme-serre) pr-10 text-(length:--taille-normal) text-texte-secondaire focus:outline-none focus:border-principal-200"
						/>
						{texteRecherche && (
							<button
								type="button"
								onClick={() => setTexteRecherche("")}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-principal-200 hover:text-erreur"
								aria-label="Effacer la recherche">
								<IconFermerX />
							</button>
						)}
					</div>

					<div className="flex gap-(--rythme-serre)">
						<Bouton texte="Rechercher" typeHtml="submit" taille="moyen" />
						{aDesFiltresActifs && (
							<Bouton
								texte="Réinitialiser"
								typeHtml="button"
								taille="moyen"
								type="secondaire"
								action={handleReinitialiser}
							/>
						)}
					</div>
				</form>
			</section>
		);
	}

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
						<IconFiltre />
						<span>{titreFiltrer}</span>
					</span>
					<IconChevronBas
						className={`transition-transform duration-200 ${
							estOuvert ? "rotate-180" : ""
						}`}
					/>
				</button>
				<div className="h-6 w-px bg-principal-100" aria-hidden="true" />
				<button
					type="button"
					onClick={handleBasculerRecherche}
					className="flex items-center gap-2 px-4 text-principal-200 hover:text-principal-300 transition-colors"
					aria-label="Rechercher">
					<IconRecherche />
				</button>
			</header>
			{estOuvert && (
				<form
					id={formulaireId}
					className="flex flex-col gap-(--rythme-base)"
					onSubmit={handleSubmit}>
					{onTri && (
						<button
							type="button"
							onClick={onTri}
							className="flex items-center gap-2 text-(length:--taille-petit) text-principal-200 hover:text-principal-300 transition-colors">
							<IconEchange />
							<span>{titreTri}</span>
						</button>
					)}

					{champSelects.map((champ) => (
						<div key={champ.id} className="flex flex-col gap-(--rythme-tres-serre)">
							<label
								htmlFor={champ.id}
								className="flex items-center gap-2 text-(length:--taille-petit) text-texte-secondaire">
								{champ.icone}
								<span>{champ.label} :</span>
							</label>
							<div className="relative">
								<select
									id={champ.id}
									name={champ.id}
									value={criteres[champ.id]}
									onChange={handleChange}
									disabled={chargementOptions}
									className="w-full rounded-(--arrondi-grand) border border-principal-100 px-(--rythme-base) py-(--rythme-tres-serre) pr-10 text-(length:--taille-normal) text-texte-secondaire focus:outline-none focus:border-principal-200 disabled:opacity-50">
									<option value="">
										{chargementOptions ? "Chargement..." : "Choisissez"}
									</option>
									{(champ.options ?? []).map((option) => (
										<option key={`${champ.id}-${formatString(option)}`} value={option}>
											{option}
										</option>
									))}
								</select>
								{criteres[champ.id] && (
									<button
										type="button"
										onClick={() => handleSupprimerFiltre(champ.id)}
										className="absolute right-8 top-1/2 -translate-y-1/2 p-1 text-principal-200 hover:text-erreur transition-colors"
										aria-label={`Supprimer le filtre ${champ.label}`}>
										<IconFermerX className="w-3 h-3" />
									</button>
								)}
							</div>
						</div>
					))}

					<div className="flex flex-col gap-(--rythme-tres-serre)">
						<label
							htmlFor="annee"
							className="flex items-center gap-2 text-(length:--taille-petit) text-texte-secondaire">
							<IconCalendrier className="text-principal-200" />
							<span>Année :</span>
						</label>
						<div className="relative">
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
								className="w-full rounded-(--arrondi-grand) border border-principal-100 px-(--rythme-base) py-(--rythme-tres-serre) pr-10 text-(length:--taille-normal) text-texte-secondaire focus:outline-none focus:border-principal-200"
							/>
							{criteres.annee && (
								<button
									type="button"
									onClick={() => handleSupprimerFiltre("annee")}
									className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-principal-200 hover:text-erreur transition-colors"
									aria-label="Supprimer le filtre année">
									<IconFermerX className="w-3 h-3" />
								</button>
							)}
						</div>
						<datalist id="liste-annees">
							{(options.annees ?? []).map((option) => (
								<option key={`annee-${option}`} value={option} />
							))}
						</datalist>
					</div>

					<div className="flex flex-col gap-(--rythme-tres-serre)">
						{bouteilles.length > 0 && (
							<p className="text-(length:--taille-petit) text-texte-secondaire">
								{resultats.length} résultat{resultats.length > 1 ? "s" : ""} trouvé{resultats.length > 1 ? "s" : ""}
							</p>
						)}
						<div className="flex gap-(--rythme-serre)">
							<Bouton texte={texteBouton} typeHtml="submit" taille="moyen" />
							{aDesFiltresActifs && (
								<Bouton
									texte="Réinitialiser"
									typeHtml="button"
									taille="moyen"
									type="secondaire"
									action={handleReinitialiser}
								/>
							)}
						</div>
					</div>
				</form>
			)}
		</section>
	);
}

export default Filtres;
