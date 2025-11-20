/**
 * @source backend/src/services
 * Sources:
 * 1. Documentation non officielle de l'API GraphQL de la SAQ —
 *    La requête GraphQL et la logique de pagination ont été développées
 *    à partir des paquets réseau observés depuis l'interface web de la SAQ.
 *    1.1. Liens références: https://www.saq.com/fr/produits/vin.
 * 2. Gestion des erreurs avec tentatives de réessai —
 *    Stratégies de retry utilisées pour robustesse des requêtes HTTP.
 *    2.1. Liens références: https://medium.com/@yshen4/javascript-fetch-with-retry-fb7e2e8f8cad.
 * 3. Filtrage des attributs —
 *    Sélection des attributs à conserver selon exigences métier.
 *    3.1. Liens références: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/filter.
 * 4. Utilisation de fetch —
 *    API Fetch pour effectuer des requêtes HTTP (MDN Web Docs).
 *    4.1. Liens références: https://developer.mozilla.org/fr/docs/Web/API/Fetch_API/Using_Fetch.
 * 5. Utilisation de dotenv —
 *    Gestion des variables d'environnement via dotenv.
 *    5.1. Liens références: https://www.npmjs.com/package/dotenv.
 * 6. Utilisation de fs et path —
 *    Gestion des fichiers et des chemins (Node.js fs & path).
 *    6.1. Liens références:
 *          1.https://nodejs.org/api/fs.html et
 *          2.https://nodejs.org/api/path.html.
 * 7. fileURLToPath et ES Modules —
 *    Conversion d'URL de fichiers pour compatibilité ESModule.
 *    7.1. Liens références: https://nodejs.org/api/url.html#url_fileurltopath_url.
 * 8. Structure et style du code —
 *    Bonnes pratiques générales (par ex., guide d'Airbnb) —
 *    8.1. Liens références: https://github.com/airbnb/javascript.
 * Objectif:
 * Récupérer tous les vins de la SAQ via leur API GraphQL,
 * nettoyer les données pour ne conserver que les attributs pertinents,
 * et sauvegarder le résultat dans un fichier JSON.
 */

import "dotenv/config";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Requête GraphQL pour rechercher des produits
const URL_GRAPHQL =
  process.env.SAQ_API_URL || "https://catalog-service.adobe.io/graphql";
const ENTETES = {
  "Content-Type": "application/json",
  "x-api-key": process.env.SAQ_API_KEY || "7a7d7422bd784f2481a047e03a73feaf",
  "magento-store-code": process.env.SAQ_STORE_CODE || "main_website_store",
  "magento-store-view-code": process.env.SAQ_STORE_VIEW_CODE || "fr",
  "magento-website-code": process.env.SAQ_WEBSITE_CODE || "base",
  "magento-environment-id":
    process.env.SAQ_ENV_ID || "2ce24571-9db9-4786-84a9-5f129257ccbb",
  "magento-customer-group":
    process.env.SAQ_CUSTOMER_GROUP ||
    "b6589fc6ab0dc82cf12099d1c2d40ab994e8410c",
};

if (!process.env.SAQ_API_KEY) {
  console.warn(
    "Avertissement: La variable d'environnement SAQ_API_KEY n'est pas définie. Utilisation de la clé par défaut."
  );
}

// Requête GraphQL pour rechercher des produits
const query = `
  query productSearch(
    $phrase: String!,
    $page_size: Int,
    $current_page: Int,
    $filter: [SearchClauseInput!]
  ) {
    productSearch(
      phrase: $phrase,
      page_size: $page_size,
      current_page: $current_page,
      filter: $filter
    ) {
      total_count
      items {
        product {
          name
          sku
          image { url }
          price_range {
            minimum_price {
              final_price { value currency }
            }
          }
        }
        productView {
          sku
          name
          inStock
          attributes { label name value }
        }
      }
      page_info { current_page page_size total_pages }
    }
  }
`;

// Liste des attributs à conserver
const conserverAttributs = [
  "pays_origine",
  "couleur",
  "cepage",
  "millesime_produit",
  "pourcentage_alcool_par_volume",
  "taux_sucre",
  "pastille_gout",
  "format_contenant_ml",
  "region_origine",
  "designation_reglementee",
  "identite_produit",
  "gamme_marketing",
  "nom_producteur",
];

// Fonction pour filtrer les attributs du produit
const filtrerAttributs = (attributes) => {
  if (!Array.isArray(attributes)) return [];
  return attributes.filter((a) => conserverAttributs.includes(a.name));
};

const filtresCommuns = [
  { attribute: "categoryPath", eq: "produits/vin" },
  { attribute: "visibility", in: ["Catalog, Search", "Catalog"] },
  {
    attribute: "availability_front",
    in: [
      "En ligne",
      "En succursale",
      "Disponible bientôt",
      "Bientôt en loterie",
      "En loterie",
    ],
  },
  { attribute: "catalog_type", in: ["1"] },
];

const genererPlageMillesimes = (debut = 1950) => {
  const range = [];
  const maximum = new Date().getFullYear() + 2;
  for (let annee = maximum; annee >= debut; annee -= 1) {
    range.push(annee);
  }
  return range;
};

/**
 * Récupère tous les vins de la SAQ via l'API GraphQL.
 * @param {Object} [options] - Options de filtrage.
 * @param {Array<number>} [options.millesimes] - Liste des millésimes à récupérer (par défaut: 1950 à année actuelle + 2).
 * @returns {Promise<Array>} Liste des produits dédupliqués par SKU.
 */
