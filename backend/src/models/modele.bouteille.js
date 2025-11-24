/**
 * @source backend/src/models/modele.bouteille.js
 * Sources:
 * 1. mysql2/promise — transactions et requêtes préparées.
 *    1.1. https://github.com/sidorares/node-mysql2
 * 2. MDN Array.prototype.reduce — agrégation d'attributs SAQ.
 *    2.1. https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
 * 3. Service interne SAQ (`src/services/saqService.js`) — récupération des produits.
 * Objectif:
 * Implémenter la couche d'accès et de normalisation des bouteilles en
 * documentant invariants, dépendances et opérations exposées.
 */

import { connexion } from "../database/connexion.js";
import { recupererTousVins } from "../services/saqService.js";

const MILLENISME_NON_DISPONIBLE_LIBELLE = "Millésime non disponible";

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

// Transforme un enregistrement SQL en représentation API.
const mapper = (row) => {
  return {
    id: row.id_bouteille,
    codeSaq: row.code_saq,
    nom: row.nom,
    millenisme: row.millenisme ?? MILLENISME_NON_DISPONIBLE_LIBELLE,
    region: row.region,
    cepage: row.cepage,
    image: row.image,
    description: row.description,
    tauxAlcool: row.taux_alcool,
    prix: row.prix,
    pays: row.pays,
    type: row.type,
  };
};

class ModeleBouteille {
  /**
   * Récupère l'ensemble des bouteilles disponibles pour l'API.
   */
  static async trouverTout() {
    const [rows] = await connexion.query(
      `${BASE_SELECT} ORDER BY b.id_bouteille DESC`
    );
    return rows.map(mapper);
  }

  /**
   * Récupère une bouteille spécifique par identifiant.
   */
  static async trouverParId(id) {
    const [rows] = await connexion.query(
      `${BASE_SELECT} WHERE b.id_bouteille = ?`,
      [id]
    );
    return rows.length ? mapper(rows[0]) : null;
  }

  /**
   * Récupère les bouteilles correspondant à une combinaison d'attributs.
   */
  static async trouverParAttributs(filtres = {}) {
    const clauses = [];
    const valeurs = [];

    if (filtres.nom) {
      clauses.push("LOWER(b.nom) LIKE LOWER(?)");
      valeurs.push(`%${filtres.nom}%`);
    }

    if (filtres.region) {
      clauses.push("LOWER(b.region) LIKE LOWER(?)");
      valeurs.push(`%${filtres.region}%`);
    }

    if (filtres.cepage) {
      clauses.push("LOWER(b.cepage) LIKE LOWER(?)");
      valeurs.push(`%${filtres.cepage}%`);
    }

    if (filtres.pays) {
      clauses.push("LOWER(p.nom) LIKE LOWER(?)");
      valeurs.push(`%${filtres.pays}%`);
    }

    if (filtres.type) {
      clauses.push("LOWER(t.couleur) LIKE LOWER(?)");
      valeurs.push(`%${filtres.type}%`);
    }

    if (!clauses.length)
      throw new Error("Au moins un filtre doit être fourni.");

    const sql = `${BASE_SELECT} WHERE ${clauses.join(" AND ")}`;
    const [rows] = await connexion.query(sql, valeurs);
    return rows.map(mapper);
  }

