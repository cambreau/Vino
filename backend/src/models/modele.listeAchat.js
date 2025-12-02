import { connexion } from "../database/connexion.js";

export default class modeleListeAchat {
  //Vérifier si une bouteille existe déjà dans la liste d'achat
  static async bouteilleExisteDansListe(id_utilisateur, id_bouteille) {
    const sql = `
      SELECT * FROM listeAchat
      WHERE id_utilisateur = ? AND id_bouteille = ?
    `;
    const [resultat] = await connexion.query(sql, [id_utilisateur, id_bouteille]);
    return resultat.length > 0 ? resultat[0] : null;
  }

  //Ajouter une bouteille a la liste d'achat
  static async ajoutBouteilleListe(
    id_utilisateur,
    id_bouteille,
    quantite = 1
  ) {
    if (!id_utilisateur || !id_bouteille) {
      throw new Error(
        "Les identifiants utilisateur et bouteille sont requis"
      );
    }

    if (!Number.isInteger(quantite) || quantite <= 0) {
      quantite = 1;
    }

    // Vérifier si la bouteille existe déjà dans la liste
    const bouteilleExistante = await this.bouteilleExisteDansListe(id_utilisateur, id_bouteille);
    if (bouteilleExistante) {
      return {
        existe: true,
        bouteilleExistante,
      };
    }

    const sql = `
      INSERT INTO listeAchat (id_utilisateur, id_bouteille, quantite)
      VALUES (?, ?, ?)
    `;

    const [resultat] = await connexion.query(sql, [
      id_utilisateur,
      id_bouteille,
      quantite,
    ]);

    return {
      existe: false,
      id_utilisateur,
      id_bouteille,
      quantite,
      lignesAffectees: resultat.affectedRows,
    };
  }

  //Récupérer la liste d'achat d'un utilisateur
  static async recupererListe(id_utilisateur) {
    const id = Number.parseInt(id_utilisateur, 10);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Identifiant utilisateur invalide");
    }

    const sql = `
      SELECT
        la.id_utilisateur,
        la.id_bouteille,
        la.quantite,
        b.code_saq,
        b.nom,
        b.millenisme,
        b.region,
        b.cepage,
        b.image,
        b.description,
        b.taux_alcool,
        b.prix,
        p.nom AS pays,
        t.couleur AS type
      FROM listeAchat la
      INNER JOIN bouteille b ON b.id_bouteille = la.id_bouteille
      LEFT JOIN pays p ON p.id_pays = b.id_pays
      LEFT JOIN type t ON t.id_type = b.id_type
      WHERE la.id_utilisateur = ?
      ORDER BY b.nom ASC;
    `;

    const [rows] = await connexion.query(sql, [id]);

    return rows.map((row) => ({
      id_utilisateur: row.id_utilisateur,
      id_bouteille: row.id_bouteille,
      quantite: row.quantite,
      bouteille: {
        id: row.id_bouteille,
        codeSaq: row.code_saq,
        nom: row.nom,
        millenisme: row.millenisme,
        region: row.region,
        cepage: row.cepage,
        image: row.image,
        description: row.description,
        tauxAlcool: row.taux_alcool,
        prix: row.prix,
        pays: row.pays,
        type: row.type,
      },
    }));
  }

  //Modifier une quantite bouteille a la liste d'achat
  static async modifierBouteilleListe(id_utilisateur, id_bouteille) {}
  
  //Supprimer une bouteille a la liste d'achat
  static async supprimerBouteilleListe(id_utilisateur, id_bouteille) {
    const sql = `
      DELETE FROM listeAchat 
      WHERE id_utilisateur = ? AND id_bouteille = ?
    `;
    const [resultat] = await connexion.execute(sql, [id_utilisateur, id_bouteille]);
    return resultat.affectedRows > 0;
  }
  }