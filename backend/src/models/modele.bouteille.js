/**
 * @source backend/src/models/modele.bouteille.js
 * Objectif:
 * Implémenter la couche d'accès et de normalisation des bouteilles en
 * documentant invariants, dépendances et opérations exposées.
 */

import pool from "../database/pool.js";

const BASE_SELECT = `
	SELECT
		b.id_bouteille,
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
	FROM bouteille b
	LEFT JOIN pays p ON p.id_pays = b.id_pays
	LEFT JOIN type t ON t.id_type = b.id_type
`;

const mapper = (row) => ({
  id: row.id_bouteille,
  codeSAQ: row.code_saq,
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
});

class ModeleBouteille {
  static async trouverTout() {}

  static async trouverParId() {}

  static async creer() {}

  static async mettreAJour() {}

  static async supprimer() {}

  static async importerDepuisEnregistrementsSaq() {}

  static async #normaliserPayload() {}

  static async #mapperEnregistrementSaq() {}

  static #construireDescription() {}

  static async #assurerType() {}
}

export default ModeleBouteille;
