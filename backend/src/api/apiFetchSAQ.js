// apiFetchSAQ.js
// Récupère toutes les bouteilles de vin SAQ via GraphQL et nettoie les attributs inutiles.

// Charger .env local pour les variables SAQ_* si présentes
import "dotenv/config";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const URL_GRAPHQL =
  process.env.SAQ_API_URL || "https://catalog-service.adobe.io/graphql";
const ENTETES = {
  "Content-Type": "application/json",
  // Clé API nécessaire pour accéder au catalogue SAQ (si non fournie,
  // on utilise l'ancienne valeur par défaut pour compatibilité)
  "x-api-key": process.env.SAQ_API_KEY || "7a7d7422bd784f2481a047e03a73feaf",
  // Codes magasin / magasin-view / website peuvent varier d'un environnement à l'autre
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
    "Avertissement: La variable d'environnement SAQ_API_KEY n'est pas définie. Utilisation de la clé par défaut. Cela peut entraîner des erreurs si la clé par défaut est invalide.\n"
  );
}

// --- Requête GraphQL ---
const requete = `
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

// --- Liste des attributs utiles ---
/**
 * Filtre les attributs d'un produit et ne conserve que ceux utiles.
 *
 * @param {Array<{name: string, label?: string, value?: any}>} attributes
 * @returns {Array<{name: string, label?: string, value?: any}>} attributs filtrés
 */
const filtrerAttributs = (attributes) => {
  if (!Array.isArray(attributes)) return [];
  const keep = [
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
  return attributes.filter((a) => keep.includes(a.name));
};

// --- Récupération paginée ---
/**
 * Récupère tous les produits (vins) via l'API GraphQL en pagination.
 * Utilise des requêtes parallèles par lot pour accélérer la récupération.
 *
 * @returns {Promise<Array>} tableau des items de produit récupérés (raw)
 */
const recupererTousVins = async () => {
  const tousProduits = [];
  const TAILLE_PAGE = 100; // Taille de page recommandée
  const REQUETES_PARALLELES = 10; // Nombre de requêtes parallèles par lot

  console.log("Démarrage de la récupération des vins SAQ...");

  /**
   * Récupère une page de résultats depuis le service GraphQL.
   * Retourne l'objet JSON exposé par l'API ou un objet { errors: [...] } en cas d'échec réseau.
   *
   * @param {number} pageNum numéro de page (1-based)
   * @returns {Promise<object>} réponse JSON de l'API (ou structure d'erreur)
   */
  const recupererPage = async (pageNum) => {
    const body = JSON.stringify({
      query: requete,
      variables: {
        phrase: "",
        page_size: TAILLE_PAGE,
        current_page: pageNum,
        filter: [
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
        ],
        sort: [{ attribute: "position", direction: "ASC" }],
      },
    });

    try {
      const res = await fetch(URL_GRAPHQL, {
        method: "POST",
        headers: ENTETES,
        body,
      });

      if (!res.ok) {
        return { errors: [{ message: `Erreur HTTP, status: ${res.status}` }] };
      }

      return res.json();
    } catch (err) {
      // Normaliser l'erreur pour que le reste du code puisse la consommer
      return { errors: [{ message: err.message || String(err) }] };
    }
  };

  // Wrapper de réessai pour recupererPage avec backoff exponentiel
  const TENTATIVES_MAX = 3;
  const DELAI_REESSAI = 1000; // 1 seconde

  const recupererPageAvecRetry = async (pageNum, tentatives = 0) => {
    const resultat = await recupererPage(pageNum);

    if (resultat.errors && tentatives < TENTATIVES_MAX) {
      await new Promise((resolve) =>
        setTimeout(resolve, DELAI_REESSAI * Math.pow(2, tentatives))
      );
      return recupererPageAvecRetry(pageNum, tentatives + 1);
    }

    return resultat;
  };

  // Première requête pour obtenir le nombre total de pages
  const premiereReponse = await recupererPageAvecRetry(1);

  if (premiereReponse.errors) {
    console.error(
      "Erreur GraphQL:",
      JSON.stringify(premiereReponse.errors, null, 2)
    );
    return tousProduits;
  }

  if (!premiereReponse.data) {
    console.error("Erreur: Aucune donnée reçue de l'API");
    return tousProduits;
  }

  const premiereDonnees = premiereReponse.data.productSearch;
  if (!premiereDonnees) return tousProduits;

  tousProduits.push(...premiereDonnees.items);
  const pagesTotales = premiereDonnees.page_info.total_pages;

  console.log(`Page 1/${pagesTotales} - ${tousProduits.length} vins cumulés`);

  // Récupération des pages restantes en parallèle
  for (let debut = 2; debut <= pagesTotales; debut += REQUETES_PARALLELES) {
    const pagePromises = [];
    for (
      let decalage = 0;
      decalage < REQUETES_PARALLELES && debut + decalage <= pagesTotales;
      decalage++
    ) {
      pagePromises.push(recupererPageAvecRetry(debut + decalage));
    }

    const results = await Promise.all(pagePromises);

    for (let idx = 0; idx < results.length; idx++) {
      const json = results[idx];
      if (json.errors) {
        console.error("Erreur GraphQL:", JSON.stringify(json.errors, null, 2));
        continue;
      }

      if (!json.data) {
        console.error("Erreur: Aucune donnée reçue pour la page");
        continue;
      }

      const data = json.data.productSearch;
      if (!data) {
        console.error(
          "Erreur: structure 'productSearch' manquante dans la réponse"
        );
        continue;
      }

      if (data) {
        tousProduits.push(...data.items);
        console.log(
          `Page ${debut + idx}/${pagesTotales} - ${
            tousProduits.length
          } vins cumulés`
        );
      }
    }
  }
  console.log(`\nRécupération terminée (${tousProduits.length} produits).`);
  return tousProduits;
};

// --- Programme principal ---
(async () => {
  try {
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

    const outputPath = join(__dirname, "..", "..", "data", "saq-cleaned.json");
    writeFileSync(outputPath, JSON.stringify(nettoyes), "utf8");
    console.log(
      `\n Fichier exporté : ${outputPath} (${nettoyes.length} produits nettoyés)`
    );
  } catch (err) {
    console.error("Échec :", err.message || err);
  }
})();
