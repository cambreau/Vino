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

  //Récupérer un utilisateur par courriel
  static async trouverParCourriel(courriel) {
    const sql = `
        select * from utilisateur where courriel = ? LIMIT 1
        `;
    const [lignes] = await connexion.execute(sql, [courriel]);
    return lignes[0] || null;
  }

  //Récupérer un utilisateur par courriel
  static async trouverParId(id_utilisateur) {
    const sql = `
        select * from utilisateur where id_utilisateur = ? LIMIT 1
        `;
    const [lignes] = await connexion.execute(sql, [id_utilisateur]);
    return lignes[0] || null;
  }

  /**
   * Fonction qui recherche un utilisateur par son courriel pour la connexion
  */
  static async connexionUtilisateur(courriel) {
    try {
      const sql = `
      SELECT id_utilisateur, nom, courriel, mot_de_passe 
      FROM utilisateur 
      WHERE courriel = ? 
      LIMIT 1
    `;
      const [resultat] = await connexion.execute(sql, [courriel]);

      // Si un utilisateur est trouvé, retourner le premier résultat, sinon retourner null
      return resultat.length > 0 ? resultat[0] : null;
    } catch (erreur) {
      console.error('Erreur lors de la recherche de l\'utilisateur:', erreur);
      throw erreur;
    }
  }

  //Modifier un utilisateur et retourne si succès
  static async modifier(id_utilisateur, nom, courriel, mot_de_passe_hache = null) {
    // Si on ne change pas le mot de passe
    if (!mot_de_passe_hache) {
      const sql = `
      UPDATE utilisateur 
      SET nom = ?, courriel = ? 
      WHERE id_utilisateur = ?
    `;
      const [resultat] = await connexion.execute(sql, [nom, courriel, id_utilisateur]);
      return resultat.affectedRows > 0;
    }

    // Si on change aussi le mot de passe
    const sql = `
    UPDATE utilisateur 
    SET nom = ?, courriel = ?, mot_de_passe = ? 
    WHERE id_utilisateur = ?
  `;
    const [resultat] = await connexion.execute(sql, [nom, courriel, mot_de_passe_hache, id_utilisateur]);
    return resultat.affectedRows > 0;
  }
}

