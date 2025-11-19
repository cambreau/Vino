import { connexion } from "../database/connexion.js";
export default class modeleUtilisateur {
  //Créer un utilisateur er tourne l'ID
  static async creer(nom, courriel, mot_de_passe_hache) {
    const sql = `
        INSERT INTO utilisateur (nom, courriel, mot_de_passe)
        VALUES (?, ?, ?)
        `;

    const [resultat] = await connexion.execute(sql, [
      nom,
      courriel,
      mot_de_passe_hache,
    ]);
    return resultat.insertId;
  }

  //Récupérer un utilisateur par email
  static async trouverParCourriel(courriel) {
    const sql = `
        select * from utilisateur where courriel = ? LIMIT 1
        `;
    const [lignes] = await connexion.execute(sql, [courriel]);
    return lignes[0] || null;
  }
}
