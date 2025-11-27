import Formulaire from "@components/components-partages/Formulaire/Formulaire";
import FormulaireInput from "@components/components-partages/Formulaire/FormulaireInput/FormulaireInput";
import Bouton from "@components/components-partages/Boutons/Bouton";
import BoutonRetour from "@components/components-partages/Boutons/BoutonRetour";
import Message from "@components/components-partages/Message/Message";

import { validerConnexion } from "@lib/validationFormulaire.js";
import { connexionUtilisateur } from "@lib/requetes.js";

import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function Connexion() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const inscriptionSucces = searchParams.get("inscriptionSucces") === "true";
  const deconnexionSucces = searchParams.get("deconnexionSucces") === "true";
  const supprimerSucces = searchParams.get("supprimerSucces") === "true";

  // Les informations de connexion
  const [utilisateur, setUtilisateur] = useState({
    courriel: "",
    mot_de_passe: "",
  });

  // Message d'erreur
  const [messageErreurGeneral, setMessageErreurGeneral] = useState("");

  // État de chargement
  const [chargement, setChargement] = useState(false);

  /**
   * Fonction qui envoie la connexion
   * @param {Event} e - L'événement de soumission du formulaire
   */
  const envoieConnexion = async (e) => {
    e.preventDefault();

    // Validation frontend
    const erreur = validerConnexion(
      utilisateur.courriel,
      utilisateur.mot_de_passe
    );

    // Si une erreur existe
    if (erreur) {
      supprimerMessagesSucces();
      setMessageErreurGeneral(erreur);
      return;
    }

    // Réinitialiser le message d'erreur si tout est valide
    setMessageErreurGeneral("");

    // Appel de la requête connexionUtilisateur
    setChargement(true);

    const resultat = await connexionUtilisateur(utilisateur, navigate);

    setChargement(false);

    // Gestion des erreurs
    if (!resultat.succes) {
      supprimerMessagesSucces();
      setMessageErreurGeneral(resultat.erreur);
    }
    // Si succès, la redirection est déjà gérée dans connexionUtilisateur
  };

  /**
   * Supprime les messages de succès de l'URL.
   */
  const supprimerMessagesSucces = () => {
    if (deconnexionSucces || inscriptionSucces || supprimerSucces) {
      const nouveauxParams = new URLSearchParams(searchParams);
      nouveauxParams.delete("deconnexionSucces");
      nouveauxParams.delete("inscriptionSucces");
      nouveauxParams.delete("supprimerSucces");
      setSearchParams(nouveauxParams);
    }
  };

  /**
   * Ferme le message d'erreur en supprimant les paramètres de succès de l'URL.
   */
  const fermerMessage = () => {
    searchParams.delete("inscriptionSucces");
    searchParams.delete("deconnexionSucces");
    searchParams.delete("supprimerSucces");
    setSearchParams(searchParams);
  };

  return (
    <main
      className="
      min-h-screen py-(--rythme-espace) grid grid-rows-[1fr_5fr] items-end
      bg-[linear-gradient(0deg,rgba(0,0,0,0.7)25%,rgba(0,0,0,0)),url('@assets/images/bg3.png')] bg-cover bg-center bg-no-repeat bg-[#e0e0e0]"
    >
      <header className="px-(--rythme-base)">
        <BoutonRetour />
      </header>

      <div className="my-(--rythme-espace) mx-(--rythme-base)">
        {inscriptionSucces && (
          <Message
            texte="Profil créé avec succès. Veuillez vous connecter pour continuer."
            type="succes"
            onClose={fermerMessage}
          />
        )}
        {deconnexionSucces && (
          <Message
            texte="Vous avez bien été déconnecté!"
            type="succes"
            onClose={fermerMessage}
          />
        )}
        {supprimerSucces && (
          <Message
            texte="Votre compte a bien été supprimé. !"
            type="succes"
            onClose={fermerMessage}
          />
        )}
      </div>

      <Formulaire
        titreFormulaire="Se connecter"
        method="POST"
        action={envoieConnexion}
        enfants={
          <>
            {/* Message d'erreur */}
            {messageErreurGeneral && (
              <div className="mt-4">
                <Message texte={messageErreurGeneral} type="erreur" />
              </div>
            )}

            {/* Champ courriel */}
            <FormulaireInput
              type="email"
              nom="courriel"
              genre="un"
              classCouleur="Clair"
              classCouleurLabel="Clair"
              estObligatoire={true}
              value={utilisateur.courriel}
              onChange={(e) => {
                const valeur = e.target.value;
                setUtilisateur((prev) => ({ ...prev, courriel: valeur }));
                supprimerMessagesSucces();
                if (messageErreurGeneral) {
                  setMessageErreurGeneral("");
                }
              }}
            />

            {/* Champ mot de passe */}
            <FormulaireInput
              type="password"
              nom="mot de passe"
              genre="un"
              classCouleur="Clair"
              classCouleurLabel="Clair"
              estObligatoire={true}
              value={utilisateur.mot_de_passe}
              onChange={(e) => {
                const valeur = e.target.value;
                setUtilisateur((prev) => ({
                  ...prev,
                  mot_de_passe: valeur,
                }));
                supprimerMessagesSucces();
                if (messageErreurGeneral) {
                  setMessageErreurGeneral("");
                }
              }}
            />
          </>
        }
        bouton={
          <Bouton
            texte={chargement ? "Connexion en cours..." : "Se connecter"}
            type="primaire"
            typeHtml="submit"
            action={envoieConnexion}
          />
        }
      />
    </main>
  );
}

export default Connexion;
