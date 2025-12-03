// Ce fichier regroupe toutes les fonctions permettant de communiquer avec le backend.
import authentificationStore from "@store/authentificationStore";
import bouteillesStore from "@store/bouteillesStore";

// *************************** Utilisateur
/**
 * Crée un nouvel utilisateur dans la base de données via l'API backend.
 * Connecte automatiquement l'utilisateur et le redirige vers le catalogue en cas de succès.
 * @param {Object} datas - Les données de l'utilisateur à créer
 * @param {Function} navigate - Fonction de navigation de react-router-dom pour rediriger l'utilisateur
 * @returns {Promise<{succes: boolean, erreur?: Object|string}>} Un objet indiquant le succès de l'opération et l'erreur éventuelle
 */
export const creerUtilisateur = async (datas, navigate) => {
  try {
    const reponse = await fetch(
      `${import.meta.env.VITE_BACKEND_UTILISATEUR_URL}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datas),
      }
    );

    if (reponse.ok) {
      const data = await reponse.json();
      const utilisateurCree = data?.utilisateur; // renverra simplement undefined
      //ref https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Optional_chaining

      if (utilisateurCree) {
        const datasUtilisateur = {
          id: utilisateurCree.id_utilisateur,
          nom: utilisateurCree.nom,
          courriel: utilisateurCree.courriel,
        };

        authentificationStore.getState().connexion(datasUtilisateur);
        bouteillesStore.getState().chargerBouteilles();
      }

      navigate("/catalogue");
      return { succes: true, utilisateur: utilisateurCree };
    }

    // Gestion des erreurs HTTP (400, 500, etc.)
    const erreurData = await reponse.json().catch(() => ({}));
    console.error("Erreur HTTP:", reponse.status, erreurData);

    // Gestion spécifique selon le code d'erreur
    if (reponse.status === 409) {
      // Conflit : courriel déjà utilisé
      navigate("/inscription?echec=2");
    } else {
      navigate("/inscription?echec=1");
    }
    return { succes: false, erreur: erreurData };
  } catch (error) {
    // Gestion des erreurs réseau (exemple: pas de connexion) ou autres exceptions JavaScript
    console.error("Erreur lors de la création de l'utilisateur :", error);
    navigate("/inscription?echec=1");
    return { succes: false, erreur: error.message };
  }
};

/**
 * Récupère les informations d'un utilisateur par son identifiant via l'API backend.
 * @param {string|number} id - L'identifiant unique de l'utilisateur à récupérer
 * @returns {Promise<Object|null>} Les données de l'utilisateur ou null en cas d'erreur
 */
export const recupererUtilisateur = async (id) => {
  try {
    const reponse = await fetch(
      `${import.meta.env.VITE_BACKEND_UTILISATEUR_URL}/${id}`
    );
    return reponse.json();
  } catch (error) {
    console.log(error);
  }
};

/**
 * Modifie les informations d'un utilisateur existant dans la base de données via l'API backend.
 * Redirige vers la page de profil en cas de succès ou vers la page de modification en cas d'erreur.
 * @param {Object} datas - Les données de l'utilisateur à modifier
 * @param {Function} navigate - Fonction de navigation de react-router-dom pour rediriger l'utilisateur
 * @returns {Promise<{succes: boolean, erreur?: Object|string}>} Un objet indiquant le succès de l'opération et l'erreur éventuelle
 */
export const modifierUtilisateur = async (datas, navigate) => {
  try {
    const reponse = await fetch(
      `${import.meta.env.VITE_BACKEND_UTILISATEUR_URL}/${datas.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datas),
      }
    );
    if (reponse.ok) {
      // Mettre à jour l'utilisateur dans le store avec les nouvelles données
      const datasUtilisateur = {
        id: datas.id,
        nom: datas.nom,
        courriel: datas.courriel,
      };
      authentificationStore.getState().connexion(datasUtilisateur);
      navigate(`/profil?succes=true`);
      return { succes: true };
    }

    // Gestion des erreurs HTTP (400, 500, etc.)
    const erreurData = await reponse.json().catch(() => ({}));
    console.error("Erreur HTTP:", reponse.status, erreurData);

    if (reponse.status === 409) {
      // Conflit : courriel déjà utilisé
      navigate(`/modifier-utilisateur/${datas.id}?echec=2`);
    } else {
      navigate(`/modifier-utilisateur/${datas.id}?echec=1`);
    }

    return {
      succes: false,
      erreur: erreurData?.message || "Erreur lors de la modification",
    };
  } catch (error) {
    // Gestion des erreurs réseau (exemple: pas de connexion) ou autres exceptions JavaScript
    console.error("Erreur lors de la modification de l'utilisateur :", error);
    navigate(`/modifier-utilisateur/${datas.id}?echec=1`);
    return { succes: false, erreur: error.message };
  }
};

