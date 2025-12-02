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
  static async recupererListe(id_utilisateur) {}

  //Modifier une quantite bouteille a la liste d'achat
  static async supprimerBouteilleListe(id_utilisateur, id_bouteille) {}

  //Supprimer une bouteille a la liste d'achat
  static async modifierBouteilleListe(id_utilisateur, id_bouteille) {}
}