  // Crée une nouvelle bouteille avec les données fournies.
  static async creer(donnees) {
    if (!donnees || !donnees.nom || !donnees.code_saq) {
      throw new Error("Nom et code_saq sont requis");
    }

    const connection = await connexion.getConnection();
    try {
      // Transaction requise comme plusieurs opérations peuvent être éxécutées (voir #normaliserPayload).
      await connection.beginTransaction();

      // Normaliser et valider les données avant insertion.
      const payload = await this.#normaliserPayload(connection, donnees);
      if (!payload) {
        throw new Error("Données invalides pour la création de bouteille");
      }

      // Obtenir l'action effectuée (insert ou update).
      const action = await this.#persisterBouteille(connection, payload);

      // Si tout es OK, on finit la transaction.
      await connection.commit();
      return action;
    } catch (error) {
      // Sinon on annule.
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async mettreAJour(id_bouteille, donnees) {
    // Erreur si l'identifiant n'est pas trouvé
    if (!id_bouteille) {
      throw new Error("Identifiant de bouteille requis pour la mise à jour");
    }

    // Obtiens la connection à la base de donnée
    const connection = await connexion.getConnection();

    try {
      await connection.beginTransaction();

      // Récupérer la bouteille existante
      const existante = await this.trouverParId(id_bouteille);
      if (!existante) {
        throw new Error("Bouteille introuvable");
      }

      // Fusionne les nouvelles données avec les valeurs existantes
      const payload = await this.#normaliserPayload(connection, {
        ...existante,
        //Converti le camelCase  en snake_case pour que la base de donnée le trouve
        //On garde les valeurs existantes si non fournies
        code_saq: existante.codeSaq,
        ...donnees,
      });
      if (!payload) throw new Error("Données invalides pour la mise à jour");

      // Requête SQL update
      const sql = `
      UPDATE bouteille
      SET nom = ?, millenisme = ?, region = ?, cepage = ?, image = ?, description = ?, taux_alcool = ?, prix = ?, id_pays = ?, id_type = ?
      WHERE id_bouteille = ?
    `;

      // Tous les valeurs de la query dans un tableau result
      const [result] = await connection.query(sql, [
        payload.nom,
        payload.millenisme,
        payload.region,
        payload.cepage,
        payload.image,
        payload.description,
        payload.taux_alcool,
        payload.prix,
        payload.id_pays,
        payload.id_type,
        id_bouteille,
      ]);

      // Commit si tout est OK
      await connection.commit();

      // Si vrai, retourne result, sinon rollback
      return result.affectedRows > 0 ? "update" : null;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async supprimer() {
    throw new Error("supprimer non implémenté");
  }

  /**
   * Importe les produits SAQ en respectant la structure `codeDb.sql`.
   */
  static async importerDepuisEnregistrementsSaq(options = {}) {
    const { limite } = options;
    const enregistrements = await recupererTousVins();
    const aTraiter =
      Number.isInteger(limite) && limite > 0
        ? enregistrements.slice(0, limite)
        : enregistrements;

    // Statistiques retournées au contrôleur pour informer le client.
    const stats = {
      totalRecuperes: enregistrements.length,
      traites: aTraiter.length,
      traitesUniques: 0,
      inseres: 0,
      misAJour: 0,
      ignores: 0,
      doublons: 0,
    };

    if (!aTraiter.length) return stats;

    const connection = await connexion.getConnection();
    const codesTraites = new Set();
    try {
      await connection.beginTransaction();
      for (const enregistrement of aTraiter) {
        const mappe = this.#mapperEnregistrementSaq(enregistrement);
        if (!mappe) {
          stats.ignores += 1;
          continue;
        }

        const payload = await this.#normaliserPayload(connection, mappe);
        if (!payload) {
          stats.ignores += 1;
          continue;
        }

        if (codesTraites.has(payload.code_saq)) {
          stats.doublons += 1;
          continue;
        }
        codesTraites.add(payload.code_saq);

        const action = await this.#persisterBouteille(connection, payload);
        if (action === "insert") stats.inseres += 1;
        else if (action === "update") stats.misAJour += 1;
        else stats.ignores += 1;
      }
      stats.traitesUniques = codesTraites.size;
      await connection.commit();
      return stats;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Effectue un upsert basé sur `code_saq` afin d'éviter les doublons.
   */
  static async #persisterBouteille(connection, payload) {
    try {
      const [existants] = await connection.query(
        "SELECT id_bouteille FROM bouteille WHERE code_saq = ? LIMIT 1",
        [payload.code_saq]
      );

      if (existants.length) {
        console.log("Mise à jour - payload:", JSON.stringify(payload));
        await connection.query(
          `UPDATE bouteille
           SET nom = ?, millenisme = ?, region = ?, cepage = ?, image = ?,
               description = ?, taux_alcool = ?, prix = ?, id_pays = ?, id_type = ?
         WHERE id_bouteille = ?`,
          [
            payload.nom,
            payload.millenisme,
            payload.region,
            payload.cepage,
            payload.image,
            payload.description,
            payload.taux_alcool,
            payload.prix,
            payload.id_pays,
            payload.id_type,
            existants[0].id_bouteille,
          ]
        );
        return "update";
      }

      console.log("Insertion - payload:", JSON.stringify(payload));
      await connection.query(
        `INSERT INTO bouteille
  (code_saq, nom, millenisme, region, cepage, image, description,
    taux_alcool, prix, id_pays, id_type)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          payload.code_saq,
          payload.nom,
          payload.millenisme,
          payload.region,
          payload.cepage,
          payload.image,
          payload.description,
          payload.taux_alcool,
          payload.prix,
          payload.id_pays,
          payload.id_type,
        ]
      );
      return "insert";
    } catch (err) {
      console.error("Erreur SQL #persisterBouteille:", err?.message || err);
      console.error("payload:", payload);
      throw err;
    }
  }

  /**
   * Valide un millésime : doit être > 0 et dans une plage raisonnable (1800 - année actuelle + 2)
   */
  static #validerMillenisme(millenisme) {
    if (!Number.isInteger(millenisme) || millenisme <= 0) return false;
    const anneeActuelle = new Date().getFullYear();
    return millenisme >= 1800 && millenisme <= anneeActuelle + 2;
  }

  /**
   * Valide et complète les données avant insertion SQL.
   */
  static async #normaliserPayload(connection, donneesMappees) {
    if (!donneesMappees?.nom) return null;

    const codeSaqBrut = donneesMappees.codeSAQ || donneesMappees.code_saq;
    const codeSaq = typeof codeSaqBrut === "string" ? codeSaqBrut.trim() : null;
    if (!codeSaq) return null; // on ignore les enregistrements sans code unique

    const idPays = await this.#assurerPays(connection, donneesMappees.pays);
    const idType = await this.#assurerType(connection, donneesMappees.type);

    let millenisme = donneesMappees.millenisme;
    if (millenisme !== undefined && millenisme !== null) {
      millenisme = Number(millenisme);
      if (!this.#validerMillenisme(millenisme)) millenisme = null;
    }

    const cepageValue = Array.isArray(donneesMappees.cepage)
      ? donneesMappees.cepage.join(", ")
      : donneesMappees.cepage || "Cépage non précisé";

    const regionValue = Array.isArray(donneesMappees.region)
      ? donneesMappees.region.join(", ")
      : donneesMappees.region || "Origine non précisée";

    return {
      code_saq: codeSaq,
      nom: donneesMappees.nom,
      millenisme: millenisme,
      region: regionValue,
      cepage: cepageValue,
      image: donneesMappees.image || "",
      description: donneesMappees.description || "Description non fournie",
      taux_alcool: donneesMappees.tauxAlcool ?? null,
      prix: Number.isFinite(Number(donneesMappees.prix))
        ? Number(donneesMappees.prix)
        : 0,

      id_pays: idPays,
      id_type: idType,
    };
  }

  /**
   * Traduit une réponse SAQ en attributs internes.
   */
  static #mapperEnregistrementSaq(enregistrement) {
    if (!enregistrement?.product && !enregistrement?.productView) return null;
    const product = enregistrement.product || {};
    const vue = enregistrement.productView || {};
    const attributes = Array.isArray(vue.attributes) ? vue.attributes : [];
    // On convertit la liste d'attributs en objet clé/valeur pour des lectures rapides.
    const attrMap = attributes.reduce((acc, attr) => {
      if (attr?.name) acc[attr.name] = attr.value;
      return acc;
    }, {});

    const brutPrix =
      product?.price_range?.minimum_price?.final_price?.value ?? undefined;
    const prix = Number.parseFloat(brutPrix);
    const taux = attrMap.pourcentage_alcool_par_volume
      ? Number.parseFloat(
          attrMap.pourcentage_alcool_par_volume
            .toString()
            .replace(",", ".")
            .replace(/[^0-9.]/g, "")
        )
      : null;

    const millenismeBrut = attrMap.millenisme_produit
      ? Number.parseInt(attrMap.millenisme_produit, 10)
      : null;
    const millenisme = this.#validerMillenisme(millenismeBrut)
      ? millenismeBrut
      : null;

    return {
      codeSAQ: vue?.sku || product?.sku || null,
      nom: vue.name || product?.name || null,
      prix: Number.isFinite(prix) ? prix : null,
      millenisme,
      region:
        attrMap.region_origine ||
        attrMap.designation_reglementee ||
        attrMap.identite_produit ||
        attrMap.gamme_marketing ||
        null,
      cepage: attrMap.cepage || attrMap.pastille_gout || null,
      image: product?.image?.url || null,
      description: this.#construireDescription(attrMap),
      tauxAlcool: Number.isFinite(taux) ? taux : null,
      pays: attrMap.pays_origine || null,
      type: attrMap.couleur || null,
    };
  }

  /**
   * Produit une description textuelle compacte à partir d'attributs SAQ.
   */
  static #construireDescription(attrMap) {
    const clefsImportantes = [
      "identite_produit",
      "designation_reglementee",
      "pastille_gout",
      "taux_sucre",
      "gamme_marketing",
      "nom_producteur",
    ];

    const fragments = clefsImportantes
      .map((cle) => ({ cle, valeur: attrMap[cle] }))
      .filter(({ valeur }) => valeur)
      .map(({ cle, valeur }) => `${cle.replace(/_/g, " ")}: ${valeur}`);

    return fragments.join(" | ");
  }

  /**
   * S'assure qu'un type (couleur) existe et retourne son identifiant.
   */
  static async #assurerType(connection, couleur) {
    if (!couleur) return null;
    const valeur = couleur.trim();
    if (!valeur) return null;

    const [rows] = await connection.query(
      "SELECT id_type FROM type WHERE LOWER(couleur) = LOWER(?) LIMIT 1",
      [valeur]
    );
    if (rows.length) return rows[0].id_type;

    const [result] = await connection.query(
      "INSERT INTO type (couleur) VALUES (?)",
      [valeur]
    );
    return result.insertId;
  }

  /**
   * S'assure qu'un pays existe et retourne son identifiant.
   */
  static async #assurerPays(connection, pays) {
    if (!pays) return null;
    const valeur = pays.trim();
    if (!valeur) return null;

    const [rows] = await connection.query(
      "SELECT id_pays FROM pays WHERE LOWER(nom) = LOWER(?) LIMIT 1",
      [valeur]
    );
    if (rows.length) return rows[0].id_pays;

    const [result] = await connection.query(
      "INSERT INTO pays (nom) VALUES (?)",
      [valeur]
    );
    return result.insertId;
  }
}

export default ModeleBouteille;