/**
 * Supprime un utilisateur de la base de données via l'API backend.
 * Redirige vers la page de connexion en cas de succès ou affiche une erreur en cas d'échec.
 * @param {string|number} id - L'identifiant unique de l'utilisateur à supprimer
 * @param {Function} navigate - Fonction de navigation de react-router-dom pour rediriger l'utilisateur
 * @returns {Promise<{succes: boolean, erreur?: Object|string}>} Un objet indiquant le succès de l'opération et l'erreur éventuelle
 */
export const supprimerUtilisateur = async (id, navigate) => {
  try {
    console.log(
      "Requête DELETE vers:",
      `${import.meta.env.VITE_BACKEND_UTILISATEUR_URL}/${id}`
    );

    const reponse = await fetch(
      `${import.meta.env.VITE_BACKEND_UTILISATEUR_URL}/${id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("Réponse du serveur:", reponse.status, reponse.statusText);

    if (reponse.ok) {
      // Déconnecter l'utilisateur du store
      authentificationStore.getState().deconnexion();
      navigate(`/?supprimerSucces=true`);
      return { succes: true };
    } else {
      // Gestion des erreurs HTTP
      const erreurData = await reponse.json().catch(() => ({}));
      console.error(
        "Erreur HTTP lors de la suppression:",
        reponse.status,
        erreurData
      );

      // Rediriger vers le profil avec un message d'erreur
      navigate(`/profil?echecSuppression=true`);
      return { succes: false, erreur: erreurData };
    }
  } catch (error) {
    // Gestion des erreurs réseau (exemple: pas de connexion) ou autres exceptions JavaScript
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
    navigate(`/profil?echecSuppression=true`);
    return { succes: false, erreur: error.message };
  }
};

// Fonction connexionUtilisateur
export const connexionUtilisateur = async (datas, navigate) => {
  try {
    const reponse = await fetch(
      `${import.meta.env.VITE_BACKEND_UTILISATEUR_URL}/connexion`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datas),
      }
    );

    if (reponse.ok) {
      const data = await reponse.json();
      const datasUtilisateur = {
        id: data.utilisateur.id_utilisateur,
        nom: data.utilisateur.nom,
        courriel: data.utilisateur.courriel,
      };

      // Sauvegarder l'utilisateur dans le store
      authentificationStore.getState().connexion(datasUtilisateur);

      // Charger les bouteilles une seule fois au moment de la connexion
      bouteillesStore.getState().chargerBouteilles();

      // Rediriger vers la page catalogue après connexion
      navigate("/catalogue");

      return { succes: true, utilisateur: data.utilisateur };
    } else {
      // Gestion des erreurs HTTP (400, 401, 500, etc.)
      const erreurData = await reponse.json().catch(() => ({}));
      console.error("Erreur HTTP:", reponse.status, erreurData);

      return {
        succes: false,
        erreur: erreurData.message || "Erreur lors de la connexion",
      };
    }
  } catch (error) {
    console.error("Erreur lors de la connexion de l'utilisateur :", error);
    return {
      succes: false,
      erreur: "Erreur de connexion au serveur",
    };
  }
};

// *************************** Bouteille Cellier

// Fonction d'ajout d'une bouteille dans un cellier
export const ajouterBouteilleCellier = async (idCellier, donnees) => {
  try {
    const urlComplete = `${
      import.meta.env.VITE_BACKEND_BOUTEILLES_CELLIER_URL
    }/${idCellier}`;
    const reponse = await fetch(urlComplete, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(donnees),
    });

    const data = await reponse.json();

    if (reponse.ok) {
      return { succes: true, donnees: data };
    }

    return {
      succes: false,
      erreur: data.message || "Erreur lors de l'ajout de la bouteille",
    };
  } catch (error) {
    //Erreur Réseau
    return {
      succes: false,
      erreur: "Le serveur ne répond pas.",
    };
  }
};

/**
 * Récupère les bouteilles d'un cellier en récupérant les IDs depuis le backend
 * et en complétant avec les données du store bouteillesStore
 * @param {string|number} idCellier - L'id du cellier
 * @returns {Promise<Array>} Array des bouteilles complètes avec quantités
 */
export const recupererBouteillesCellier = async (idCellier) => {
  try {
    // 1. Récupérer les IDs et quantités depuis le backend
    const reponse = await fetch(
      `${import.meta.env.VITE_BACKEND_BOUTEILLES_CELLIER_URL}/${idCellier}`
    );

    if (!reponse.ok) {
      throw new Error(`Erreur HTTP: ${reponse.status}`);
    }

    const data = await reponse.json();
    const bouteillesIds = data.donnees || []; // [{ id_bouteille, quantite }, ...]

    // 2. Récupérer les infos bouteilles du store
    const bouteillesCatalogue = bouteillesStore.getState().bouteilles;

    // 3. Fusionner toutes les datas - ne retourner que les bouteilles de ce cellier
    const bouteillesCompletes = bouteillesIds
      .map((item) => {
        // item: { id_bouteille, quantite }
        const bouteilleCatalogue = bouteillesCatalogue.find(
          (b) => b.id === item.id_bouteille
        );

        // Ne retourner que si la bouteille existe dans le store
        if (!bouteilleCatalogue) return null;

        return {
          ...bouteilleCatalogue, // Copie des infos du catalogue pour la bouteille
          quantite: item.quantite, // + la quantite
          idCellier: Number.parseInt(idCellier, 10), // Ajouter l'idCellier pour référence
        };
      })
      .filter(Boolean); // Retire les null - garde que les bouteilles trouvées

    // Retourner uniquement les bouteilles qui sont dans ce cellier
    return bouteillesCompletes;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des bouteilles du cellier :",
      error
    );
    return [];
  }
};

/**
 * Modifie les informations d'un cellier existant dans la base de données.
 * Redirige vers la page de sommaire celliers.
 * @param {string|number} id_bouteille - Id bouteille
 * @param {string|number} id_cellier - Id du cellier à modifier
 * @param {string|number} nouvelleQuantite - quantite e bouteille a modifier
 * @param {Function} navigate - Fonction de navigation de react-router-dom pour rediriger l'utilisateur
 * @returns {Promise<>} Un objet indiquant le succès de l'opération et l'erreur éventuelle
 */
export const modifierBouteilleCellier = async (
  id_cellier,
  id_bouteille,
  nouvelleQuantite
) => {
  try {
    const quantiteCible = Math.max(
      0,
      Number.parseInt(nouvelleQuantite, 10) || 0
    );

    if (quantiteCible === 0) {
      const reponse = await fetch(
        `${
          import.meta.env.VITE_BACKEND_BOUTEILLES_CELLIER_URL
        }/${id_cellier}/${id_bouteille}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (reponse.ok) {
        return { succes: true, supprime: true };
      }

      const erreurData = await reponse.json().catch(() => ({}));
      console.error(
        "Erreur HTTP lors de la suppression:",
        reponse.status,
        erreurData
      );
      return {
        succes: false,
        erreur:
          erreurData?.message ||
          "Erreur lors de la suppression de la bouteille du cellier",
      };
    }

    const reponse = await fetch(
      `${
        import.meta.env.VITE_BACKEND_BOUTEILLES_CELLIER_URL
      }/${id_cellier}/${id_bouteille}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nouvelleQuantite: quantiteCible }),
      }
    );

    if (reponse.ok) {
      return { succes: true, supprime: false, quantite: quantiteCible };
    }

    const erreurData = await reponse.json().catch(() => ({}));
    console.error("Erreur HTTP:", reponse.status, erreurData);

    return {
      succes: false,
      erreur:
        erreurData?.message ||
        "Erreur lors de la modification de la bouteille dans le cellier",
    };
  } catch (error) {
    console.error(
      "Erreur lors de la modification de la bouteille dans le cellier :",
      error
    );
    return { succes: false, erreur: error.message };
  }
};

/**
 * Vérifie si une bouteille existe déjà dans un cellier spécifique
 * @param {string|number} idCellier - L'identifiant du cellier
 * @param {string|number} idBouteille - L'identifiant de la bouteille
 * @returns {Promise<{existe: boolean, quantite: number}>} Objet indiquant si la bouteille existe et sa quantité
 */
export const verifierBouteilleCellier = async (idCellier, idBouteille) => {
  try {
    const reponse = await fetch(
      `${import.meta.env.VITE_BACKEND_BOUTEILLES_CELLIER_URL}/${idCellier}`
    );

    if (reponse.ok) {
      const data = await reponse.json();
      const bouteilles = data?.donnees || data || [];
      const bouteilleExistante = bouteilles.find(
        (b) => String(b.id_bouteille) === String(idBouteille)
      );

      if (bouteilleExistante) {
        return {
          existe: true,
          quantite: bouteilleExistante.quantite || 0,
        };
      }
    }

    return { existe: false, quantite: 0 };
  } catch (error) {
    console.error("Erreur lors de la vérification:", error);
    return { existe: false, quantite: 0 };
  }
};

// *************************** Cellier
/**
 * Récupère tous les celliers d'un utilisateur via l'API backend.
 * @param {string|number} id_utilisateur - L'id de l'utilisateur
 * @returns {Promise<Array|null>} Array des celliers de l'utilisateur ou null en cas d'erreur
 */
export const recupererTousCellier = async (id_utilisateur) => {
  try {
    const reponse = await fetch(
      `${
        import.meta.env.VITE_BACKEND_CELLIER_URL
      }?id_utilisateur=${id_utilisateur}`
    );
    return reponse.json();
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * Récupère les informations d'un cellier (nom + bouteilles)
 * @param {string|number} id_cellier - Id du cellier
 * @returns {Promise<Object|null>}
 */
export const recupererCellier = async (id_cellier) => {
  try {
    const reponse = await fetch(
      `${import.meta.env.VITE_BACKEND_CELLIER_URL}/${id_cellier}`
    );

    if (!reponse.ok) {
      throw new Error(`Erreur HTTP: ${reponse.status}`);
    }

    return await reponse.json();
  } catch (error) {
    console.error("Erreur lors de la récupération du cellier :", error);
    return null;
  }
};

/**
 * Creer un nouveau cellier pour un utilisateur.
 * @param {string|number} id_utilisateur - L'identifiant de l'utilisateur
 * @param {string} [nom] - Le nom du cellier
 * @returns {Promise<>}
 */
export const creerCellier = async (id_utilisateur, nom) => {
  try {
    const reponse = await fetch(
      `${import.meta.env.VITE_BACKEND_CELLIER_URL}/${id_utilisateur}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom,
        }),
      }
    );

    if (reponse.ok) {
      const data = await reponse.json();
      return { succes: true, id: data.id };
    }

    // Gestion des erreurs HTTP (400, 500, etc.)
    const erreurData = await reponse.json().catch(() => ({}));
    console.error("Erreur HTTP:", reponse.status, erreurData);

    return {
      succes: false,
      erreur: erreurData.message || "Erreur lors de la création du cellier",
    };
  } catch (error) {
    // Gestion des erreurs réseau (exemple: pas de connexion) ou autres exceptions JavaScript
    console.error("Erreur lors de la création du cellier :", error);
    return {
      succes: false,
      erreur: "Erreur de connexion au serveur",
    };
  }
};

