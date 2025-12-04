/**
 * @source backend/src/controllers/controller.bouteille.js
 * Objectif:
 * Orchestrer les flux REST autour du domaine bouteille et exposer
 * explicitement dependances et reponses attendues.
 */

import modeleBouteille from "../models/modele.bouteille.js";

export const listerBouteilles = async (req, res) => {
  try {
    // 1) Lire les paramètres depuis l'URL ?page=1&limit=10&type=rouge&pays=France&recherche=merlot&tri=nom_asc
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const tri = req.query.tri || "nom_asc"; // nom_asc ou nom_desc

    // 2) Valider qu'ils sont corrects
    if (
      !Number.isInteger(page) ||
      page <= 0 ||
      !Number.isInteger(limit) ||
      limit <= 0
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Paramètres page/limit invalides" });
    }

    // 3) Construire les filtres à partir des query params
    const filtres = {};
    if (req.query.type) filtres.type = req.query.type;
    if (req.query.pays) filtres.pays = req.query.pays;
    if (req.query.region) filtres.region = req.query.region;
    if (req.query.annee) filtres.annee = req.query.annee;
    if (req.query.recherche) filtres.recherche = req.query.recherche;

    // 4) Utiliser la méthode optimisée avec filtres et pagination côté SQL
    const resultat = await modeleBouteille.trouverAvecFiltres({
      page,
      limit,
      filtres,
      tri,
    });

    return res.status(200).json({
      success: true,
      donnees: resultat.donnees,
      meta: {
        page,
        limit,
        total: resultat.total,
        hasMore: resultat.hasMore,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des bouteilles", error);
    return res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

/**
 * Récupère les options de filtres disponibles (types, pays, régions, années)
 */
export const recupererOptionsFiltres = async (req, res) => {
  try {
    const options = await modeleBouteille.recupererOptionsFiltres();
    return res.status(200).json({
      success: true,
      ...options,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des options de filtres", error);
    return res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

export const recupererBouteille = async (req, res) => {
  try {
    const { id } = req.params;
    const identifiant = Number.parseInt(id, 10);
    if (!Number.isInteger(identifiant) || identifiant <= 0) {
      return res.status(400).json({
        message: "Identifiant de bouteille invalide",
      });
    }

    const bouteille = await modeleBouteille.trouverParId(identifiant);
    if (!bouteille) {
      return res.status(404).json({
        message: "Bouteille introuvable",
      });
    }

    return res.status(200).json({
      message: "Bouteille récupérée",
      donnees: bouteille,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération d'une bouteille", error);
    return res.status(500).json({
      message: "Impossible de récupérer la bouteille",
      erreur: error.message,
    });
  }
};

export const creerBouteille = async (req, res) => {
  try {
    const action = await modeleBouteille.creer(req.body);

    // Si la création ou la mise à jour a réussi
    return res.status(action === "insert" ? 201 : 200).json({
      success: true,
      action,
      message:
        action === "insert"
          ? "Bouteille créée avec succès"
          : "Bouteille mise à jour avec succès",
    });
    // Sinon, gérer les erreurs
  } catch (error) {
    console.error("Erreur lors de la création d'une bouteille", error);

    return res.status(400).json({
      success: false,
      message: "Impossible de créer la bouteille",
    });
  }
};

export const modifierBouteille = async (req, res) => {
  try {
    // Obtiens le id et validation que c'est en int et non string
    const { id } = req.params;
    const identifiant = Number.parseInt(id, 10);

    if (!Number.isInteger(identifiant) || identifiant <= 0) {
      return res.status(400).json({
        message: "Identifiant de bouteille invalide",
      });
    }
    // Enregistre l'action dans une variable en passant req.body (Données entrées par le client)
    const action = await modeleBouteille.mettreAJour(identifiant, req.body);

    // Si l'action ne retourne pas de résultat, retourne un message d'erreur
    if (!action) {
      return res.status(404).json({
        message: "Bouteille introuvable ou aucune modification effectuée",
      });
    }

    // Si tout est OK, retourne message de succès
    return res.status(200).json({
      success: true,
      action,
      message: "Bouteille modifié avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la modification d'une bouteille", error);

    return res.status(400).json({
      success: false,
      message: "Impossible de modifier la bouteille",
    });
  }
};

export const supprimerBouteille = async (req, res) => {
  try {
    // Récupère et valide l'identifiant
    const { id } = req.params;
    const identifiant = Number.parseInt(id, 10);

    if (!Number.isInteger(identifiant) || identifiant <= 0) {
      return res.status(400).json({
        message: "Identifiant de bouteille invalide",
      });
    }

    // Applique la requête SQL
    const resultat = await modeleBouteille.supprimer(identifiant);

    // Si retourne faux, retourne un message d'erreur, sinon on envoie la requête
    if (!resultat) {
      return res.status(404).json({
        message: "Bouteille introuvable ou déjà supprimée",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Bouteille supprimée avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression d'une bouteille", error);
    return res.status(500).json({
      message: "Impossible de supprimer la bouteille",
    });
  }
};

export const rechercherBouteilleParAttributs = async (req, res) => {
  try {
    const { nom, region, cepage, pays, type } = req.query;

    const filtresBruts = {
      nom,
      region,
      cepage,
      pays,
      type,
    };

    const filtres = Object.entries(filtresBruts).reduce(
      (acc, [cle, valeur]) => {
        if (typeof valeur === "string") {
          const nettoye = valeur.trim();
          if (nettoye) acc[cle] = nettoye;
        }
        return acc;
      },
      {}
    );

    if (!Object.keys(filtres).length) {
      return res.status(400).json({
        message:
          "Au moins un attribut (nom, région, cépage, pays, type) est requis",
      });
    }

    const bouteilles = await modeleBouteille.trouverParAttributs(filtres);
    if (!bouteilles.length) {
      return res.status(404).json({
        message: "Aucune bouteille ne correspond aux attributs fournis",
      });
    }

    return res.status(200).json({
      message: "Bouteilles correspondant aux attributs",
      total: bouteilles.length,
      donnees: bouteilles,
    });
  } catch (error) {
    console.error("Erreur lors de la recherche par attributs", error);
    return res.status(500).json({
      message: "Impossible de rechercher les bouteilles",
      erreur: error.message,
    });
  }
};

/**
 * Déclenche l'import SAQ en passant une limite optionnelle (query ou body).
 */
export const importerBouteillesDepuisSAQ = async (req, res) => {
  try {
    const limiteBrute = req.query.limite ?? req.body?.limite;
    const limite = Number.parseInt(limiteBrute, 10);
    const resultat = await modeleBouteille.importerDepuisEnregistrementsSaq({
      limite: Number.isInteger(limite) && limite > 0 ? limite : undefined,
    });

    return res.status(201).json({
      message: "Importation des bouteilles SAQ complétée",
      resultat,
    });
  } catch (error) {
    console.error("Erreur lors de l'import SAQ", error);
    return res.status(500).json({
      message: "Impossible d'importer les bouteilles depuis la SAQ",
      erreur: error.message,
    });
  }
};
