import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MenuEnBas from "@components/components-partages/MenuEnBas/MenuEnBas";
import MenuEnHaut from "@components/components-partages/MenuEnHaut/MenuEnHaut";
import BoiteModale from "@components/components-partages/BoiteModale/BoiteModale";
import { supprimerUtilisateur } from "@lib/requetes.js";
import Bouton from "@components/components-partages/Boutons/Bouton";
import { FaUser } from "react-icons/fa";
import authentificationStore from "@store/authentificationStore";
import { useDocumentTitle } from "@lib/utils.js";

function Profil() {
  const navigate = useNavigate();

  // Récupérer les données du store
  const utilisateur = authentificationStore((state) => state.utilisateur);
  const estConnecte = authentificationStore((state) => state.estConnecte);

  // État pour gérer l'ouverture de la boîte modale de suppression
  const [estModaleSuppressionOuverte, setEstModaleSuppressionOuverte] =
    useState(false);

  // État pour éviter la redirection de déconnexion lors de la suppression
  const [enCoursDeSuppression, setEnCoursDeSuppression] = useState(false);

  useEffect(() => {
    if (!estConnecte || !utilisateur) {
      // Ne pas rediriger si on est en cours de suppression (la redirection est gérée par supprimerUtilisateur)
      if (!enCoursDeSuppression) {
        navigate("/?deconnexionSucces=true");
      }
      return;
    }
  }, [estConnecte, utilisateur, navigate, enCoursDeSuppression]);

  // Titre de page à partir du nom de l'utilisateur
  useDocumentTitle(utilisateur?.nom || "Profil");

  /**
   * Ouvre la boîte modale de confirmation de suppression du profil
   */
  const gestionSuppressionProfil = () => {
    setEstModaleSuppressionOuverte(true);
  };

  /**
   * Fonction qui confirme et exécute la suppression du profil de l'utilisateur
   */
  const confirmerSuppressionProfil = async () => {
    setEstModaleSuppressionOuverte(false);
    setEnCoursDeSuppression(true);
    if (utilisateur && utilisateur.id) {
      console.log("Tentative de suppression du profil, ID:", utilisateur.id);
      const resultat = await supprimerUtilisateur(utilisateur.id, navigate);
      if (!resultat || !resultat.succes) {
        console.error("Erreur lors de la suppression:", resultat?.erreur);
        // Optionnel: afficher un message d'erreur à l'utilisateur
      }
    } else {
      console.error(
        "Impossible de supprimer: utilisateur ou ID manquant",
        utilisateur
      );
    }
  };

  /**
   * Ferme la boîte modale de suppression
   */
  const annulerSuppressionProfil = () => {
    setEstModaleSuppressionOuverte(false);
  };

  const modifierCompte = () => {
    if (utilisateur && utilisateur.id) {
      navigate(`/modifier-utilisateur/${utilisateur.id}`);
    }
  };

  return (
    <div className="h-screen font-body grid grid-rows-[auto_1fr_auto] overflow-hidden">
      <header>
        <MenuEnHaut />
      </header>

      <main className="flex flex-col bg-fond px-(--rythme-base) pt-(--rythme-espace) gap-(--rythme-espace) overflow-y-auto">
        {/* Boîte modale de confirmation de suppression  */}
        {estModaleSuppressionOuverte && (
          <BoiteModale
            texte="Êtes-vous certain de vouloir supprimer votre profil ?"
            onClose={annulerSuppressionProfil}
            bouton={
              <div className="flex flex-wrap gap-(--rythme-base) justify-center">
                <Bouton
                  texte="Non"
                  type="secondaire"
                  typeHtml="button"
                  action={annulerSuppressionProfil}
                />
                <Bouton
                  texte="Oui"
                  type="primaire"
                  typeHtml="button"
                  action={confirmerSuppressionProfil}
                />
              </div>
            }
          />
        )}

        <div>
          <section className="flex items-center justify-between">
            <div>
              <h1 className="text-(length:--taille-grand) font-display font-bold text-texte-premier">
                {utilisateur?.nom}
              </h1>
              <p className="text-(length:--taille-tres-petit)">
                {utilisateur?.courriel}
              </p>
            </div>
            <FaUser size={32} color="#461243" />
          </section>

          <div className="flex flex-col mt-(--rythme-base) gap-(--rythme-serre)">
            <p>
              <span className="text-texte-premier font-bold mr-(--rythme-serre)">
                Nom :
              </span>
              {utilisateur?.nom}
            </p>
            <p>
              <span className="text-texte-premier font-bold mr-(--rythme-serre)">
                Courriel :
              </span>
              {utilisateur?.courriel}
            </p>
            <p>
              <span className="text-texte-premier font-bold mr-(--rythme-serre)">
                Mot de passe :
              </span>
              xxxxxxxxxx
            </p>
          </div>
        </div>

        <div className="flex justify-between m-(--rythme-tres-serre) pb-(--rythme-espace) mb-(--rythme-espace)">
          <Bouton
            taille="moyen"
            texte="Supprimer"
            type="secondaire"
            typeHtml="button"
            action={gestionSuppressionProfil}
          />
          <Bouton
            taille="moyen"
            texte="Mettre à jour"
            type="primaire"
            typeHtml="button"
            action={modifierCompte}
          />
        </div>
      </main>

      <MenuEnBas />
    </div>
  );
}

export default Profil;
