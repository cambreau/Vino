import { useEffect, useCallback, useRef, useReducer, useMemo } from "react";
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
import { useDocumentTitle } from "@lib/utils.js";

/*
 * Constante: nombre d'éléments à charger par page lors de la pagination.
 */
const LIMITE_BOUTEILLES = 10;

/*
 * Crée l'état initial du catalogue. Propriété par propriété :
 *  - chargementInitial: indique si l'écran affiche un chargement initial.
 *  - scrollLoading: indique si un chargement lors du scroll est en cours.
 *  - bouteilles: liste des bouteilles chargées pour l'affichage.
 *  - celliers: liste des celliers de l'utilisateur.
 *  - cellierSelectionne: id du cellier sélectionné par défaut pour l'ajout.
 *  - page: numéro de page actuellement chargé (utilisé pour la pagination).
 *  - hasMore: indique si la ressource a d'autres pages disponibles.
 *  - message: objet contenant un message global à afficher (texte, type).
 *  - modale: état de la modale d'ajout (ouverte, bouteille, quantité, existe si déjà là).
 */
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

/*
 * Actions pour le reducer — utilisation pour manipuler l'état local du catalogue.
 */
const ACTIONS = {
	RESET: "reset",
	INIT_SUCCESS: "init_success",
	INIT_ERROR: "init_error",
	LOAD_MORE_START: "load_more_start",
	LOAD_MORE_SUCCESS: "load_more_success",
	LOAD_MORE_ERROR: "load_more_error",
	OPEN_MODAL: "open_modal",
	CLOSE_MODAL: "close_modal",
	MODALE_EXISTE: "modale_existe",
	MODIFIER_QUANTITE: "modifier_quantite",
	CHANGER_CELLIER: "changer_cellier",
	SET_MESSAGE: "set_message",
};

/*
 * Reducer central de la page Catalogue :
 * - Permet d'appliquer des mutations immuables à l'état en fonction d'actions.
 */
const catalogueReducer = (state, action) => {
	switch (action.type) {
		case ACTIONS.RESET:
			// Réinitialise tout l'état (comme si l'utilisateur venait d'ouvrir la page).
			return creerEtatInitial();
		case ACTIONS.INIT_SUCCESS:
			// Chargement initial réussi : on enregistre les bouteilles et les celliers reçus.
			return {
				...state,
				chargementInitial: false,
				scrollLoading: false,
				bouteilles: action.payload.bouteilles,
				celliers: action.payload.celliers,
				cellierSelectionne: action.payload.cellierSelectionne,
				page: 1,
				hasMore: action.payload.hasMore,
				message: action.payload.message ?? { texte: "", type: "" },
			};
		case ACTIONS.INIT_ERROR:
			// Échec du chargement initial : on affiche un message d'erreur.
			return {
				...state,
				chargementInitial: false,
				scrollLoading: false,
				message: action.payload,
			};
		case ACTIONS.LOAD_MORE_START:
			// Début d'un chargement additionnel (pagination par scroll)
			return { ...state, scrollLoading: true };
		case ACTIONS.LOAD_MORE_SUCCESS: {
			// Succès d'un chargement additionnel : on concatène les nouvelles bouteilles.
			const nouvelles = action.payload.bouteilles ?? [];
			if (!nouvelles.length) {
				return { ...state, scrollLoading: false, hasMore: false };
			}
			return {
				...state,
				bouteilles: [...state.bouteilles, ...nouvelles],
				page: action.payload.page,
				hasMore: action.payload.hasMore,
				scrollLoading: false,
			};
		}
		case ACTIONS.LOAD_MORE_ERROR:
			// Erreur lors du chargement additionnel : on stoppe l'indicateur.
			return {
				...state,
				scrollLoading: false,
				message: action.payload,
			};
		case ACTIONS.OPEN_MODAL:
			// Ouvre la modale et place la bouteille sélectionnée dans l'état local de la modale.
			return {
				...state,
				modale: {
					ouverte: true,
					bouteille: action.payload,
					quantite: 1,
					existe: false,
				},
			};
		case ACTIONS.CLOSE_MODAL:
			// Ferme la modale et réinitialise ses propriétés.
			return {
				...state,
				modale: {
					ouverte: false,
					bouteille: null,
					quantite: 1,
					existe: false,
				},
			};
		case ACTIONS.MODALE_EXISTE:
			// Indique qu'une bouteille existe déjà dans le cellier choisi (ex.: pour afficher la quantité actuelle).
			return {
				...state,
				modale: {
					...state.modale,
					existe: true,
					quantite: action.payload,
				},
			};
		case ACTIONS.MODIFIER_QUANTITE:
			// Met à jour la quantité voulue dans la modale.
			return {
				...state,
				modale: {
					...state.modale,
					quantite: action.payload,
				},
			};
		case ACTIONS.CHANGER_CELLIER:
			// Change le cellier ciblé dans la modale et réinitialise le marqueur d'existence
			return {
				...state,
				cellierSelectionne: action.payload,
				modale: {
					...state.modale,
					existe: false,
					quantite: 1,
				},
			};
		case ACTIONS.SET_MESSAGE:
			// Permet d'afficher un message global à l'utilisateur (succès / erreur / info).
			return { ...state, message: action.payload };
		default:
			return state;
	}
};

