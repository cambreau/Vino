import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * État initial des filtres
 */
const etatInitialFiltres = {
  type: "",
  pays: "",
  region: "",
  annee: "",
};

/**
 * Store Zustand pour gérer la persistance des filtres
 * Les filtres sont sauvegardés dans le sessionStorage pour persister
 * durant la session de navigation (rechargement de page, navigation entre pages)
 */
const filtresStore = create(
  persist(
    (set, get) => ({
      // État des filtres
      criteres: { ...etatInitialFiltres },

      // Mode de recherche actif (filtres vs recherche texte)
      modeRecherche: false,

      // Critères de recherche textuelle
      criteresRecherche: {},

      // Mode de tri
      modeTri: "nom_asc",

      /**
       * Met à jour les critères de filtrage
       * @param {Object} nouveauxCriteres - Les nouveaux critères de filtrage
       */
      setCriteres: (nouveauxCriteres) => {
        set({ criteres: { ...etatInitialFiltres, ...nouveauxCriteres } });
      },

      /**
       * Met à jour un critère spécifique
       * @param {string} cle - La clé du critère
       * @param {string} valeur - La nouvelle valeur
       */
      setCritere: (cle, valeur) => {
        set((state) => ({
          criteres: { ...state.criteres, [cle]: valeur },
        }));
      },

      /**
       * Active le mode recherche
       * @param {Object} criteres - Les critères de recherche
       */
      setModeRecherche: (criteres) => {
        set({
          modeRecherche: true,
          criteresRecherche: criteres,
        });
      },

      /**
       * Désactive le mode recherche et retourne aux filtres
       */
      desactiverModeRecherche: () => {
        set({
          modeRecherche: false,
          criteresRecherche: {},
        });
      },

      /**
       * Change le mode de tri
       * @param {string} mode - Le mode de tri ("nom_asc" ou "nom_desc")
       */
      setModeTri: (mode) => {
        set({ modeTri: mode });
      },

      /**
       * Bascule le mode de tri
       */
      toggleModeTri: () => {
        set((state) => ({
          modeTri: state.modeTri === "nom_asc" ? "nom_desc" : "nom_asc",
        }));
      },

      /**
       * Vérifie si des filtres sont actifs
       * @returns {boolean}
       */
      aDesFiltresActifs: () => {
        const { criteres, modeRecherche, criteresRecherche } = get();
        if (modeRecherche) {
          return Object.values(criteresRecherche ?? {}).some((v) => Boolean(v));
        }
        return Object.values(criteres ?? {}).some((v) => Boolean(v));
      },

      /**
       * Supprime un critère spécifique
       * @param {string} cle - La clé du critère à supprimer
       */
      supprimerCritere: (cle) => {
        set((state) => {
          const nouveauxCriteres = { ...state.criteres, [cle]: "" };
          // Si on supprime le pays, on vide aussi la région
          if (cle === "pays") {
            nouveauxCriteres.region = "";
          }
          return { criteres: nouveauxCriteres };
        });
      },

      /**
       * Réinitialise tous les filtres
       */
      reinitialiserFiltres: () => {
        set({
          criteres: { ...etatInitialFiltres },
          modeRecherche: false,
          criteresRecherche: {},
        });
      },

      /**
       * Réinitialise tout (filtres + tri)
       */
      reinitialiserTout: () => {
        set({
          criteres: { ...etatInitialFiltres },
          modeRecherche: false,
          criteresRecherche: {},
          modeTri: "nom_asc",
        });
      },
    }),
    {
      name: "filtres-storage",
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);

export default filtresStore;
