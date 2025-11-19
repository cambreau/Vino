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


/**
 * Fonction qui recherche un utilisateur par son email pour la connexion
*/
static async connexionUtilisateur(email) {
  try {
    const sql = `
      SELECT id_utilisateur, nom, email, mot_de_passe 
      FROM utilisateur 
      WHERE email = ? 
      LIMIT 1
    `;
    const [resultat] = await connexion.execute(sql, [email]);
    
    // Si un utilisateur est trouvé, retourner le premier résultat, sinon retourner null
    return resultat.length > 0 ? resultat[0] : null;
  } catch (erreur) {
    console.error('Erreur lors de la recherche de l\'utilisateur:', erreur);
    throw erreur;
  }
}
}

