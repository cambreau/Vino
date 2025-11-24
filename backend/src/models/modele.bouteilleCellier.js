import { connexion } from "../database/connexion.js";

export default class modeleBouteilleCellier {
  // Requête pour récuperer les bouteilles dans un cellier
  static async recuperer(idCellier) {}

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
  static async supprimer(idCellier, idBouteille) {}
}
