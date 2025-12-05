import { useState, useCallback, useEffect } from "react";
import { ajouterBouteilleListe, supprimerBouteilleListe, recupererListeAchatComplete } from "@lib/requetes";
import authentificationStore from "@store/authentificationStore";
/**
 * Composant permettant de gérer l'état d'une bouteille
 * dans la liste d'achat d'un utilisateur.
*/
 
const GestionListeAchat = ({ 
  bouteille, 
  dispatch,  // Fonction pour afficher des messages
  ACTIONS, 
  children   // Fonction qui affiche le bouton (reçoit les données)
}) => {

  const utilisateur = authentificationStore((state) => state.utilisateur);

// ========================================
// Charger l'état initial du composant
// ========================================
  const [dansListe, setDansListe] = useState(false);
  // Savoir si on est en train de charger les données au départ
  const [chargementInitial, setChargementInitial] = useState(true);

  // Charger l'état initial de la liste au montage
  useEffect(() => {
    if (!utilisateur?.id) {
      setChargementInitial(false);
      return;
    }

    // Créer une fonction asynchrone pour aller chercher les données du backend
    const chargerEtat = async () => {
      try {
        const listeComplete = await recupererListeAchatComplete(utilisateur.id);
        
        const existe = listeComplete.some(b => b.id === bouteille.id);

        //Mettre à jour l'état (setDansListe)
        setDansListe(existe);
      } catch (error) {
        console.error("Erreur lors du chargement de la liste d'achat:", error);
        setDansListe(false);
      } finally {
        setChargementInitial(false);
      }
    };

    chargerEtat();
  }, [utilisateur?.id, bouteille.id]);  // Se réexécute si l'utilisateur ou la bouteille change


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

          // Supprimer de la liste
          resultat = await supprimerBouteilleListe(utilisateur.id, bouteille.id);

          if (resultat?.succes) {
            setDansListe(false);
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
          // Ajouter à la liste
          resultat = await ajouterBouteilleListe(utilisateur.id, {
            id_bouteille: bouteille.id,
          });

          if (resultat?.succes) {
            setDansListe(true);
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
    [utilisateur.id, bouteille, dansListe, dispatch, ACTIONS]
  );

  if (chargementInitial) {
    return null;
  }

  return children({ gererAjouterListe, dansListe });
};

export default GestionListeAchat;