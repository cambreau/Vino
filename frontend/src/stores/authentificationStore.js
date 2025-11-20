import { create } from "zustand";
import { persist } from "zustand/middleware"; // Permet de sauvegarder auto le store dans le localStorage.

/**
 * Store Zustand pour gérer l'authentification de l'utilisateur
 */
const authentificationStore = create(
  persist(
    (set) => ({
      // État initial
      utilisateur: null,
      estConnecte: false,

      /**
       * Action pour connecter un utilisateur (equivalent d'un set)
       * @param {Object} utilisateurDatas - Les données de l'utilisateur connecté
       */
      connexion: (utilisateurDatas) => {
        set({
          utilisateur: utilisateurDatas,
          estConnecte: true,
        });
      },

      /**
       * Action pour déconnecter l'utilisateur (equivalent d'un set)
       */
      deconnexion: () => {
        set({
          utilisateur: null,
          estConnecte: false,
        });
      },
    }),
    {
      name: "auth-storage", // Nom de la clé dans localStorage
    }
  )
);

export default authentificationStore;
