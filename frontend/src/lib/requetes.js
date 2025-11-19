// Ce fichier regroupe toutes les fonctions permettant de communiquer avec le backend.

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
    navigate("/inscription?echec=true");
    return { succes: false, erreur: erreurData };
  } catch (error) {
    // Gestion des erreurs réseau (exemple: pas de connexion) ou autres exceptions JavaScript
    console.error("Erreur lors de la création de l'utilisateur :", error);
    navigate("/inscription?echec=true");
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
      navigate(`/profil/${datas.id}?succes=true`);
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
