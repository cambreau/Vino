import { connexion } from "../database/connexion.js";

export default class ModeleDegustation {
  // Requête pour récupérer les dégustations d'un utilisateur
  static async recupererTous(id_utilisateur) {}

  // Requête pour ajouter une dégustation
  static async ajouter(id_vin, id_utilisateur, note, commentaire) {}

  // Requête pour modifier une dégustation
  static async modifier(
    id_bouteille,
    id_utilisateur,
    date,
    note,
    commentaire
  ) {}

  // Requête pour suprimmer une dégustation
  static async supprimer(id_utilisateur, id_bouteille, date) {}
}
