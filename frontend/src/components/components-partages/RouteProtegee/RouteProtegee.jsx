import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import authentificationStore from "@store/authentificationStore";
import autorisationStore from "@store/autorisationStore";
import { recupererCellier } from "@lib/requetes";
import Erreur from "@components/components-partages/Erreur/Erreur";
import Spinner from "@components/components-partages/Spinner/Spinner";

/**
 * Composant pour proteger une route et verifier les autorisations
 * @param {Object} props - Les proprietes du composant
 * @param {string} props.type - Type de protection : "cellier", "liste", "profil", "utilisateur"
 * @param {string|number} props.idUtilisateur - ID utilisateur a verifier (pour type "utilisateur" ou "liste")
 *
 * @returns {}
 * - Spinner si en cours de verification (chargement === true)
 * - Composant Erreur si acces refuse (estAutorise === false)
 * - children si acces autorise (estAutorise === true)
 */
function RouteProtegee({ children, type, idUtilisateur }) {
  // Recuperer les parametres de l'URL
  // idCellier pour les routes /cellier/:idCellier
  // id pour les routes /modifier-utilisateur/:id
  const { idCellier, id } = useParams();

  // Etat pour savoir si l'utilisateur est autorise a acceder a la ressource
  // null = en cours de validation
  // true = autorise
  // false = refuse
  const [estAutorise, setEstAutorise] = useState(null);

  // Etat pour afficher un spinner pendant la verification
  // true = on est en train de valider les autorisations
  // false = la validation est terminee
  const [chargement, setChargement] = useState(true);

  /**
   * Effectue la verification des autorisations selon le type de protection
   */
  useEffect(() => {
    const verifierAutorisation = async () => {
      // Commencer la verification
      setChargement(true);

      // Recuperer l'etat d'authentification depuis le store
      // On a besoin de savoir si l'utilisateur est connecte et son ID
      const { estConnecte, utilisateur } = authentificationStore.getState();

      // Verifier si l'utilisateur est connecte
      // Si l'utilisateur n'est pas connecte ou n'a pas d'ID, refuser l'acces
      if (!estConnecte || !utilisateur?.id) {
        setEstAutorise(false);
        setChargement(false);
        return;
      }

      // Verifier selon le type de protection demande
      switch (type) {
        case "cellier":
          // Protection pour les routes /cellier/:idCellier
          // On doit verifier que le cellier existe dans l'URL
          if (!idCellier) {
            setEstAutorise(false);
            setChargement(false);
            return;
          }

          // Recuperer les donnees du cellier depuis l'API
          // On a besoin de connaitre le proprietaire du cellier
          try {
            const cellier = await recupererCellier(idCellier);

            // Si le cellier n'existe pas ou n'a pas de proprietaire, refuser l'acces
            if (!cellier || !cellier.id_utilisateur) {
              setEstAutorise(false);
              setChargement(false);
              return;
            }

            // On compare l'ID utilisateur du cellier avec l'ID de l'utilisateur connecte
            const estProprietaire =
              autorisationStore.estProprietaireCellier(cellier);
            setEstAutorise(estProprietaire);
          } catch (error) {
            // En cas d'erreur lors de la recuperation du cellier, refuser l'acces
            console.error("Erreur lors de la verification du cellier:", error);
            setEstAutorise(false);
          }
          setChargement(false);
          break;

        case "utilisateur":
          // Protection pour les routes /modifier-utilisateur/:id
          // On doit verifier que l'ID utilisateur dans l'URL correspond a l'utilisateur connecte
          // Utiliser l'ID utilisateur fourni en props ou celui de l'URL
          const idUtilisateurUrl = idUtilisateur || id;

          // On compare l'ID dans l'URL avec l'ID de l'utilisateur connecte
          const estProprietaireUser =
            autorisationStore.estProprietaireUtilisateur(idUtilisateurUrl);
          setEstAutorise(estProprietaireUser);
          setChargement(false);
          break;

        default:
          // Par defaut, autoriser si l'utilisateur est connecte
          setEstAutorise(true);
          setChargement(false);
      }
    };

    // Lancer la verification des autorisations
    verifierAutorisation();
  }, [type, idCellier, id, idUtilisateur]);

  // On affiche le spinner tant que chargement === true
  if (chargement) {
    return (
      <div className="min-h-screen bg-fond flex items-center justify-center">
        <Spinner size={140} ariaLabel="Verification des autorisations" />
      </div>
    );
  }

  // Afficher la page d'erreur 403 si l'acces est refuse
  if (!estAutorise) {
    return <Erreur />;
  }

  // Afficher le contenu de la page si l'acces est autorise
  return <>{children}</>;
}

export default RouteProtegee;
