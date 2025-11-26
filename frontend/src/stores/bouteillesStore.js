import { create } from "zustand";
import { persist } from "zustand/middleware";
import { recupererBouteilles } from "../lib/requetes.js";

/**
 * Store Zustand pour gérer les bouteilles (catalogue)
 */
const bouteillesStore = create(
  // persist pour enregistrer dans le local storage
  persist(
    (set) => ({
      bouteilles: [],
      chargement: false,
      erreur: null,

      /**
       * Charge toutes les bouteilles depuis l'API backend
       */
      chargerBouteilles: async () => {
        set({ erreur: null, chargement: true });
        try {
          const datas = await recupererBouteilles();

          if (!datas || !datas.donnees) {
            set({
              bouteilles: [],
              erreur: "Impossible de charger les bouteilles.",
              chargement: false,
            });
            return;
          }

          set({
            bouteilles: datas.donnees,
            erreur: null,
            chargement: false,
          });
        } catch (error) {
          console.error(
            "Erreur dans bouteillesStore.chargerBouteilles :",
            error
          );
          set({
            bouteilles: [],
            erreur: "Erreur de connexion au serveur.",
            chargement: false,
          });
        }
      },
    }),
    {
      name: "bouteilles-storage",
    }
  )
);

export default bouteillesStore;