export const recupererTousVins = async (options = {}) => {
  const millesimesOption = Array.isArray(options.millesimes)
    ? options.millesimes.filter(Boolean)
    : [];
  const millesimes = millesimesOption.length
    ? millesimesOption
    : genererPlageMillesimes();
  const produitsParSku = new Map();
  const TAILLE_PAGE = 100;
  const REQUETES_PARALLELES = 10;

  // Fonction pour récupérer une page spécifique
  const recupererPage = async (pageNum, filtres) => {
    const body = JSON.stringify({
      query,
      variables: {
        phrase: "",
        page_size: TAILLE_PAGE,
        current_page: pageNum,
        filter: filtres,
        sort: [{ attribute: "position", direction: "ASC" }],
      },
    });

    // Effectuer la requête HTTP
    try {
      const res = await fetch(URL_GRAPHQL, {
        method: "POST",
        headers: ENTETES,
        body,
      });

      if (!res.ok)
        return { errors: [{ message: `Erreur HTTP, status: ${res.status}` }] };
      return res.json();
    } catch (err) {
      return { errors: [{ message: err.message || String(err) }] };
    }
  };

  const TENTATIVES_MAX = 3;
  const DELAI_REESSAI = 1000;

  // Fonction pour récupérer une page avec des tentatives de réessai en cas d'erreur
  const recupererPageAvecRetry = async (pageNum, filtres, tentatives = 0) => {
    const resultat = await recupererPage(pageNum, filtres);
    if (resultat.errors && tentatives < TENTATIVES_MAX) {
      await new Promise((resolve) =>
        setTimeout(resolve, DELAI_REESSAI * Math.pow(2, tentatives))
      );
      return recupererPageAvecRetry(pageNum, filtres, tentatives + 1);
    }
    return resultat;
  };

  const accumulate = (items) => {
    for (const item of items) {
      const sku = item?.productView?.sku || item?.product?.sku;
      if (!sku || produitsParSku.has(sku)) continue;
      produitsParSku.set(sku, item);
    }
  };

  const groupes = [...millesimes, null];

  for (const millesime of groupes) {
    const filtres = [...filtresCommuns];
    if (millesime) {
      filtres.unshift({
        attribute: "millesime_produit",
        in: [String(millesime)],
      });
    }

    const etiquette = millesime ? `millesime ${millesime}` : "sans filtre millésime";
    console.log(`Démarrage récupération (${etiquette})...`);

    const premiereReponse = await recupererPageAvecRetry(1, filtres);
    if (premiereReponse.errors) {
      console.error(
        `Erreur GraphQL (${etiquette}):`,
        JSON.stringify(premiereReponse.errors, null, 2)
      );
      continue;
    }
    if (!premiereReponse.data) {
      console.error(`Erreur: aucune donnée reçue (${etiquette})`);
      continue;
    }

    const premiereDonnees = premiereReponse.data.productSearch;
    accumulate(premiereDonnees.items);
    const pagesTotales = premiereDonnees.page_info.total_pages;

    for (
      let debut = 2;
      debut <= pagesTotales;
      debut += REQUETES_PARALLELES
    ) {
      const pagePromises = [];
      for (
        let decalage = 0;
        decalage < REQUETES_PARALLELES && debut + decalage <= pagesTotales;
        decalage++
      ) {
        pagePromises.push(
          recupererPageAvecRetry(debut + decalage, filtres)
        );
      }

      const resultats = await Promise.all(pagePromises);
      for (let idx = 0; idx < resultats.length; idx++) {
        const json = resultats[idx];
        if (json.errors) {
          console.error(
            `Erreur GraphQL page ${debut + idx} (${etiquette}):`,
            JSON.stringify(json.errors, null, 2)
          );
          continue;
        }
        if (!json.data) {
          console.error(
            `Erreur: aucune donnée page ${debut + idx} (${etiquette})`
          );
          continue;
        }
        const data = json.data.productSearch;
        console.log(
          `Récupéré page ${debut + idx} / ${pagesTotales} (${etiquette})`
        );
        accumulate(data.items);
      }
    }
    console.log(
      `Récupération terminée pour ${etiquette} (${produitsParSku.size} uniques cumulés).`
    );
  }

  return Array.from(produitsParSku.values());
};

// Fonction pour récupérer et sauvegarder les données nettoyées dans un fichier JSON
export const recupererEtSauvegarder = async (cheminSortie) => {
  const tousVins = await recupererTousVins();
  const nettoyes = tousVins.map((article) => {
    const vue = article.productView;
    return {
      sku: vue?.sku,
      name: vue?.name,
      inStock: vue?.inStock,
      attributes: filtrerAttributs(vue?.attributes),
      image: article.product?.image?.url,
      price: article.product?.price_range?.minimum_price?.final_price?.value,
    };
  });

  // Sauvegarde dans un fichier JSON
  const out =
    cheminSortie || join(__dirname, "..", "..", "data", "saq-cleaned.json");
  writeFileSync(out, JSON.stringify(nettoyes), "utf8");
  console.log(
    `Fichier exporté : ${out} (${nettoyes.length} produits nettoyés)`
  );
  return nettoyes;
};
// Permet d'exécuter ce fichier directement pour récupérer et sauvegarder les données
if (fileURLToPath(import.meta.url) === process.argv[1]) {
  recupererEtSauvegarder().catch((err) => {
    console.error("Erreur recupererEtSauvegarder:", err.message || err);
    process.exit(1);
  });
}
