import { connexion } from "../database/connexion.js";

export default class ModeleCellier {
  // Requête pour ajouter un cellier
  static async ajouter(nom, id_utilisateur) {
    // S'assure que le id est un nombre
    const id = Number.parseInt(id_utilisateur, 10);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("ID utilisateur invalide");
    }

    // Lance une erreur si on ne trouve pas d'id ou non fourni
    if (!id_utilisateur) {
      throw new Error("Utilisateur requis pour créer un cellier");
    }

    // S'assure que le nom du cellier est fourni et valide
    if (!nom || typeof nom !== "string" || nom.trim().length === 0) {
      throw new Error("Le nom du cellier est requis");
    }

    // Requête pour créer un cellier avec quantité initialisée à 0
    const sql = `INSERT INTO cellier (id_utilisateur, nom, quantite) VALUES (?, ?, 0)`;
    const [resultat] = await connexion.query(sql, [id, nom.trim()]);

    // Retourne le nouveau Id créer avec au moment de la requête
    return resultat.insertId;
  }

  // Requête pour récupére un cellier d'un utilisateur
  static async recuperer(id_utilisateur) {}

  // Requête pour récupérer les celliers d'un utilisateur
  static async recupererTous(id_utilisateur) {
    // Convertit l'id_utilisateur en nombre entier en base 10 decimal
    const id = Number.parseInt(id_utilisateur, 10);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("ID utilisateur invalide");
    }

    const sql = `SELECT * FROM cellier WHERE id_utilisateur = ?`;
    const [resultat] = await connexion.query(sql, [id]);
    return resultat;
  }

  // Requête pour modifier un cellier
  static async modifier(id_cellier, id_utilisateur, nom) {
    // S'assure que les ID sont des nombres valides
    const idUtilisateur = Number.parseInt(id_utilisateur, 10);
    const idCellier = Number.parseInt(id_cellier, 10);

    // Validation des entrées
    if (!Number.isInteger(idUtilisateur) || idUtilisateur <= 0) {
      throw new Error("ID utilisateur invalide");
    }

    if (!Number.isInteger(idCellier) || idCellier <= 0) {
      throw new Error("ID utilisateur invalide");
    }

    if (typeof nom !== "string" || nom.trim().length === 0) {
      throw new Error("Le nom du cellier est invalide");
    }

    // Vérifie si le cellier existe pour cet utilisateur
    const sqlCheck = `SELECT * FROM cellier WHERE id_cellier = ? AND id_utilisateur = ?`;
    const [rows] = await connexion.query(sqlCheck, [idCellier, idUtilisateur]);

    if (rows.length === 0) {
      throw new Error("Cellier non trouvé pour cet utilisateur");
    }

    // Met à jour le nom du cellier
    const sqlUpdate = `UPDATE cellier SET nom = ? WHERE id_cellier = ? AND id_utilisateur = ?`;
    const [result] = await connexion.query(sqlUpdate, [
      nom.trim(),
      idCellier,
      idUtilisateur,
    ]);

    // Retourne true si une ligne a été affectée (modifiée)
    return result.affectedRows > 0;
  }

  // Requête pour suprimmer un cellier
  static async supprimer(id_cellier) {}
}