/**
 * Modifie les informations d'un cellier existant dans la base de données.
 * Redirige vers la page de sommaire celliers.
 * @param {string|number} id_utilisateur - Id utilisateur
 * @param {string|number} id_cellier - Id du cellier à modifier
 * @param {string} nom - Le nouveau nom du cellier
 * @param {Function} navigate - Fonction de navigation de react-router-dom pour rediriger l'utilisateur
 * @returns {Promise<>} Un objet indiquant le succès de l'opération et l'erreur éventuelle
 */
export const modifierCellier = async (
  id_utilisateur,
  id_cellier,
  nom,
  navigate
) => {
  try {
    const reponse = await fetch(
      `${
        import.meta.env.VITE_BACKEND_CELLIER_URL
      }/${id_utilisateur}/${id_cellier}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom }),
      }
    );

    if (reponse.ok) {
      navigate(`/sommaire-cellier?succes=true`);
      return { succes: true };
    }

    // Gestion des erreurs HTTP (400, 500, etc.)
    const erreurData = await reponse.json().catch(() => ({}));
    console.error("Erreur HTTP:", reponse.status, erreurData);

    navigate(`/sommaire-cellier?echec=true`);

    return {
      succes: false,
      erreur:
        erreurData?.message || "Erreur lors de la modification du cellier",
    };
  } catch (error) {
    // Gestion des erreurs réseau (exemple: pas de connexion)
    console.error("Erreur lors de la modification du cellier :", error);
    navigate(`/sommaire-cellier?echec=true`);
    return { succes: false, erreur: error.message };
  }
};

/**
 * Supprimer un cellier existant dans la base de données.
 * Redirige vers la page de sommaire celliers.
 * @param {string|number} id_utilisateur - Id utilisateur
 * @param {string|number} id_cellier - Id du cellier à modifier
 * @param {Function} navigate - Fonction de navigation de react-router-dom pour rediriger l'utilisateur
 * @returns {Promise<>} Un objet indiquant le succès de l'opération et l'erreur éventuelle
 */
export const supprimerCellier = async (
  id_utilisateur,
  id_cellier,
  navigate
) => {
  try {
    console.log(
      "Requête DELETE vers:",
      `${
        import.meta.env.VITE_BACKEND_CELLIER_URL
      }/${id_utilisateur}/${id_cellier}`
    );

    const reponse = await fetch(
      `${
        import.meta.env.VITE_BACKEND_CELLIER_URL
      }/${id_utilisateur}/${id_cellier}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("Réponse du serveur:", reponse.status, reponse.statusText);

    if (reponse.ok) {
      navigate(`/sommaire-cellier?succes=true`);
      return { succes: true };
    } else {
      // Gestion des erreurs HTTP
      const erreurData = await reponse.json().catch(() => ({}));
      console.error(
        "Erreur HTTP lors de la suppression:",
        reponse.status,
        erreurData
      );

      // Rediriger vers le profil avec un message d'erreur
      navigate(`/sommaire-cellier?echec=true`);
      return { succes: false, erreur: erreurData };
    }
  } catch (error) {
    // Gestion des erreurs réseau (exemple: pas de connexion) ou autres exceptions JavaScript
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
    navigate(`/sommaire-cellier?echec=true`);
    return { succes: false, erreur: error.message };
  }
};

// *************************** Bouteille

/**
 * Récupère les informations d'une bouteille par son identifiant via l'API backend.
 * @param {string|number} id - L'identifiant unique d'une bouteille à récupérer
 * @returns {Promise<Object|null>} Les données de la bouteille ou null en cas d'erreur
 */
export const recupererBouteille = async (id) => {
  try {
    const reponse = await fetch(
      `${import.meta.env.VITE_BACKEND_BOUTEILLES_URL}/${id}`
    );
    return reponse.json();
  } catch (error) {
    console.log(error);
  }
};

// *************************** Bouteilles (Catalogue)
/**
 * Récupère toutes les bouteilles disponibles dans le catalogue
 * @returns {Promise<Array|null>} Array des bouteilles ou null en cas d'erreur
 */
// Récupère les bouteilles avec pagination 10 par page
export const recupererBouteilles = async (page = 1, limit = 10) => {
  try {
    const reponse = await fetch(
      `${
        import.meta.env.VITE_BACKEND_BOUTEILLES_URL
      }?page=${page}&limit=${limit}`
    );

    if (!reponse.ok) {
      throw new Error(`Erreur HTTP: ${reponse.status}`);
    }

    return await reponse.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des bouteilles:", error);
    return null;
  }
};

// **********************************************************  Liste achat
/**
 * Récupère la liste d'achat complète avec infos bouteilles
 * @param {number} id_utilisateur - L'ID de l'utilisateur
 * @returns {Promise<Array>} - La liste des bouteilles 
 */
export const recupererListeAchatComplete = async (id_utilisateur) => {
  try {
	const reponse = await fetch(
	  `${import.meta.env.VITE_BACKEND_LISTE_ACHAT_URL}/${id_utilisateur}`
	);
	
	if (!reponse.ok) {
	  throw new Error(`Erreur HTTP: ${reponse.status}`);
	}
	
	const data = await reponse.json();
	const bouteillesListe = data.data || [];
	
	if (!bouteillesListe.length) {
	  return [];
	}
	
	const celliersData = await recupererTousCellier(id_utilisateur);
	const celliers = celliersData.data || celliersData.donnees || celliersData || [];
	
	const bouteillesCompletes = await Promise.all(
	  bouteillesListe.map(async (item) => {
		const quantitesParCellier = await Promise.all(
		  celliers.map(async (cellier) => {
			const bouteillesCellier = await recupererBouteillesCellier(cellier.id_cellier);
			const bouteilleExistante = bouteillesCellier.find(
			  (b) => b.id === item.id_bouteille
			);
			
			return {
			  idCellier: cellier.id_cellier,
			  nomCellier: cellier.nom,
			  quantite: bouteilleExistante ? bouteilleExistante.quantite : 0,
			};
		  })
		);
		
		return {
		  ...item.bouteille,
		  id: item.id_bouteille,
		  celliers: quantitesParCellier,
		};
	  })
	);
	
	return bouteillesCompletes.filter(Boolean);
  } catch (error) {
	console.error("Erreur lors de la récupération de la liste d'achat:", error);
	return [];
  }
};


/**
 * Ajoute une bouteille à la liste d'achat d'un utilisateur
 * @param {number} id_utilisateur - L'ID de l'utilisateur
 * @param {Object} donnees - Les données de la bouteille à ajouter (id_bouteille)
 * @returns {Promise<Object>} - Résultat de l'opération
 */
export const ajouterBouteilleListe = async (id_utilisateur, donnees) => {
  try {
    const reponse = await fetch(
      `${
        import.meta.env.VITE_BACKEND_LISTE_ACHAT_URL
      }/${id_utilisateur}/bouteilles/${donnees.id_bouteille}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }
    );

    if (reponse.ok) {
      const data = await reponse.json();
      return { succes: true, donnees: data };
    }

    const erreurData = await reponse.json().catch(() => ({}));
    console.error("Erreur HTTP:", reponse.status, erreurData);

    return {
      succes: false,
      erreur: erreurData.message || "Erreur lors de l'ajout à la liste",
    };
  } catch (error) {
    console.error("Erreur lors de l'ajout à la liste:", error);
    return {
      succes: false,
      erreur: "Le serveur ne répond pas.",
    };
  }
};

/**
 * Supprime une bouteille de la liste d'achat
 * @param {number} id_utilisateur - L'ID de l'utilisateur
 * @param {number} id_bouteille - L'ID de la bouteille à supprimer
 * @returns {Promise<Object>} - Résultat de l'opération
 */
export const supprimerBouteilleListe = async (id_utilisateur, id_bouteille) => {
  try {
    const reponse = await fetch(
      `${import.meta.env.VITE_BACKEND_LISTE_ACHAT_URL}/${id_utilisateur}/${id_bouteille}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );
    
    if (reponse.ok) {
      return { succes: true };
    }

    const erreurData = await reponse.json().catch(() => ({}));
    console.error("Erreur HTTP:", reponse.status, erreurData);

    return {
      succes: false,
      erreur: erreurData.message || "Erreur lors de la suppression",
    };
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    return {
      succes: false,
      erreur: "Le serveur ne répond pas.",
    };
  }
};


// *************************** Notes degustations
/**
 * Créer une nouvelle note degustation dans la base de données via l'API backend.
 * @param {Object} datas - Les données de de la note de
 * @param {Function} navigate - Fonction de navigation de react-router-dom pour rediriger l'utilisateur
 * @returns {Promise<{succes: boolean, erreur?: Object|string}>} Un objet indiquant le succès de l'opération et l'erreur éventuelle
 */
export const creerNoteDegustations = async (datas, navigate) => {
  try {
    const reponse = await fetch(
      `${import.meta.env.VITE_BACKEND_DEGUSTATION_URL}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datas),
      }
    );

    if (reponse.ok) {
      const noteAjout = await reponse.json();
      // Naviguer seulement si navigate est fourni
      if (navigate) {
        navigate(`/bouteilles/${datas.id_bouteille}`);
      }
      return { succes: true, data: noteAjout };
    }

    // Gestion des erreurs HTTP (400, 500, etc.)
    const erreurData = await reponse.json().catch(() => ({}));
    console.error("Erreur HTTP:", reponse.status, erreurData);

    // Retourner l'erreur sans naviguer (rester sur la page actuelle)
    return { succes: false, erreur: "Erreur lors de l'ajout de la note" };
  } catch (error) {
    // Gestion des erreurs pour debug (exemple: pas de connexion) ou autres exceptions JavaScript
    console.error("Erreur lors de l'ajout de la note :", error);
    // Retourner l'erreur sans naviguer (rester sur la page actuelle)
    return {
      succes: false,
      erreur: "Erreur lors de l'ajout de la note",
    };
  }
};

/**
 * Traite les notes recuperees pour separer la note de l'utilisateur des autres notes.
 * Et trier les autres par date.
 * @param {Object|Array} notesRecuperees - Les notes récupérées du backend (peut être un objet avec data ou un array)
 * @param {string|number} idUtilisateurActuel - L'identifiant de l'utilisateur actuel
 * @returns {{noteUtilisateur: Object|null, autresNotes: Array}} Un objet avec la note utilisateur et les autres notes triées
 */
export const traiterNotes = (notesRecuperees, idUtilisateurActuel) => {
  // Extraire data si la réponse du backend est un objet avec une propriété data (les notes)
  const notesData = notesRecuperees.data || notesRecuperees;

  // S'assurer que notesData est un tableau sinon on utilise un tableau vide
  const notesArray = Array.isArray(notesData) ? notesData : [];

  // Séparer la note de l'utilisateur actuel des autres notes
  const noteUtilisateurActuel = notesArray.find(
    (note) => note.id_utilisateur === idUtilisateurActuel
  );
  const autresNotes = notesArray.filter(
    (note) => note.id_utilisateur !== idUtilisateurActuel
  );

  // Trier les autres notes par date (les plus récentes en premier)
  const notesTriees = autresNotes.sort((a, b) => {
    const dateA = new Date(a.date_creation || a.date || a.created_at || 0);
    const dateB = new Date(b.date_creation || b.date || b.created_at || 0);
    return dateB - dateA; // Ordre décroissant (plus récent en premier)
  });

  return {
    noteUtilisateur: noteUtilisateurActuel || null,
    autresNotes: notesTriees,
  };
};

/**
 * Récupère les notes de dégustation d'une bouteille par son identifiant via l'API backend.
 * @param {string|number} id_bouteille - L'identifiant unique de la bouteille
 * @returns {Promise<Object|null>} Les données des notes de dégustation ou null en cas d'erreur
 */
export const recupererNotes = async (id_bouteille) => {
  try {
    const reponse = await fetch(
      `${import.meta.env.VITE_BACKEND_DEGUSTATION_URL}/${id_bouteille}`
    );

    if (!reponse.ok) {
      // Pour debug
      console.error("Erreur HTTP:", reponse.status);
      return null;
    }

    const notes = await reponse.json();
    return notes;
  } catch (error) {
    // Pour debug
    console.error("Erreur lors de la récupération des notes :", error);
    return null;
  }
};

/**
 * Modifie une note de dégustation existante dans la base de données via l'API backend.
 * @param {Object} datas - Les données de la note à modifier (id_bouteille, id_utilisateur, date, notes, commentaire)
 * @returns {Promise<{succes: boolean, erreur?: Object|string}>} Un objet indiquant le succès de l'opération et l'erreur éventuelle
 */
export const modifierNote = async (datas) => {
  try {
    const reponse = await fetch(
      `${import.meta.env.VITE_BACKEND_DEGUSTATION_URL}/${
        datas.id_utilisateur
      }/${datas.id_bouteille}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datas),
      }
    );

    if (reponse.ok) {
      const resultat = await reponse.json();
      return { succes: true, data: resultat };
    }

    // Gestion des erreurs HTTP (400, 500, etc.)
    const erreurData = await reponse.json().catch(() => ({}));
    console.error("Erreur HTTP:", reponse.status, erreurData);

    return {
      succes: false,
      erreur:
        erreurData?.message || "Erreur lors de la modification de la note",
    };
  } catch (error) {
    // Gestion des erreurs réseau (exemple: pas de connexion) ou autres exceptions JavaScript
    console.error("Erreur lors de la modification de la note :", error);
    return { succes: false, erreur: error.message };
  }
};

/**
 * Supprime une note de dégustation de la base de données via l'API backend.
 * @param {Object} datas - Les données de la note à supprimer (id_utilisateur, id_bouteille, date)
 * @returns {Promise<{succes: boolean, erreur?: Object|string}>} Un objet indiquant le succès de l'opération et l'erreur éventuelle
 */
export const supprimerNote = async (datas) => {
  try {
    const reponse = await fetch(
      `${import.meta.env.VITE_BACKEND_DEGUSTATION_URL}/${
        datas.id_utilisateur
      }/${datas.id_bouteille}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (reponse.ok) {
      const resultat = await reponse.json();
      return { succes: true, data: resultat };
    }

    // Gestion des erreurs HTTP
    const erreurData = await reponse.json().catch(() => ({}));
    console.error(
      "Erreur HTTP lors de la suppression:",
      reponse.status,
      erreurData
    );

    return {
      succes: false,
      erreur: erreurData?.message || "Erreur lors de la suppression de la note",
    };
  } catch (error) {
    // Gestion des erreurs réseau (exemple: pas de connexion) ou autres exceptions JavaScript
    console.error("Erreur lors de la suppression de la note :", error);
    return { succes: false, erreur: error.message };
  }
};
