import { connexion } from "../database/connexion.js";

export default class modeleBouteilleCellier {
  // Requête pour récuperer les bouteilles dans un cellier
  static async recuperer(idCellier) {
    // S'assure que l'ID du cellier est un entier valide
    const id = Number.parseInt(idCellier, 10);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("ID de cellier invalide");
    }

    const sql = `
      SELECT 
        id_bouteille,
        quantite
      FROM bouteilleCellier
      WHERE id_cellier = ?
    `;

    const [rows] = await connexion.query(sql, [id]);

    // Retourne un tableau du type [{ id_bouteille, quantite }, ...]
    return rows;
  }

  // Requête pour vérifier si une bouteille existe déjà dans le cellier
  static async verifierExistence(idCellier, idBouteille) {
    const sql = `
      SELECT * FROM bouteilleCellier 
      WHERE id_cellier = ? AND id_bouteille = ?
    `;

    const [rows] = await connexion.query(sql, [idCellier, idBouteille]);

    // Retourne la première ligne si elle existe, sinon null
    return rows.length > 0 ? rows[0] : null;
  }

  // Mettre a jour la quantite des bouteilles cellier
  static async mettreAJourQuantite(idCellier, idBouteille, nouvelleQuantite) {
    const sql = `
      UPDATE bouteilleCellier 
      SET quantite = ? 
      WHERE id_cellier = ? AND id_bouteille = ?
    `;

    const [result] = await connexion.query(sql, [
      nouvelleQuantite,
      idCellier,
      idBouteille,
    ]);
    return result.affectedRows > 0;
  }

  // Requête pour ajouter une bouteille dans un cellier
  static async ajouter(idCellier, idBouteille, quantite = 1) {
    if (!idCellier || !idBouteille)
      throw new Error("Un cellier est une bouteille est nécessaire");

    // Si la qualité n'est pas fournie, met à 1 par défaut
    if (typeof quantite !== "number" || quantite <= 0) quantite = 1;

    // Requête SQL pour insérer une bouteille
    const sql = `
    INSERT INTO bouteilleCellier (id_cellier, id_bouteille, quantite)
    VALUES (?, ?, ?)
  `;

    // Résultat dans un tableau
    const [result] = await connexion.query(sql, [
      idCellier,
      idBouteille,
      quantite,
    ]);
    return result.insertId;
  }

  // Requête pour Modifier quantité, notes, etc.
  static async modifier(idCellier, idBouteilles, quantite, notes) {}

  // Requête pour supprimer une bouteille d'un cellier
  static async supprimer(idCellier, idBouteille) {
    const sql =
      "DELETE FROM bouteilleCellier WHERE id_cellier = ? AND id_bouteille = ?";
    const [result] = await connexion.query(sql, [idCellier, idBouteille]);
    return result.affectedRows > 0;
  }
}
