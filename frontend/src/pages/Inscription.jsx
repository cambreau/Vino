import Formulaire from "@components/components-partages/Formulaire/Formulaire";
import FormulaireInput from "@components/components-partages/Formulaire/FormulaireInput/FormulaireInput";
import BoutonRetour from "@components/components-partages/Boutons/BoutonRetour";
import Bouton from "@components/components-partages/Boutons/Bouton";
import Message from "@components/components-partages/Message/Message";
import { regex, validationChamp } from "@lib/validationFormulaire.js";
import { creerUtilisateur } from "@lib/requetes.js";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function Inscription() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const echecInscription = searchParams.get("echec") == 1;
  const echecDoublon = searchParams.get("echec") == 2;

  // Les informations utilisateur
  const [utilisateur, setUtilisateur] = useState({
    nom: "",
    courriel: "",
    mot_de_passe: "",
  });

  // Confirmation du mot de passe (non envoyée au backend)
  const [confirmation, setConfirmation] = useState("");

  // Regroupe les messages d'erreurs à afficher.
  const [erreurs, setErreurs] = useState({
    nom: "",
    courriel: "",
    confirmation: "",
    motDePasse: "",
  });

  /**
   * Fonction envoie la creation de l'utilisateur
   * @param {Event} e - L'événement de soumission du formulaire
   */
  const envoieInscription = async (e) => {
    e.preventDefault();
    // Valider tous les champs avant de soumettre
    const nouvellesErreurs = { ...erreurs };
    // Valider le nom
    if (!validationChamp(regex.regNom, utilisateur.nom)) {
      nouvellesErreurs.nom =
        "Le nom doit comporter entre 2 et 50 caractères, uniquement des lettres, des accents et le tiret (-).";
    } else {
      nouvellesErreurs.nom = "";
    }
    // Valider le courriel
    if (!validationChamp(regex.regcourriel, utilisateur.courriel)) {
      nouvellesErreurs.courriel = "Veuillez saisir un courriel valide.";
    } else {
      nouvellesErreurs.courriel = "";
    }
    // Valider le mot de passe
    if (!validationChamp(regex.regMotDePasse, utilisateur.mot_de_passe)) {
      nouvellesErreurs.motDePasse =
        "Le mot de passe doit contenir au moins 8 caractères, dont une lettre majuscule, une lettre minuscule et un caractère spécial";
    } else {
      nouvellesErreurs.motDePasse = "";
    }
    // Valider la confirmation
    if (!confirmation || confirmation.trim() === "") {
      nouvellesErreurs.confirmation =
        "La confirmation du mot de passe est requise";
    } else if (utilisateur.mot_de_passe !== confirmation) {
      nouvellesErreurs.confirmation =
        "La confirmation du mot de passe n'est pas valide";
    } else {
      nouvellesErreurs.confirmation = "";
    }
    setErreurs(nouvellesErreurs);
    // Vérifier s'il y a des erreurs
    const aDesErreurs = Object.values(nouvellesErreurs).some(
      (erreur) => erreur !== ""
    );
    if (aDesErreurs) {
      return; // Ne pas soumettre si il y a des erreurs
    } else {
      // Envoyer les données utilisateur
      await creerUtilisateur(utilisateur, navigate);
    }
  };

  /**
   * Ferme le message d'erreur en supprimant le paramètre "echec" de l'URL.
   */
  const fermerMessage = () => {
    searchParams.delete("echec");
    setSearchParams(searchParams);
  };

  return (
    <section
      className="
      min-h-screen px-(--rythme-serre) pb-(--rythme-espace) grid grid-rows-[1fr_5fr] items-end
      bg-[linear-gradient(0deg,rgba(0,0,0,0.8)30%,rgba(0,0,0,0)),url('@assets/images/inscriptionCellier.webp')] bg-cover bg-center bg-no-repeat bg-[#e0e0e0]
      "
    >
      <header className="px-(--rythme-base)">
        <BoutonRetour />
      </header>

      {echecInscription && (
        <Message
          texte="Une erreur est survenue lors de l'inscription. Veuillez réessayer."
          type="erreur"
          onClose={fermerMessage}
        />
      )}

      {echecDoublon && (
        <Message
          texte="L’adresse courriel saisie est déjà enregistrée. Merci de fournir une adresse différente pour poursuivre."
          type="erreur"
          onClose={fermerMessage}
        />
      )}
      <Formulaire
        titreFormulaire="Inscription"
        method="POST"
        action={envoieInscription}
        enfants={
          <>
            <FormulaireInput
              type="text"
              nom="nom"
              genre="un"
              classCouleurLabel="Clair"
              estObligatoire={true}
              value={utilisateur.nom}
              onChange={(e) => {
                setUtilisateur((prev) => ({ ...prev, nom: e.target.value }));
              }}
              onBlur={(e) => {
                const valeur = e.target.value;
                if (!validationChamp(regex.regNom, valeur)) {
                  const erreur =
                    "Le nom doit comporter entre 2 et 50 caractères, uniquement des lettres, des accents et le tiret (-).";
                  setErreurs((prev) => ({ ...prev, nom: erreur }));
                } else {
                  setErreurs((prev) => ({ ...prev, nom: "" }));
                }
              }}
            />
            {erreurs.nom && <Message texte={erreurs.nom} type="erreur" />}

            <FormulaireInput
              type="email"
              nom="courriel"
              genre="un"
              classCouleurLabel="Clair"
              estObligatoire={true}
              value={utilisateur.courriel}
              onChange={(e) => {
                const valeur = e.target.value;
                setUtilisateur((prev) => ({ ...prev, courriel: valeur }));
                // Supprimer le message de doublon si l'utilisateur modifie le courriel
                if (echecDoublon || echecInscription) {
                  const nouveauxParams = new URLSearchParams(searchParams);
                  nouveauxParams.delete("echec");
                  setSearchParams(nouveauxParams);
                }
                if (!validationChamp(regex.regcourriel, valeur)) {
                  const erreur = "Veuillez saisir un courriel valide.";
                  setErreurs((prev) => ({ ...prev, courriel: erreur }));
                } // Ne pas oublier de valider que l'adresse courriel est unique
                else {
                  setErreurs((prev) => ({ ...prev, courriel: "" }));
                }
              }}
            />
            {erreurs.courriel && (
              <Message texte={erreurs.courriel} type="erreur" />
            )}

            <FormulaireInput
              type="password"
              nom="mot_de_passe"
              genre="un"
              classCouleurLabel="Clair"
              estObligatoire={true}
              value={utilisateur.mot_de_passe}
              onChange={(e) => {
                setUtilisateur((prev) => ({
                  ...prev,
                  mot_de_passe: e.target.value,
                }));
              }}
              onBlur={(e) => {
                const valeur = e.target.value;
                if (!validationChamp(regex.regMotDePasse, valeur)) {
                  const erreur =
                    "Le mot de passe doit contenir au moins 8 caractères, dont une lettre majuscule, une lettre minuscule et un caractère spécial";
                  setErreurs((prev) => ({ ...prev, motDePasse: erreur }));
                } else {
                  setErreurs((prev) => ({ ...prev, motDePasse: "" }));
                }
              }}
            />
            {erreurs.motDePasse && (
              <Message texte={erreurs.motDePasse} type="erreur" />
            )}

            <FormulaireInput
              type="password"
              nom="confirmation"
              genre="une"
              classCouleurLabel="Clair"
              estObligatoire={true}
              value={confirmation}
              onChange={(e) => {
                setConfirmation(e.target.value);
              }}
              onBlur={(e) => {
                const valeur = e.target.value;
                if (!valeur || valeur.trim() === "") {
                  const erreur = "La confirmation du mot de passe est requise";
                  setErreurs((prev) => ({
                    ...prev,
                    confirmation: erreur,
                  }));
                } else if (utilisateur.mot_de_passe !== valeur) {
                  const erreur =
                    "La confirmation du mot de passe n'est pas valide";
                  setErreurs((prev) => ({
                    ...prev,
                    confirmation: erreur,
                  }));
                } else {
                  setErreurs((prev) => ({ ...prev, confirmation: "" }));
                }
              }}
            />
            {erreurs.confirmation && (
              <Message texte={erreurs.confirmation} type="erreur" />
            )}
          </>
        }
        bouton={
          <Bouton
            texte="S'inscrire"
            type="primaire"
            typeHtml="button"
            action={envoieInscription}
          />
        }
      />
    </section>
  );
}

export default Inscription;
