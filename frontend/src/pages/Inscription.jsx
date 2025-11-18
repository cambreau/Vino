import Formulaire from "../components/components-partages/Formulaire/Formulaire";
import FormulaireInput from "../components/components-partages/Formulaire/FormulaireInput/FormulaireInput";
import BoutonRetour from "../components/components-partages/Boutons/BoutonRetour";
import Bouton from "../components/components-partages/Boutons/Bouton";
import Message from "../components/components-partages/Message/Message";
import { regex, validationChamp } from "../lib/validationFormulaire.js";
import { creerUtilisateur } from "../lib/requetes.js";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function Inscription() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const echec = searchParams.get("echec") === "true";

  // Les informations utilisateur
  const [utilisateur, setUtilisateur] = useState({
    nom: "",
    courriel: "",
    mot_de_passe: "",
  });

  // Regroupe les messages d'erreurs à afficher.
  const [erreurs, setErreurs] = useState({
    nom: "",
    courriel: "",
    confirmation: "",
    motDePasse: "",
  });

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
      bg-[linear-gradient(0deg,rgba(0,0,0,0.8)30%,rgba(0,0,0,0)),url('../assets/images/inscriptionCellier.webp')] bg-cover bg-center bg-no-repeat bg-[#e0e0e0]"
    >
      <BoutonRetour />
      {echec && (
        <Message
          texte="Une erreur est survenue lors de l'inscription. Veuillez réessayer."
          type="erreur"
          onClose={fermerMessage}
        />
      )}
      <Formulaire
        titreFormulaire="Inscription"
        method="POST"
        enfants={
          <>
            <FormulaireInput
              type="text"
              nom="nom"
              genre="un"
              estObligatoire={true}
              pattern={regex.regNom}
              onChange={(e) => {
                const valeur = e.target.value;
                if (!validationChamp(regex.regNom, valeur)) {
                  const erreur =
                    "Le nom doit comporter entre 2 et 50 caractères, uniquement des lettres, des accents et le tiret (-).";
                  setErreurs((prev) => ({ ...prev, nom: erreur }));
                } else {
                  setUtilisateur((prev) => ({ ...prev, nom: valeur }));
                  setErreurs((prev) => ({ ...prev, nom: "" }));
                }
              }}
            />
            {erreurs.nom && <p className="erreur">{erreurs.nom}</p>}

            <FormulaireInput
              type="courriel"
              nom="courriel"
              genre="un"
              estObligatoire={true}
              pattern={regex.regcourriel}
              onChange={(e) => {
                const valeur = e.target.value;
                if (!validationChamp(regex.regcourriel, valeur)) {
                  const erreur = "Veuillez saisir un courriel valide.";
                  setErreurs((prev) => ({ ...prev, courriel: erreur }));
                } // Ne pas oublier de valider que l'adresse courriel est unique
                else {
                  setUtilisateur((prev) => ({ ...prev, courriel: valeur }));
                  setErreurs((prev) => ({ ...prev, courriel: "" }));
                }
              }}
            />
            {erreurs.courriel && <p className="erreur">{erreurs.courriel}</p>}

            <FormulaireInput
              type="text"
              nom="mot_de_passe"
              genre="un"
              estObligatoire={true}
              pattern={regex.regMotDePasse}
              onChange={(e) => {
                const valeur = e.target.value;
                if (!validationChamp(regex.regMotDePasse, valeur)) {
                  const erreur =
                    "Le mot de passe doit contenir au moins 8 caractères, dont une lettre majuscule, une lettre minuscule et un caractère spécial";
                  setErreurs((prev) => ({ ...prev, motDePasse: erreur }));
                } else {
                  setUtilisateur((prev) => ({ ...prev, mot_de_passe: valeur }));
                  setErreurs((prev) => ({ ...prev, motDePasse: "" }));
                }
              }}
            />
            {erreurs.motDePasse && (
              <p className="erreur">{erreurs.motDePasse}</p>
            )}

            <FormulaireInput
              type="texte"
              nom="confirmation"
              genre="une"
              estObligatoire={true}
              pattern={regex.regMotDePasse}
              onChange={(e) => {
                const valeur = e.target.value;
                const inputMotDePasse = document.querySelector(
                  'input[name="mot_de_passe"]'
                );
                const mdp = inputMotDePasse ? inputMotDePasse.value : "";
                if (mdp !== valeur) {
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
              <p className="erreur">{erreurs.confirmation}</p>
            )}
          </>
        }
        bouton={<Bouton texte="S'inscrire" type="primaire" typeHtml="submit" />}
      />
    </section>
  );
}

export default Inscription;
