import { connexion } from "../database/connexion.js";
export default class modeleUtilisateur {

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
