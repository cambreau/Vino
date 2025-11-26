import { create } from "zustand";
import { recupererBouteilles } from "../lib/requetes.js";

/**
 * Store Zustand pour gérer les bouteilles (catalogue)
 */
const bouteillesStore = create((set) => ({
  bouteilles: [],
  erreur: null,

  /**
   * Charge toutes les bouteilles depuis l'API backend
   */
  chargerBouteilles: async () => {
    set({ erreur: null });
    try {
      const datas = await recupererBouteilles();

      if (!datas || !datas.donnees) {
        set({
          bouteilles: [],
          erreur: "Impossible de charger les bouteilles.",
        });
        return;
      }

      set({
        bouteilles: datas.donnees,
        erreur: null,
      });
    } catch (error) {
      console.error("Erreur dans bouteillesStore.chargerBouteilles :", error);
      set({
        bouteilles: [],
        erreur: "Erreur de connexion au serveur.",
      });
    }
  },
}));

export default bouteillesStore;
