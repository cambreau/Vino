import { useCallback, useEffect } from "react";
import authentificationStore from "@store/authentificationStore";
import listeAchatStore from "@store/listeAchatStore";

/**
 * Composant permettant de gérer l'état d'une bouteille
 * dans la liste d'achat d'un utilisateur.
 * Utilise un store centralisé pour éviter les appels API multiples.
 */

const GestionListeAchat = ({
  bouteille,
  dispatch, // Fonction pour afficher des messages
  ACTIONS,
  children, // Fonction qui affiche le bouton (reçoit les données)
}) => {
  const utilisateur = authentificationStore((state) => state.utilisateur);

  // Utiliser le store centralisé pour la liste d'achat
  const {
    chargementInitial,
    estDansListe,
    ajouterBouteille,
    supprimerBouteille,
    chargerListeAchat,
  } = listeAchatStore();

  // Charger la liste d'achat une seule fois au montage (le store gère la déduplication)
  useEffect(() => {
    if (utilisateur?.id) {
      chargerListeAchat(utilisateur.id);
    }
  }, [utilisateur?.id, chargerListeAchat]);

  // Vérifier si la bouteille est dans la liste via le store
  const dansListe = estDansListe(bouteille.id);

  // ========================================
  // Ajouter ou supprimer de la liste
  // ========================================
  const gererAjouterListe = useCallback(
    async (e) => {
      if (e && typeof e.stopPropagation === "function") {
        e.stopPropagation();
        e.preventDefault();
      }

      try {
        let resultat;

        // ===== SITUATION 1 : La bouteille EST déjà dans la liste =====
        if (dansListe) {
          // Supprimer de la liste via le store
          resultat = await supprimerBouteille(utilisateur.id, bouteille.id);

          if (resultat?.succes) {
            dispatch({
              type: ACTIONS.SET_MESSAGE,
              payload: {
                texte: `${bouteille.nom} a été retiré de votre liste`,
                type: "succes",
              },
            });
          }
        }
        // ===== SITUATION 2 : La bouteille n'est pas dans la liste =====
        else {
          // Ajouter à la liste via le store
          resultat = await ajouterBouteille(utilisateur.id, bouteille);

          if (resultat?.succes) {
            dispatch({
              type: ACTIONS.SET_MESSAGE,
              payload: {
                texte: `${bouteille.nom} a été ajouté à votre liste avec succès`,
                type: "succes",
              },
            });
          }
        }
        // Si la requête a échoué (resultat.succes = false)
        if (!resultat?.succes) {
          dispatch({
            type: ACTIONS.SET_MESSAGE,
            payload: {
              texte: resultat?.erreur || "Erreur lors de l'opération",
              type: "erreur",
            },
          });
        }
      } catch (error) {
        console.error(error);
        dispatch({
          type: ACTIONS.SET_MESSAGE,
          payload: {
            texte: "Erreur lors de l'opération",
            type: "erreur",
          },
        });
      }
    },
    [utilisateur?.id, bouteille, dansListe, dispatch, ACTIONS, ajouterBouteille, supprimerBouteille]
  );

  if (chargementInitial) {
    return null;
  }

  return children({ gererAjouterListe, dansListe });
};

export default GestionListeAchat;