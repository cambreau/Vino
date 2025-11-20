// Sous-fonctions de validation réutilisables
function validerNom(nom) {
  if (!nom || nom.trim() === "") {
    return { valide: false, message: "Le nom est requis." };
  }

  if (nom.length < 2) {
    return {
      valide: false,
      message: "Le nom doit contenir au moins 2 caractères.",
    };
  }

  return { valide: true };
}

function validerCourriel(courriel) {
  if (!courriel || courriel.trim() === "") {
    return { valide: false, message: "Le courriel est requis." };
  }

  if (!courriel.includes("@") || !courriel.includes(".")) {
    return { valide: false, message: "Le courriel n'est pas valide." };
  }

  return { valide: true };
}

function validerMotDePasse(mot_de_passe, verifierLongueur = true) {
  if (!mot_de_passe || mot_de_passe.trim() === "") {
    return { valide: false, message: "Le mot de passe est requis." };
  }

  if (verifierLongueur && mot_de_passe.length < 8) {
    return {
      valide: false,
      message: "Le mot de passe doit contenir au moins 8 caractères.",
    };
  }

  return { valide: true };
}

// Middleware pour la CRÉATION d'utilisateur
export function validerCreationUtilisateur(req, res, next) {
  const { nom, courriel, mot_de_passe } = req.body;
  // Valider le nom
  const validationNom = validerNom(nom);
  if (!validationNom.valide) {
    return res.status(400).json({ message: validationNom.message });
  }

  // Valider le courriel
  const validationCourriel = validerCourriel(courriel);
  if (!validationCourriel.valide) {
    return res.status(400).json({ message: validationCourriel.message });
  }

  // Valider le mot de passe
  const validationMotDePasse = validerMotDePasse(mot_de_passe);
  if (!validationMotDePasse.valide) {
    return res.status(400).json({ message: validationMotDePasse.message });
  }

  //Si tout est valide
  next();
}

// Middleware pour la CONNEXION d'utilisateur
export function validerConnexionUtilisateur(req, res, next) {
  const { courriel, mot_de_passe } = req.body;

  // Valider le courriel
  const validationCourriel = validerCourriel(courriel);
  if (!validationCourriel.valide) {
    return res.status(400).json({ message: validationCourriel.message });
  }

  // Valider le mot de passe (sans vérifier la longueur minimale pour la connexion)
  const validationMotDePasse = validerMotDePasse(mot_de_passe, false);
  if (!validationMotDePasse.valide) {
    return res.status(400).json({ message: validationMotDePasse.message });
  }

  next();
}
