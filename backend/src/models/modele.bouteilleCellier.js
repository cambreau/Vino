import { connexion } from "../database/connexion.js";

export default class modeleBouteilleCellier {
  // Requête pour récuperer les bouteilles dans un cellier
  static async recuperer(idCellier) {}

  // Requête pour ajouter une bouteille dans un cellier
  static async ajouter(idCellier, idBouteille, quantite, notes) {}

  // Requête pour Modifier quantité, notes, etc.
  static async modifier(idCellier, idBouteilles, quantite, notes) {}

  // Requête pour supprimer une bouteille d'un cellier
  static async supprimer(idCellier, idBouteille) {}
}