function Catalogue() {
	useDocumentTitle("Catalogue");
	const utilisateur = authentificationStore((state) => state.utilisateur);
	// Référence vers le conteneur scrollable principal (utilisé pour l'observer et le fallback).
	const mainRef = useRef(null);
	const sentinelRef = useRef(null);
	const scrollStateRef = useRef({ hasMore: true, scrollLoading: false });
	const [etat, dispatch] = useReducer(
		catalogueReducer,
		undefined,
		creerEtatInitial,
	);
	const etatRef = useRef(etat);
	// Référence de contrôle pour éviter les réponses asynchrones obsolètes lors des vérifications
	// (incrémentée à chaque requête pour s'assurer que la réponse correspond à la dernière requête).
	const verificationRef = useRef(0);

	// Effet principal: charge les bouteilles et les celliers de l'utilisateur au montage
	// et à chaque changement d'id d'utilisateur.
	useEffect(() => {
		etatRef.current = etat;
	}, [etat]);

	useEffect(() => {
		scrollStateRef.current = {
			hasMore: etat.hasMore,
			scrollLoading: etat.scrollLoading,
		};
	}, [etat.hasMore, etat.scrollLoading]);

	useEffect(() => {
		if (!utilisateur?.id) {
			dispatch({ type: ACTIONS.RESET });
			return;
		}

		let ignore = false;

		// Fonction asynchrone interne qui effectue toutes les requêtes initiales.
		const charger = async () => {
			dispatch({ type: ACTIONS.RESET });

			try {
				const [dataBouteilles, dataCelliers] = await Promise.all([
					recupererBouteilles(1, LIMITE_BOUTEILLES),
					recupererTousCellier(utilisateur.id),
				]);

				if (ignore) return;

				// `dataBouteilles` et `dataCelliers` proviennent des endpoints API :
				// - `donnees` contient la liste des éléments si le format de la réponse est normalisé.
				const bouteilles = dataBouteilles?.donnees ?? [];
				const celliers = dataCelliers?.donnees ?? dataCelliers ?? [];
				const hasMore = dataBouteilles?.meta?.hasMore ?? false;
				// Par défaut, on sélectionne le premier cellier disponible (si présent).
				const premierCellier =
					celliers.length > 0 ? String(celliers[0].id_cellier) : "";
				const message =
					celliers.length === 0
						? {
								texte: "Vous devez d'abord créer un cellier",
								type: "information",
						  }
						: { texte: "", type: "" };

				dispatch({
					type: ACTIONS.INIT_SUCCESS,
					payload: {
						bouteilles,
						celliers,
						cellierSelectionne: premierCellier,
						hasMore,
						message,
					},
				});
			} catch (error) {
				console.error(error);
				if (ignore) return;

				dispatch({
					type: ACTIONS.INIT_ERROR,
					payload: {
						texte: "Erreur lors du chargement",
						type: "erreur",
					},
				});
			}
		};

		// Lance le chargement initial de la page.
		charger();
		return () => {
			ignore = true;
		};
	}, [utilisateur?.id]);

	// Paginer — charger la page suivante de bouteilles.
	// Appelée par l'IntersectionObserver ou par le fallback du scroll.
	const chargerPlus = useCallback(async () => {
		const { scrollLoading, hasMore, page } = etatRef.current;
		if (scrollLoading || !hasMore) return;

		dispatch({ type: ACTIONS.LOAD_MORE_START });
		scrollStateRef.current = { hasMore, scrollLoading: true };
		const pageToLoad = page + 1;

		try {
			const res = await recupererBouteilles(
				pageToLoad,
				LIMITE_BOUTEILLES,
			);
			const nouvelles = Array.isArray(res?.donnees) ? res.donnees : [];
			const metaHasMore = res?.meta?.hasMore;
			const aEncoreDesPages =
				typeof metaHasMore === "boolean"
					? metaHasMore
					: nouvelles.length === LIMITE_BOUTEILLES;

			scrollStateRef.current = {
				hasMore: nouvelles.length ? aEncoreDesPages : false,
				scrollLoading: false,
			};

			dispatch({
				type: ACTIONS.LOAD_MORE_SUCCESS,
				payload: {
					bouteilles: nouvelles,
					page: pageToLoad,
					hasMore: aEncoreDesPages,
				},
			});
		} catch (error) {
			console.error(error);
			scrollStateRef.current = {
				hasMore: scrollStateRef.current.hasMore,
				scrollLoading: false,
			};
			dispatch({
				type: ACTIONS.LOAD_MORE_ERROR,
				payload: {
					texte: "Erreur lors du chargement de nouvelles bouteilles",
					type: "erreur",
				},
			});
		}
	}, []);

	// Fallback pour les environnements où l'IntersectionObserver manque le sentinel
	const verifierScrollEtCharger = useCallback(() => {
		const node = mainRef.current;
		if (!node) return;

		const { scrollTop, clientHeight, scrollHeight } = node;
		const distanceRestante = scrollHeight - (scrollTop + clientHeight);
		const { hasMore, scrollLoading } = scrollStateRef.current;
		if (distanceRestante <= 200 && hasMore && !scrollLoading) {
			chargerPlus();
		}
	}, [chargerPlus]);

	// Effet de mise en place d'un IntersectionObserver pour détecter quand le sentinel
	// (élément placé en bas de la liste) devient visible, déclenchant alors le chargement
	// additionnel (pagination).
	useEffect(() => {
		if (etat.chargementInitial) return;

		const root = mainRef.current;
		const sentinel = sentinelRef.current;
		if (!root || !sentinel) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (!entry?.isIntersecting) return;

				const { hasMore, scrollLoading } = scrollStateRef.current;
				if (!hasMore || scrollLoading) return;

				chargerPlus();
			},
			{ root, rootMargin: "0px 0px 200px 0px", threshold: 0.1 },
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [chargerPlus, etat.bouteilles.length, etat.chargementInitial]);

	// Effet qui installe le fallback du scroll sur le conteneur principal pour
	// déclencher `verifierScrollEtCharger` quand l'utilisateur scroll.
	useEffect(() => {
		if (etat.chargementInitial) return;

		const node = mainRef.current;
		if (!node) return;

		node.addEventListener("scroll", verifierScrollEtCharger, {
			passive: true,
		});
		verifierScrollEtCharger();
		return () => {
			node.removeEventListener("scroll", verifierScrollEtCharger);
		};
	}, [verifierScrollEtCharger, etat.chargementInitial]);

	// Ouvre la modale d'ajout d'une bouteille pour permettre la sélection du cellier
	// et l'ajout d'une quantité. Vérifie si la bouteille existe déjà dans le cellier.
	const ouvrirModale = useCallback(
		(bouteille) => {
			dispatch({ type: ACTIONS.OPEN_MODAL, payload: bouteille });

			if (!etat.cellierSelectionne) return;

			const verificationId = ++verificationRef.current;
			verifierBouteilleCellier(
				etat.cellierSelectionne,
				bouteille.id,
			).then((res) => {
				if (verificationRef.current !== verificationId) return;
				if (res?.existe) {
					dispatch({
						type: ACTIONS.MODALE_EXISTE,
						payload: res.quantite,
					});
				}
			});
		},
		[etat.cellierSelectionne],
	);

	// Ferme la modale et réinitialise les informations associées.
	const fermerModale = useCallback(() => {
		dispatch({ type: ACTIONS.CLOSE_MODAL });
	}, []);

	// Incrémente ou décrémente la quantité affichée dans la modale.
	const modifierQuantite = useCallback(
		(action) => {
			const quantiteActuelle = etat.modale.quantite;
			const nouvelleQuantite =
				action === "augmenter"
					? quantiteActuelle + 1
					: Math.max(1, quantiteActuelle - 1);
			dispatch({
				type: ACTIONS.MODIFIER_QUANTITE,
				payload: nouvelleQuantite,
			});
		},
		[etat.modale.quantite],
	);

	// Change le cellier sélectionné dans la modale et vérifie si la bouteille y existe.
	const changerCellier = useCallback(
		(idCellier) => {
			dispatch({ type: ACTIONS.CHANGER_CELLIER, payload: idCellier });

			if (!etat.modale.bouteille) return;

			const verificationId = ++verificationRef.current;
			verifierBouteilleCellier(idCellier, etat.modale.bouteille.id).then(
				(res) => {
					if (verificationRef.current !== verificationId) return;
					if (res?.existe) {
						dispatch({
							type: ACTIONS.MODALE_EXISTE,
							payload: res.quantite,
						});
					}
				},
			);
		},
		[etat.modale.bouteille],
	);

	// Effectue l'appel API pour ajouter la bouteille au cellier sélectionné.
	// Met à jour le message global et ferme la modale en cas de succès.
	const confirmerAjout = useCallback(async () => {
		const cellierSelectionne = etat.cellierSelectionne;
		const bouteilleCourante = etat.modale.bouteille;
		const quantiteCourante = etat.modale.quantite;

		if (!cellierSelectionne || !bouteilleCourante) {
			dispatch({
				type: ACTIONS.SET_MESSAGE,
				payload: {
					texte: "Veuillez sélectionner un cellier",
					type: "erreur",
				},
			});
			return;
		}

		try {
			const donnees = {
				id_bouteille: bouteilleCourante.id,
				quantite: quantiteCourante,
			};

			// Appel au service qui ajoute la bouteille dans le cellier ciblé.
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

				dispatch({
					type: ACTIONS.SET_MESSAGE,
					payload: {
						// Message succès affiché à l'utilisateur.
						texte: `${bouteilleCourante.nom} a été ajouté au cellier ${cellier}`,
						type: "succes",
					},
				});

				fermerModale();
			} else {
				dispatch({
					type: ACTIONS.SET_MESSAGE,
					payload: {
						texte: "Erreur lors de l'ajout",
						type: "erreur",
					},
				});
			}
		} catch (error) {
			console.error(error);
			dispatch({
				type: ACTIONS.SET_MESSAGE,
				payload: { texte: "Erreur lors de l'ajout", type: "erreur" },
			});
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

	const optionsCelliers = useMemo(
		() => celliers.map((c) => c.nom),
		[celliers],
	);
	const cellierCourant = useMemo(
		() =>
			celliers.find((c) => String(c.id_cellier) === cellierSelectionne) ??
			null,
		[celliers, cellierSelectionne],
	);

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

						<div
							ref={sentinelRef}
							className="h-1 w-full"
							aria-hidden="true"
						/>
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
									arrayOptions={optionsCelliers}
									value={cellierCourant?.nom || ""}
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
