import { connexion } from "../database/connexion.js";

export default class ModeleCellier {
  // Requête pour ajouter un cellier avec nom par défaut si non fourni
  static async ajouter(nom = "Mon Cellier", id_utilisateur) {
    // S'assure que le id est un nombre
    const id = Number.parseInt(id_utilisateur, 10);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("ID utilisateur invalide");
    }

    // Lance une erreur si on ne trouve pas d'id ou non fourni
    if (!id_utilisateur) {
      throw new Error("Utilisateur requis pour créer un cellier");
    }

    // S'assure que le nom du cellier n'est pas vide
    if (typeof nom !== "string" || nom.trim().length === 0) {
      nom = "Mon Cellier";
    }

    // Requête pour créer un cellier
    const sql = `INSERT INTO cellier (id_utilisateur, nom) VALUES (?, ?)`;
    const [resultat] = await connexion.query(sql, [id, nom.trim()]);

    // Retourne le nouveau Id créer avec au moment de la requête
    return resultat.insertId;
  }
  // Requête pour récupérer les celliers d'un utilisateur
  static async recuperer(id_utilisateur) {}

  // Requête pour modifier un cellier
  static async modifier(id_cellier, donnees) {}

  // Requête pour suprimmer un cellier
  static async supprimer(id_cellier) {}
}
