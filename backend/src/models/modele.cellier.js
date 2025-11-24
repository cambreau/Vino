import { connexion } from "../database/connexion.js";

export default class ModeleCellier {
  // Requête pour ajouter un cellier avec nom par défaut si non fourni
  static async ajouter(nom = "Mon Cellier", id_utilisateur) {}

  // Requête pour récupérer les celliers d'un utilisateur
  static async recuperer(id_utilisateur) {}

  // Requête pour modifier un cellier
  static async modifier(id_cellier, donnees) {}

  // Requête pour suprimmer un cellier
  static async supprimer(id_cellier) {}
}
