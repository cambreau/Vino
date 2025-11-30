import Formulaire from "@components/components-partages/Formulaire/Formulaire";
import FormulaireInput from "@components/components-partages/Formulaire/FormulaireInput/FormulaireInput";
import Bouton from "@components/components-partages/Boutons/Bouton";
import Message from "@components/components-partages/Message/Message";

import { validerConnexion } from "@lib/validationFormulaire.js";
import { connexionUtilisateur } from "@lib/requetes.js";

import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function ConnexionForm({
	titre = "Se connecter",
	messageWrapperClassName = "my-(--rythme-espace) mx-(--rythme-base)",
}) {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const inscriptionSucces = searchParams.get("inscriptionSucces") === "true";
	const deconnexionSucces = searchParams.get("deconnexionSucces") === "true";
	const supprimerSucces = searchParams.get("supprimerSucces") === "true";

	const [utilisateur, setUtilisateur] = useState({
		courriel: "",
		mot_de_passe: "",
	});

	const [messageErreurGeneral, setMessageErreurGeneral] = useState("");
	const [chargement, setChargement] = useState(false);

	const envoieConnexion = async (e) => {
		e.preventDefault();

		const erreur = validerConnexion(
			utilisateur.courriel,
			utilisateur.mot_de_passe,
		);

		if (erreur) {
			supprimerMessagesSucces();
			setMessageErreurGeneral(erreur);
			return;
		}

		setMessageErreurGeneral("");
		setChargement(true);

		const resultat = await connexionUtilisateur(utilisateur, navigate);

		setChargement(false);

		if (!resultat.succes) {
			supprimerMessagesSucces();
			setMessageErreurGeneral(resultat.erreur);
		}
	};

	const supprimerMessagesSucces = () => {
		if (deconnexionSucces || inscriptionSucces || supprimerSucces) {
			const nouveauxParams = new URLSearchParams(searchParams);
			nouveauxParams.delete("deconnexionSucces");
			nouveauxParams.delete("inscriptionSucces");
			nouveauxParams.delete("supprimerSucces");
			setSearchParams(nouveauxParams);
		}
	};

	const fermerMessage = () => {
		searchParams.delete("inscriptionSucces");
		searchParams.delete("deconnexionSucces");
		searchParams.delete("supprimerSucces");
		setSearchParams(searchParams);
	};

	return (
		<>
			<div className={messageWrapperClassName}>
				{inscriptionSucces && (
					<Message
						texte="Profil créé avec succès. Veuillez vous connecter pour continuer."
						type="succes"
						onClose={fermerMessage}
					/>
				)}
				{deconnexionSucces && (
					<Message
						texte="Vous avez bien été déconnecté!"
						type="succes"
						onClose={fermerMessage}
					/>
				)}
				{supprimerSucces && (
					<Message
						texte="Votre compte a bien été supprimé. !"
						type="succes"
						onClose={fermerMessage}
					/>
				)}
			</div>

			<Formulaire
				titreFormulaire={titre}
				method="POST"
				action={envoieConnexion}
				enfants={
					<>
						{messageErreurGeneral && (
							<div className="mt-4">
								<Message
									texte={messageErreurGeneral}
									type="erreur"
								/>
							</div>
						)}

						<FormulaireInput
							type="email"
							nom="courriel"
							genre="un"
							classCouleur="Clair"
							classCouleurLabel="Clair"
							estObligatoire={true}
							value={utilisateur.courriel}
							onChange={(e) => {
								const valeur = e.target.value;
								setUtilisateur((prev) => ({
									...prev,
									courriel: valeur,
								}));
								supprimerMessagesSucces();
								if (messageErreurGeneral) {
									setMessageErreurGeneral("");
								}
							}}
						/>

						<FormulaireInput
							type="password"
							nom="mot de passe"
							genre="un"
							classCouleur="Clair"
							classCouleurLabel="Clair"
							estObligatoire={true}
							value={utilisateur.mot_de_passe}
							onChange={(e) => {
								const valeur = e.target.value;
								setUtilisateur((prev) => ({
									...prev,
									mot_de_passe: valeur,
								}));
								supprimerMessagesSucces();
								if (messageErreurGeneral) {
									setMessageErreurGeneral("");
								}
							}}
						/>
					</>
				}
				bouton={
					<Bouton
						texte={
							chargement
								? "Connexion en cours..."
								: "Se connecter"
						}
						type="primaire"
						typeHtml="submit"
						action={envoieConnexion}
					/>
				}
			/>
		</>
	);
}

export default ConnexionForm;
