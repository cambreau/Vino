// Ce fichier regroupe toutes les fonctions permettant de communiquer avec le backend.
import authentificationStore from "../stores/authentificationStore";

/**
 * Crée un nouvel utilisateur dans la base de données via l'API backend.
 * Redirige vers la page de connexion en cas de succès ou vers la page d'inscription en cas d'erreur.
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
      navigate("/connexion?inscriptionSucces=true");
      return { succes: true };
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
    navigate(`/modifier-utilisateur/${datas.id}?echec=true`);
    return { succes: false, erreur: erreurData };
  } catch (error) {
    // Gestion des erreurs réseau (exemple: pas de connexion) ou autres exceptions JavaScript
    console.error("Erreur lors de la modification de l'utilisateur :", error);
    navigate(`/modifier-utilisateur/${datas.id}?echec=true`);
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
    const reponse = await fetch(
      `${import.meta.env.VITE_BACKEND_UTILISATEUR_URL}/${id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (reponse.ok) {
      // Déconnecter l'utilisateur du store
      authentificationStore.getState().deconnexion();
      navigate(`/connexion?supprimerSucces=true`);
      return { succes: true };
    }
  } catch (error) {
    // Gestion des erreurs réseau (exemple: pas de connexion) ou autres exceptions JavaScript
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
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

      // Rediriger vers page profil
      navigate("/profil");

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
