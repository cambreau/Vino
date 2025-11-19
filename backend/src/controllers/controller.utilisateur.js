import modeleUtilisateur from "../models/modele.utilisateur.js";
import bcrypt from "bcrypt";
import validationCreationUtilisateur from "../middlewares/validation.utilisateur.js";

/**
 * Fonction asynchrone qui creer un utilisateur.
 */
export const creerUtilisateur = async (req, res) => {
  try {
    const { nom, courriel, mot_de_passe } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existant = await modeleUtilisateur.trouverParCourriel(courriel);
    if (existant) {
      return res
        .status(409)
        .json({ message: "Cet courriel est déjà utilisé." });
    }

    const erreursValidation = validationCreationUtilisateur(req, res);
    if (erreursValidation) {
      return res.status(400).json({ erreurs: erreursValidation });
    }

    // Hasher le mot de passe
    const motDePasseHache = await bcrypt.hash(mot_de_passe, 10);

    // Appel au modèle pour créer l'utilisateur
    if (!erreursValidation) {
      const id_utilisateur = await modeleUtilisateur.creer(
        nom,
        courriel,
        motDePasseHache
      );
      return res.status(201).json({
        message: "Utilisateur créé avec succès.",
        id_utilisateur: id_utilisateur,
      });
    }
  } catch (err) {
    console.error("Erreur lors de la création de l'utilisateur :", err);
    return res.status(500).json({
      error: "Erreur serveur lors de la création de l'utilisateur.",
    });
  }
};

/**
 * Fonction asynchrone qui recupere un utilisateur.
 */
export const recupererUtilisateur = async (req, res) => {};

/**
 * Fonction asynchrone qui recherche un utilisateur par son courriel.
 */
export const recupererUtilisateurParCourriel = async (req, res) => {};

/**
 * Fonction asynchrone qui modifie les informations d'un utilisateur.
 */
export const modifierUtilisateur = async (req, res) => {};

/**
 * Fonction asynchrone qui supprimme un utilisateur.
 */
export const supprimerUtilisateur = async (req, res) => {};



/* =========================================================== */
     /* Fonction asynchrone qui connecte un utilisateur.*/
/* =========================================================== */
export const connexionUtilisateur = async (req, res) => {

};

