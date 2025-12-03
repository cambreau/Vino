import { connexion } from "../database/connexion.js";

export default class ModeleDegustation {
  // Requête pour récupérer les dégustations d'une bouteille spécifique
  static async recupererParBouteille(id_bouteille) {
    const idBouteille = Number.parseInt(id_bouteille, 10);
    if (!Number.isInteger(idBouteille) || idBouteille <= 0) {
      throw new Error("ID bouteille invalide");
    }

    if (!idBouteille) {
      throw new Error("Bouteille requise pour récupérer les dégustations");
    }

    const sql = `SELECT * FROM degustation WHERE id_bouteille = ? ORDER BY date_degustation DESC`;
    const [rows] = await connexion.query(sql, [idBouteille]);
    return rows;
  }

  // Requête pour récupérer les dégustation d'un utilisateur
  static async recupererParUtilisateur(id_utilisateur) {
    const idUtilisateur = Number.parseInt(id_utilisateur, 10);
    if (!Number.isInteger(idUtilisateur) || idUtilisateur <= 0) {
      throw new Error("ID utilisateur invalide");
    }

    if (!idUtilisateur) {
      throw new Error("Utilisateur requis pour récupérer les dégustations");
    }

    const sql = `SELECT * FROM degustation WHERE id_utilisateur = ?`;
    const [rows] = await connexion.query(sql, [idUtilisateur]);
    return rows;
  }

  // Requête pour ajouter une dégustation
  static async ajouter(id_bouteille, id_utilisateur, note, commentaire) {
    // Validation des entrées
    const idBouteille = Number.parseInt(id_bouteille, 10);
    const idUtilisateur = Number.parseInt(id_utilisateur, 10);
    const noteNombre = Number(note);
    if (!Number.isInteger(idBouteille) || idBouteille <= 0) {
      throw new Error("ID bouteille invalide");
    }

    if (!Number.isInteger(idUtilisateur) || idUtilisateur <= 0) {
      throw new Error("ID utilisateur invalide");
    }

    if (!idBouteille) {
      throw new Error("Bouteille requise pour ajouter une dégustation");
    }

    if (!idUtilisateur) {
      throw new Error("Utilisateur requis pour ajouter une dégustation");
    }

    if (Number.isNaN(noteNombre) || noteNombre < 0 || noteNombre > 5) {
      throw new Error("Note doit être un nombre entre 0 et 5");
    }

    if (typeof commentaire !== "string" || commentaire.trim() === "") {
      throw new Error("Commentaire ne peut pas être vide");
    }

    // Insertion dans la base de données
    const sql = `INSERT INTO degustation (id_bouteille, id_utilisateur, notes, commentaire) VALUES (?, ?, ?, ?)`;
    const [result] = await connexion.query(sql, [
      idBouteille,
      idUtilisateur,
      noteNombre,
      commentaire,
    ]);
    // Retourne le resultat de l'insertion
    return result;
  }

  // Requête pour modifier une dégustation
  static async modifier(
    id_bouteille,
    id_utilisateur,
    date,
    note,
    commentaire
  ) {}

  // Requête pour suprimmer une dégustation
  static async supprimer(id_utilisateur, id_bouteille) {
    const idUtilisateur = Number.parseInt(id_utilisateur, 10);
    const idBouteille = Number.parseInt(id_bouteille, 10);

    if (!Number.isInteger(idUtilisateur) || idUtilisateur <= 0) {
      throw new Error("ID utilisateur invalide");
    }

    if (!Number.isInteger(idBouteille) || idBouteille <= 0) {
      throw new Error("ID bouteille invalide");
    }

    const sql = `DELETE FROM degustation 
               WHERE id_utilisateur = ? 
               AND id_bouteille = ?`;

    const [resultat] = await connexion.query(sql, [idUtilisateur, idBouteille]);

    return resultat;
  }
}
