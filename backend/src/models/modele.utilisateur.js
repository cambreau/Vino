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
			console.error(
				"Erreur lors de la recherche de l'utilisateur:",
				erreur,
			);
			throw erreur;
		}
	}

	//Modifier un utilisateur et retourne si succès
	static async modifier(id_utilisateur, nom, courriel) {
		const sql = `
      UPDATE utilisateur 
      SET nom = ?, courriel = ? 
      WHERE id_utilisateur = ?
    `;
		const [resultat] = await connexion.execute(sql, [
			nom,
			courriel,
			id_utilisateur,
		]);
		return resultat.affectedRows > 0;
	}

	//Supprimer un utilisateur et ses entités associées
	static async supprimer(id_utilisateur) {
		const db = await connexion.getConnection();

		try {
			await db.beginTransaction();

			// Supprimer les bouteilles associées aux celliers de l'utilisateur
			await db.execute(
				`DELETE bc FROM bouteilleCellier bc
         INNER JOIN cellier c ON bc.id_cellier = c.id_cellier
         WHERE c.id_utilisateur = ?`,
				[id_utilisateur],
			);

			// Supprimer les dégustations et les listes d'achats liées
			await db.execute(
				`DELETE FROM degustation WHERE id_utilisateur = ?`,
				[id_utilisateur],
			);
			await db.execute(
				`DELETE FROM listeAchat WHERE id_utilisateur = ?`,
				[id_utilisateur],
			);

			// Supprimer les celliers de l'utilisateur
			await db.execute(`DELETE FROM cellier WHERE id_utilisateur = ?`, [
				id_utilisateur,
			]);

			// Enfin, supprimer l'utilisateur
			const [resultat] = await db.execute(
				`DELETE FROM utilisateur 
         WHERE id_utilisateur = ? 
         LIMIT 1`,
				[id_utilisateur],
			);

			await db.commit();
			return resultat.affectedRows > 0;
		} catch (error) {
			await db.rollback();
			throw error;
		}
	}
}
