import { useState, useEffect, useCallback, useRef } from "react";
import MenuEnHaut from "@components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "@components/components-partages/MenuEnBas/MenuEnBas";
import CarteBouteille from "@components/carte/CarteBouteille";
import Message from "@components/components-partages/Message/Message";
import BoiteModale from "@components/components-partages/BoiteModale/BoiteModale";

import Bouton from "@components/components-partages/Boutons/Bouton";
import BoutonQuantite from "@components/components-partages/Boutons/BoutonQuantite";
import FormulaireSelect from "@components/components-partages/Formulaire/FormulaireSelect/FormulaireSelect";
import Spinner from "@components/components-partages/Spinner/Spinner";

import {
	recupererBouteilles,
	ajouterBouteilleCellier,
	recupererTousCellier,
	verifierBouteilleCellier,
} from "@lib/requetes";

import authentificationStore from "@store/authentificationStore";

const LIMITE_BOUTEILLES = 10;

const creerEtatInitial = () => ({
	chargementInitial: true,
	scrollLoading: false,
	bouteilles: [],
	celliers: [],
	cellierSelectionne: "",
	page: 1,
	hasMore: true,
	message: { texte: "", type: "" },
	modale: {
		ouverte: false,
		bouteille: null,
		quantite: 1,
		existe: false,
	},
});

