import Formulaire from "../components/components-partages/Formulaire/Formulaire";
import FormulaireInput from "../components/components-partages/Formulaire/FormulaireInput/FormulaireInput";
import Bouton from "../components/components-partages/Boutons/Bouton";
import BoutonRetour from "../components/components-partages/Boutons/BoutonRetour";
import Message from "../components/components-partages/Message/Message";

import { validerConnexion } from "../lib/validationFormulaire.js";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Connexion() {
  const navigate = useNavigate();

  // Les informations de connexion
  const [utilisateur, setUtilisateur] = useState({
    courriel: "",
    mot_de_passe: "",
  });

  // Message d'erreur
  const [messageErreurGeneral, setMessageErreurGeneral] = useState("");

  /**
   * Fonction qui envoie la connexion
   * @param {Event} e - L'événement de soumission du formulaire
   */
  const envoieConnexion = async (e) => {
    e.preventDefault();

    // Valider les champs avec la fonction de validationFormulaire.js
    const erreur = validerConnexion(utilisateur.courriel, utilisateur.mot_de_passe);

    // Si une erreur existe
    if (erreur) {
      setMessageErreurGeneral(erreur);
      return;
    }

    // Réinitialiser le message d'erreur si tout est valide
    setMessageErreurGeneral("");

    // Si tout est valide, afficher les données dans la console
    console.log("Connexion avec:", utilisateur);

    // backend

  };

  return (
    <main
      className="
      min-h-screen py-(--rythme-espace) grid grid-rows-[1fr_5fr] items-end
      bg-[linear-gradient(0deg,rgba(0,0,0,0.7)25%,rgba(0,0,0,0)),url('../assets/images/bg3.png')] bg-cover bg-center bg-no-repeat bg-[#e0e0e0]"
    >

      <header className="px-(--rythme-base)">
        <BoutonRetour />
      </header>
      
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
                // Mettre à jour la valeur du courriel
                setUtilisateur((prev) => ({ ...prev, courriel: valeur }));
                
                // Effacer le message d'erreur général quand l'utilisateur tape
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
                // Mettre à jour la valeur du mot de passe
                setUtilisateur((prev) => ({
                  ...prev,
                  mot_de_passe: valeur,
                }));
                
                // Effacer le message d'erreur
                if (messageErreurGeneral) {
                  setMessageErreurGeneral("");
                }
              }}
            />
            
          </>
        }
        bouton={
          <Bouton
            texte="Se connecter"
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