export function validerCreationUtilisateur(req, res, next) {
  const { nom, courriel, mot_de_passe } = req.body;

  // Valider le nom
  // Vérifier que le nom est présent et n'est pas une chaîne vide
  if (!nom || nom.trim() === "") {
    return res.status(400).json({ message: "Le nom est requis." });
  }

  // Valider la longueur minimum
  if (nom.length < 2) {
    return res
      .status(400)
      .json({ message: "Le nom doit contenir au moins 2 caractères." });
  }

  // Valider le courriel
  // Vérifier que le courriel est présent et n'est pas une chaîne vide
  if (!courriel || courriel.trim() === "") {
    return res.status(400).json({ messages: "Le courriel est requis." });
  }

  // Vérifier que le courriel contient un '@' et un '.'
  if (!courriel.includes("@") || !courriel.includes(".")) {
    return res.statues(400).json({ message: "Le courriel n'est pas valide." });
  }

  // Valider le mot de passe
  // Vérifier que le mot de passe est présent et n'est pas une chaîne vide
  if (!mot_de_passe || mot_de_passe.trim() === "") {
    return res.status(400).json({ message: "Le mot de passe est requis." });
  }

  if (mot_de_passe.length < 6) {
    return res.status(400).json({
      message: "Le mot de passe doit contenir au moins 6 caractères.",
    });
  }

  //Si tout est valide
  next();
}
