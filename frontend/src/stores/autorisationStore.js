import authentificationStore from "./authentificationStore";

/**
 * Store Zustand pour gérer les autorisations et vérifier la propriété des ressources
 * Vérifie que l'utilisateur connecté est bien le propriétaire de la ressource qu'il essaie d'accéder
 */
const autorisationStore = {
  /**
   * Récupère l'ID de l'utilisateur connecté
   * @returns {number|null} L'ID de l'utilisateur ou null
   */
  getIdUtilisateur: () => {
    const { utilisateur } = authentificationStore.getState();
    return utilisateur?.id || null;
  },

  /**
   * Vérifie si un ID utilisateur correspond à l'utilisateur connecté
   * @param {string|number} idUtilisateur - L'ID utilisateur à vérifier
   * @returns {boolean} True si l'ID correspond à l'utilisateur connecté
   */
  estProprietaireUtilisateur: (idUtilisateur) => {
    const idConnecte = autorisationStore.getIdUtilisateur();
    if (!idConnecte || !idUtilisateur) return false;
    return String(idConnecte) === String(idUtilisateur);
  },

  /**
   * Vérifie si un cellier appartient à l'utilisateur connecté
   * Cette fonction nécessite de récupérer les données du cellier pour vérifier son propriétaire
   * @param {Object} cellier - Les données du cellier (doit contenir id_utilisateur)
   * @returns {boolean} True si le cellier appartient à l'utilisateur connecté
   */
  estProprietaireCellier: (cellier) => {
    if (!cellier || !cellier.id_utilisateur) return false;
    return autorisationStore.estProprietaireUtilisateur(cellier.id_utilisateur);
  },

  /**
   * Vérifie si une liste d'achat appartient à l'utilisateur connecté
   * @param {string|number} idUtilisateurListe - L'ID utilisateur de la liste d'achat
   * @returns {boolean} True si la liste appartient à l'utilisateur connecté
   */
  estProprietaireListeAchat: (idUtilisateurListe) => {
    return autorisationStore.estProprietaireUtilisateur(idUtilisateurListe);
  },

  /**
   * Vérifie si l'utilisateur peut accéder à une ressource
   * Combine la vérification de connexion et de propriété
   * @param {string|number} idProprietaire - L'ID du propriétaire de la ressource
   * @returns {boolean} True si l'utilisateur est connecté et est le propriétaire
   */
  peutAcceder: (idProprietaire) => {
    const { estConnecte, utilisateur } = authentificationStore.getState();
    if (!estConnecte || !utilisateur?.id) return false;
    return autorisationStore.estProprietaireUtilisateur(idProprietaire);
  },
};

export default autorisationStore;
