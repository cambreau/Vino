import { create } from "zustand";
import {
  recupererListeAchatSimple,
  ajouterBouteilleListe,
  supprimerBouteilleListe,
} from "@lib/requetes";

/**
 * Store Zustand pour gérer la liste d'achat de l'utilisateur.
 * Ce store centralise les données de la liste d'achat pour éviter
 * des appels API multiples depuis chaque composant GestionListeAchat.
 */
const listeAchatStore = create((set, get) => ({
  // Liste des bouteilles dans la liste d'achat
  bouteilles: [],

  // État de chargement initial
  chargementInitial: true,

  // Flag pour indiquer qu'un chargement est en cours (évite les appels multiples)
  chargementEnCours: false,

  // Erreur éventuelle
  erreur: null,

  // ID utilisateur pour lequel les données sont chargées
  utilisateurId: null,

  /**
   * Charge la liste d'achat complète depuis l'API.
   * Ne recharge pas si les données sont déjà chargées pour cet utilisateur.
   * @param {number|string} utilisateurId - L'ID de l'utilisateur
   * @param {boolean} forceReload - Force le rechargement même si déjà chargé
   */
  chargerListeAchat: async (utilisateurId, forceReload = false) => {
    const state = get();

    // Éviter les appels multiples si un chargement est déjà en cours
    if (state.chargementEnCours) {
      return;
    }

    // Éviter de recharger si déjà chargé pour cet utilisateur
    if (
      !forceReload &&
      !state.chargementInitial &&
      state.utilisateurId === utilisateurId
    ) {
      return;
    }

    set({ chargementInitial: true, chargementEnCours: true, erreur: null, utilisateurId });

    try {
      const listeSimple = await recupererListeAchatSimple(utilisateurId);
      set({
        bouteilles: Array.isArray(listeSimple) ? listeSimple : [],
        chargementInitial: false,
        chargementEnCours: false,
      });
    } catch (error) {
      console.error("Erreur lors du chargement de la liste d'achat:", error);
      set({
        bouteilles: [],
        chargementInitial: false,
        chargementEnCours: false,
        erreur: error.message || "Erreur lors du chargement",
      });
    }
  },

  /**
   * Vérifie si une bouteille est dans la liste d'achat
   * @param {number|string} bouteilleId - L'ID de la bouteille
   * @returns {boolean}
   */
  estDansListe: (bouteilleId) => {
    const { bouteilles } = get();
    return bouteilles.some((b) => b.id === bouteilleId);
  },

  /**
   * Ajoute une bouteille à la liste d'achat
   * @param {number|string} utilisateurId - L'ID de l'utilisateur
   * @param {Object} bouteille - La bouteille à ajouter (doit avoir id et nom)
   * @returns {Object} Résultat de l'opération { succes, erreur? }
   */
  ajouterBouteille: async (utilisateurId, bouteille) => {
    try {
      const resultat = await ajouterBouteilleListe(utilisateurId, {
        id_bouteille: bouteille.id,
      });

      if (resultat?.succes) {
        // Ajouter la bouteille au store localement
        set((state) => ({
          bouteilles: [...state.bouteilles, bouteille],
        }));
        return { succes: true };
      }

      return { succes: false, erreur: resultat?.erreur || "Erreur lors de l'ajout" };
    } catch (error) {
      console.error("Erreur lors de l'ajout à la liste d'achat:", error);
      return { succes: false, erreur: error.message || "Erreur lors de l'ajout" };
    }
  },

  /**
   * Supprime une bouteille de la liste d'achat
   * @param {number|string} utilisateurId - L'ID de l'utilisateur
   * @param {number|string} bouteilleId - L'ID de la bouteille à supprimer
   * @returns {Object} Résultat de l'opération { succes, erreur? }
   */
  supprimerBouteille: async (utilisateurId, bouteilleId) => {
    try {
      const resultat = await supprimerBouteilleListe(utilisateurId, bouteilleId);

      if (resultat?.succes) {
        // Retirer la bouteille du store localement
        set((state) => ({
          bouteilles: state.bouteilles.filter((b) => b.id !== bouteilleId),
        }));
        return { succes: true };
      }

      return { succes: false, erreur: resultat?.erreur || "Erreur lors de la suppression" };
    } catch (error) {
      console.error("Erreur lors de la suppression de la liste d'achat:", error);
      return { succes: false, erreur: error.message || "Erreur lors de la suppression" };
    }
  },

  /**
   * Réinitialise le store (à appeler lors de la déconnexion)
   */
  reinitialiser: () => {
    set({
      bouteilles: [],
      chargementInitial: true,
      chargementEnCours: false,
      erreur: null,
      utilisateurId: null,
    });
  },
}));

export default listeAchatStore;
