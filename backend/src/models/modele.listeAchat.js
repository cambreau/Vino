import { connexion } from "../database/connexion.js";

export default class modeleListeAchat {
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

    const sql = `
      INSERT INTO listeAchat (id_utilisateur, id_bouteille, quantite)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE quantite = quantite + VALUES(quantite);
    `;

    const [resultat] = await connexion.query(sql, [
      id_utilisateur,
      id_bouteille,
      quantite,
    ]);

    return {
      id_utilisateur,
      id_bouteille,
      quantite,
      lignesAffectees: resultat.affectedRows,
    };
  }

  //Récupérer la liste d'achat d'un utilisateur
  static async recupererListe(id_utilisateur) {}

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