function Catalogue() {
	const utilisateur = authentificationStore((state) => state.utilisateur);
	const mainRef = useRef(null);
	const scrollStateRef = useRef({ hasMore: true, scrollLoading: false });
	const [etat, setEtat] = useState(() => creerEtatInitial());

	useEffect(() => {
		scrollStateRef.current = {
			hasMore: etat.hasMore,
			scrollLoading: etat.scrollLoading,
		};
	}, [etat.hasMore, etat.scrollLoading]);

	useEffect(() => {
		if (!utilisateur?.id) {
			setEtat(() => creerEtatInitial());
			return;
		}

		let ignore = false;

		const charger = async () => {
			setEtat((prev) => ({
				...creerEtatInitial(),
				message: { texte: "", type: "" },
			}));

			try {
				const [dataBouteilles, dataCelliers] = await Promise.all([
					recupererBouteilles(1, LIMITE_BOUTEILLES),
					recupererTousCellier(utilisateur.id),
				]);

				if (ignore) return;

				const bouteilles = dataBouteilles?.donnees ?? [];
				const celliers = dataCelliers?.donnees ?? dataCelliers ?? [];
				const hasMore = dataBouteilles?.meta?.hasMore ?? false;
				const premierCellier =
					celliers.length > 0 ? String(celliers[0].id_cellier) : "";

				setEtat((prev) => ({
					...prev,
					chargementInitial: false,
					scrollLoading: false,
					bouteilles,
					celliers,
					cellierSelectionne: premierCellier,
					page: 1,
					hasMore,
					message:
						celliers.length === 0
							? {
									texte: "Vous devez d'abord créer un cellier",
									type: "information",
							  }
							: { texte: "", type: "" },
				}));
			} catch (error) {
				console.error(error);
				if (ignore) return;

				setEtat((prev) => ({
					...prev,
					chargementInitial: false,
					scrollLoading: false,
					message: {
						texte: "Erreur lors du chargement",
						type: "erreur",
					},
				}));
			}
		};

		charger();
		return () => {
			ignore = true;
		};
	}, [utilisateur?.id]);

	const chargerPlus = useCallback(async () => {
		let pageToLoad = 0;

		setEtat((prev) => {
			if (prev.scrollLoading || !prev.hasMore) {
				return prev;
			}

			pageToLoad = prev.page + 1;
			return { ...prev, scrollLoading: true };
		});

		if (!pageToLoad) return;

		try {
			const res = await recupererBouteilles(
				pageToLoad,
				LIMITE_BOUTEILLES,
			);
			setEtat((prev) => {
				const nouvelles = Array.isArray(res?.donnees)
					? res.donnees
					: [];
				const metaHasMore = res?.meta?.hasMore;
				const aEncoreDesPages =
					typeof metaHasMore === "boolean"
						? metaHasMore
						: nouvelles.length === LIMITE_BOUTEILLES;

				if (!nouvelles.length) {
					return {
						...prev,
						hasMore: false,
						scrollLoading: false,
					};
				}

				return {
					...prev,
					bouteilles: [...prev.bouteilles, ...nouvelles],
					page: pageToLoad,
					hasMore: aEncoreDesPages,
					scrollLoading: false,
				};
			});
		} catch (error) {
			console.error(error);
			setEtat((prev) => ({
				...prev,
				scrollLoading: false,
				message: {
					texte: "Erreur lors du chargement de nouvelles bouteilles",
					type: "erreur",
				},
			}));
		}
	}, []);

	useEffect(() => {
		const element = mainRef.current;
		if (!element) return;

		const onScroll = () => {
			const { hasMore, scrollLoading } = scrollStateRef.current;
			if (!hasMore || scrollLoading) return;

			const nearBottom =
				element.scrollTop + element.clientHeight >=
				element.scrollHeight - 200;

			if (nearBottom) {
				chargerPlus();
			}
		};

		element.addEventListener("scroll", onScroll);
		return () => element.removeEventListener("scroll", onScroll);
	}, [chargerPlus]);

	const ouvrirModale = useCallback(
		(bouteille) => {
			setEtat((prev) => ({
				...prev,
				modale: {
					ouverte: true,
					bouteille,
					quantite: 1,
					existe: false,
				},
			}));

			if (!etat.cellierSelectionne) return;

			verifierBouteilleCellier(
				etat.cellierSelectionne,
				bouteille.id,
			).then((res) => {
				if (res?.existe) {
					setEtat((prev) => ({
						...prev,
						modale: {
							...prev.modale,
							existe: true,
							quantite: res.quantite,
						},
					}));
				}
			});
		},
		[etat.cellierSelectionne],
	);

	const fermerModale = useCallback(() => {
		setEtat((prev) => ({
			...prev,
			modale: {
				ouverte: false,
				bouteille: null,
				quantite: 1,
				existe: false,
			},
		}));
	}, []);

	const modifierQuantite = useCallback((action) => {
		setEtat((prev) => ({
			...prev,
			modale: {
				...prev.modale,
				quantite:
					action === "augmenter"
						? prev.modale.quantite + 1
						: Math.max(1, prev.modale.quantite - 1),
			},
		}));
	}, []);

	const changerCellier = useCallback(
		(idCellier) => {
			setEtat((prev) => ({
				...prev,
				cellierSelectionne: idCellier,
				modale: { ...prev.modale, existe: false, quantite: 1 },
			}));

			if (!etat.modale.bouteille) return;

			verifierBouteilleCellier(idCellier, etat.modale.bouteille.id).then(
				(res) => {
					if (res?.existe) {
						setEtat((prev) => ({
							...prev,
							modale: {
								...prev.modale,
								existe: true,
								quantite: res.quantite,
							},
						}));
					}
				},
			);
		},
		[etat.modale.bouteille],
	);

	const confirmerAjout = useCallback(async () => {
		const cellierSelectionne = etat.cellierSelectionne;
		const bouteilleCourante = etat.modale.bouteille;
		const quantiteCourante = etat.modale.quantite;

		if (!cellierSelectionne || !bouteilleCourante) {
			setEtat((prev) => ({
				...prev,
				message: {
					texte: "Veuillez sélectionner un cellier",
					type: "erreur",
				},
			}));
			return;
		}

		try {
			const donnees = {
				id_bouteille: bouteilleCourante.id,
				quantite: quantiteCourante,
			};

			const resultat = await ajouterBouteilleCellier(
				cellierSelectionne,
				donnees,
			);

			if (resultat?.succes) {
				const cellier =
					etat.celliers.find(
						(c) =>
							String(c.id_cellier) === String(cellierSelectionne),
					)?.nom ?? "";

				setEtat((prev) => ({
					...prev,
					message: {
						texte: `${bouteilleCourante.nom} a été ajouté au cellier ${cellier}`,
						type: "succes",
					},
				}));

				fermerModale();
			} else {
				setEtat((prev) => ({
					...prev,
					message: {
						texte: "Erreur lors de l'ajout",
						type: "erreur",
					},
				}));
			}
		} catch (error) {
			console.error(error);
			setEtat((prev) => ({
				...prev,
				message: { texte: "Erreur lors de l'ajout", type: "erreur" },
			}));
		}
	}, [etat.cellierSelectionne, etat.celliers, etat.modale, fermerModale]);

	const {
		chargementInitial,
		bouteilles,
		message,
		modale,
		celliers,
		cellierSelectionne,
		scrollLoading,
	} = etat;

	if (!utilisateur?.id) {
		return (
			<div className="h-screen font-body grid grid-rows-[auto_1fr_auto] overflow-hidden">
				<header>
					<MenuEnHaut />
				</header>
				<main
					ref={mainRef}
					className="bg-fond overflow-y-auto">
					<section className="pt-(--rythme-espace) px-(--rythme-serre)">
						<Message
							texte="Vous devez être connecté pour accéder au catalogue"
							type="erreur"
						/>
					</section>
				</main>
				<MenuEnBas />
			</div>
		);
	}

	return (
		<>
			<div className="h-screen font-body grid grid-rows-[auto_1fr_auto] overflow-hidden">
				<header>
					<MenuEnHaut />
				</header>

				<main
					ref={mainRef}
					className="bg-fond overflow-y-auto">
					<section className="pt-(--rythme-espace) px-(--rythme-serre)">
						{message.texte && (
							<Message
								texte={message.texte}
								type={message.type}
							/>
						)}

						{chargementInitial ? (
							<div className="flex justify-center items-center py-(--rythme-espace)">
								<Spinner
									size={220}
									ariaLabel="Chargement du catalogue de bouteilles"
								/>
							</div>
						) : bouteilles.length > 0 ? (
							<>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
									{bouteilles.map((b) => (
										<CarteBouteille
											key={b.id}
											bouteille={b}
											type="catalogue"
											onAjouter={ouvrirModale}
										/>
									))}
								</div>
								{scrollLoading && (
									<div className="flex justify-center py-(--rythme-base)">
										<Spinner
											size={140}
											ariaLabel="Chargement de nouvelles bouteilles"
										/>
									</div>
								)}
							</>
						) : (
							<Message
								texte="Aucune bouteille disponible"
								type="information"
							/>
						)}
					</section>
				</main>

				<MenuEnBas />
			</div>

			{modale.ouverte && modale.bouteille && (
				<BoiteModale
					texte="Confirmation d'ajout"
					contenu={
						<div className="w-full">
							<p className="text-texte-principal font-bold text-center mb-(--rythme-base)">
								{modale.bouteille.nom}
							</p>

							<div className="mb-(--rythme-base)">
								<FormulaireSelect
									nom="Cellier"
									genre="un"
									estObligatoire={true}
									arrayOptions={celliers.map((c) => c.nom)}
									value={
										celliers.find(
											(c) =>
												String(c.id_cellier) ===
												cellierSelectionne,
										)?.nom || ""
									}
									onChange={(e) => {
										const cellierCible = celliers.find(
											(x) => x.nom === e.target.value,
										);
										if (cellierCible) {
											changerCellier(
												String(cellierCible.id_cellier),
											);
										}
									}}
									classCouleur="Clair"
									fullWidth={true}
								/>
							</div>

							{modale.existe ? (
								<Message
									texte={`Cette bouteille est déjà dans ce cellier (quantité : ${modale.quantite})`}
									type="information"
								/>
							) : (
								<div className="flex items-center justify-center gap-(--rythme-serre)">
									<span className="text-texte-secondaire">
										Quantité :
									</span>

									<BoutonQuantite
										type="diminuer"
										onClick={() =>
											modifierQuantite("diminuer")
										}
										disabled={modale.quantite <= 1}
									/>

									<span className="min-w-8 px-2 text-texte-principal font-bold">
										{modale.quantite}
									</span>

									<BoutonQuantite
										type="augmenter"
										onClick={() =>
											modifierQuantite("augmenter")
										}
									/>
								</div>
							)}
						</div>
					}
					bouton={
						<>
							<Bouton
								texte="Ajouter"
								type="primaire"
								typeHtml="button"
								action={confirmerAjout}
								disabled={modale.existe}
							/>
							<Bouton
								texte="Annuler"
								type="secondaire"
								typeHtml="button"
								action={fermerModale}
							/>
						</>
					}
				/>
			)}
		</>
	);
}

export default Catalogue;
