export const regex = {
	regNom: /^[A-Za-zÀ-ÖØ-öø-ÿ\s-]{2,50}$/,
	regcourriel: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	//- au moins 8 caractères, au moins une lettre minuscule, au moins une lettre majuscule, au moins un caractère spécial (ex. !@#$%^&*())
	regMotDePasse: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/,
	regNomCellier: /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s'-]{2,50}$/,
};

export const validationChamp = (regEx, valeur) => {
	return regEx.test(valeur);
};

const estVide = (valeur) => !valeur || valeur.trim() === "";

export const validerConnexion = (courriel, motDePasse) => {
	switch (true) {
		case estVide(courriel) && estVide(motDePasse):
			return "Veuillez indiquer tous les champs.";

		case estVide(courriel):
			return "Le courriel est obligatoire.";

		case !validationChamp(regex.regcourriel, courriel):
			return "Veuillez saisir un courriel valide.";

		case estVide(motDePasse):
			return "Le mot de passe est obligatoire.";

		default:
			return "";
	}
};
