// apiFetchSAQ.js
// Récupère toutes les bouteilles de vin SAQ via GraphQL et nettoie les attributs inutiles.

import { writeFileSync } from "fs";

const URL_GRAPHQL = "https://catalog-service.adobe.io/graphql";
const ENTETES = {
  "Content-Type": "application/json",
  "x-api-key": "7a7d7422bd784f2481a047e03a73feaf",
  "magento-store-code": "main_website_store",
  "magento-store-view-code": "fr",
  "magento-website-code": "base",
  "magento-environment-id": "2ce24571-9db9-4786-84a9-5f129257ccbb",
  "magento-customer-group": "b6589fc6ab0dc82cf12099d1c2d40ab994e8410c",
};

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
}

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

  console.log("🔍 Démarrage de la récupération des vins SAQ...");

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
        return { errors: [{ message: `HTTP error! status: ${res.status}` }] };
      }
      return res.json();
    } catch (err) {
      // Normaliser l'erreur pour que le reste du code puisse la consommer
      return { errors: [{ message: err.message || String(err) }] };
    }
  };

  // Première requête pour obtenir le nombre total de pages
  const premiereReponse = await recupererPage(1);

  if (premiereReponse.errors) {
    console.error(
      "Erreur GraphQL:",
      JSON.stringify(premiereReponse.errors, null, 2)
    );
    return tousProduits;
  }

  const premiereDonnees = premiereReponse.data.productSearch;
  if (!premiereDonnees) return tousProduits;

  tousProduits.push(...premiereDonnees.items);
  const pagesTotales = premiereDonnees.page_info.total_pages;

  console.log(`✅ Page 1/${pagesTotales} - ${tousProduits.length} vins cumulés`);

  // Récupération des pages restantes en parallèle
  for (let debut = 2; debut <= pagesTotales; debut += REQUETES_PARALLELES) {
    const pagePromises = [];
    for (
      let decalage = 0;
      decalage < REQUETES_PARALLELES && debut + decalage <= pagesTotales;
      decalage++
    ) {
      pagePromises.push(recupererPage(debut + decalage));
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
      if (data) {
        tousProduits.push(...data.items);
        console.log(
          `✅ Page ${debut + idx}/${pagesTotales} - ${tousProduits.length} vins cumulés`
        );
      }
    }
  }
  console.log(`\n🏁 Récupération terminée (${tousProduits.length} produits).`);
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

    writeFileSync(
      "saq-cleaned.json",
      JSON.stringify(nettoyes),
      "utf8"
    );
    console.log(
      `\n💾 Fichier exporté : saq-cleaned.json (${nettoyes.length} produits nettoyés)`
    );
  } catch (err) {
    console.error("❌ Échec :", err.message || err);
  }
})();
