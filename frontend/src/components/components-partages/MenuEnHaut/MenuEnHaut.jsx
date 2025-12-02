import { useMemo, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Icon from "@components/components-partages/Icon/Icon";
import Bouton from "@components/components-partages/Boutons/Bouton";
import RasinLogo from "@assets/images/grape_logo.svg";
import authentificationStore from "@store/authentificationStore";

function MenuEnHaut({}) {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	// Récupérer les données du store
	const utilisateur = authentificationStore((state) => state.utilisateur);
	const estConnecte = authentificationStore((state) => state.estConnecte);

	const [estMenuOuvert, setestMenuOuvert] = useState(false);

	const liensMenu = useMemo(
		() => [
			{
				nom: "profil",
				to: "/profil",
				zonesActives: ["/profil", "/modifier-utilisateur"],
			},
			{
				nom: "catalogue",
				to: "/catalogue",
				zonesActives: ["/catalogue", "/bouteilles"],
			},
			{
				nom: "cellier",
				to: "/sommaire-cellier",
				zonesActives: ["/sommaire-cellier", "/cellier"],
			},
			{
				nom: "liste",
				to: "#",
				zonesActives: [],
			},
		],
		[],
	);

	const estActif = (zones = []) =>
		zones.some((segment) => pathname.startsWith(segment));

	/**
	 * Fonction pour gérer la déconnexion
	 */
	const gererDeconnexion = () => {
		authentificationStore.getState().deconnexion();
		navigate("/?deconnexionSucces=true");
	};

	return (
		<nav className="flex items-center justify-between p-(--rythme-base) bg-fond-secondaire">
			<div className="relative">
				{/* Bouton hamburger */}
				<button
					onClick={() => setestMenuOuvert(!estMenuOuvert)}
					aria-label={
						estMenuOuvert ? "Fermer le menu" : "Ouvrir le menu"
					}
					aria-expanded={estMenuOuvert}>
					<Icon
						nom="menuHamburger"
						typeMenu="haut"
						couleur="principal-300"
					/>
				</button>

				{/* Ombre */}
				{estMenuOuvert && (
					<div
						className="fixed inset-0 bg-black/50 backdrop-blur-[1px] transition-opacity duration-200"
						onClick={() => setestMenuOuvert(false)}
					/>
				)}

				{/* Menu déroulant */}
				{estMenuOuvert && (
					<div className="absolute z-10 -left-(--rythme-base) mt-(--rythme-tres-serre) p-(--rythme-base) h-screen min-w-[300px] bg-fond-secondaire shadow-xl rounded-r-(--arrondi-grand) flex flex-col gap-(--rythme-base) transition-transform duration-200">
						<div className="flex justify-between mb-(--rythme-espace)">
							<header>
								<h2 className="text-texte-premier text-(length:--taille-grand) font-display font-bold">
									{estConnecte && utilisateur
										? utilisateur.nom
										: ""}
								</h2>
								<small className="text-texte-premier text-(length:--taille-moyen) font-display">
									{estConnecte && utilisateur
										? utilisateur.courriel
										: "Courriel"}
								</small>
							</header>
							<button
								className="absolute right-(--rythme-base) top-(--rythme-serre)"
								onClick={() => setestMenuOuvert(!estMenuOuvert)}
								aria-label={
									estMenuOuvert
										? "Fermer le menu"
										: "Ouvrir le menu"
								}
								aria-expanded={estMenuOuvert}>
								<Icon
									nom="fermer"
									typeMenu="haut"
									couleur="principal-300"
								/>
							</button>
						</div>
						<div className="flex flex-col gap-(--rythme-base)">
							{liensMenu.map((lien) => {
								const actif = estActif(lien.zonesActives);
								const baseClasses =
									"flex items-center gap-(--rythme-base) rounded-r-full border-l-4 px-(--rythme-base) py-(--rythme-serre) transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-principal-200";
								const actifClasses =
									"border-principal-200 bg-principal-100/40 text-texte-premier";
								const inactifClasses =
									"border-transparent text-principal-300 hover:border-principal-100 hover:bg-principal-100/20";

								return (
									<Link
										key={lien.nom}
										to={lien.to}
										onClick={() => setestMenuOuvert(false)}
										className={`${baseClasses} ${
											actif
												? actifClasses
												: inactifClasses
										}`}
										aria-current={
											actif ? "page" : undefined
										}>
										<Icon
											nom={lien.nom}
											typeMenu="haut"
											couleur={
												actif
													? "principal-200"
													: "principal-300"
											}
										/>
									</Link>
								);
							})}
						</div>
					</div>
				)}
			</div>

			{/* Logo */}
			<Link
				to="/catalogue"
				className="flex items-center">
				<h2 className="text-principal-300 text-(length:--taille-grand) font-display">
					Vin
				</h2>
				<img
					src={RasinLogo}
					alt="Logo raisin"
					width="43"
					height="35"
				/>
			</Link>

			{/* Déconnexion */}
			{estConnecte && (
				<Bouton
					texte={
						<Icon
							nom="deconnection"
							typeMenu="haut"
							couleur="principal-300"
						/>
					}
					type="secondaire"
					typeHtml="button"
					action={gererDeconnexion}
				/>
			)}
		</nav>
	);
}

export default MenuEnHaut;
