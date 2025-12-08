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
   * Verifie si un cellier appartient a l'utilisateur connecte
   * Cette fonction necessite de recuperer les donnees du cellier pour verifier son proprietaire
   * @param {Object} cellier - Les donnees du cellier (doit contenir id_utilisateur)
   * @returns {boolean} True si le cellier appartient a l'utilisateur connecte
   */
  estProprietaireCellier: (cellier) => {
    if (!cellier || !cellier.id_utilisateur) return false;
    return autorisationStore.estProprietaireUtilisateur(cellier.id_utilisateur);
  },
};

export default autorisationStore;
