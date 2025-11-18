import Formulaire from "../components/components-partages/Formulaire/Formulaire";
import FormulaireInput from "../components/components-partages/Formulaire/FormulaireInput/FormulaireInput";
import BoutonRetour from "../components/components-partages/Formulaire/FormulaireBouton/BoutonRetour.jsx";
import { regex, validationChamp } from "../lib/validationFormulaire.js";
import { useState } from "react";

function Inscription() {
  // Regroupe les messages d'erreurs à afficher.
  const [erreurs, setErreurs] = useState({
    nom: "",
    courriel: "",
    confirmationcourriel: "",
    motDePasse: "",
  });

  return (
    <section
      className="
      max-w-[800px] h-auto
      min-h-screen
      bg-[url('../assets/images/inscriptionCellier.webp')] bg-cover bg-center bg-no-repeat bg-[#e0e0e0]"
    >
      <BoutonRetour></BoutonRetour>
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
                if (!validationChamp(pattern, valeur)) {
                  const erreur =
                    "Le nom doit comporter entre 2 et 50 caractères, uniquement des lettres, des accents et le tiret (-).";
                  setErreurs((prev) => ({ ...prev, nom: erreur }));
                } else {
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
                if (!validationChamp(pattern, valeur)) {
                  const erreur = "Veuillez saisir un courriel valide.";
                  setErreurs((prev) => ({ ...prev, courriel: erreur }));
                } // Ne pas oublier de valider que l'adresse courriel est unique
                else {
                  setErreurs((prev) => ({ ...prev, courriel: "" }));
                }
              }}
            />
            {erreurs.courriel && <p className="erreur">{erreurs.courriel}</p>}

            <FormulaireInput
              type="courriel"
              nom="confirmation"
              genre="une"
              estObligatoire={true}
              pattern={regex.regcourriel}
              onChange={(e) => {
                const valeur = e.target.value;
                const courrielInput = document.querySelector(
                  'input[name="courriel"]'
                );
                const adressecourriel = courrielInput.value;
                if (!adressecourriel == valeur) {
                  const erreur =
                    "La confirmation de l'adresse courriel n'est pas valide";
                  setErreurs((prev) => ({
                    ...prev,
                    confirmationcourriel: erreur,
                  }));
                } else {
                  setErreurs((prev) => ({ ...prev, confirmationcourriel: "" }));
                }
              }}
            />
            {erreurs.confirmationcourriel && (
              <p className="erreur">{erreurs.confirmationcourriel}</p>
            )}

            <FormulaireInput
              type="text"
              nom="mot_de_passe"
              genre="un"
              estObligatoire={true}
              pattern={regex.regMotDePasse}
              onChange={(e) => {
                const valeur = e.target.value;
                if (!validationChamp(pattern, valeur)) {
                  const erreur =
                    "Le mot de passe doit contenir au moins 8 caractères, dont une lettre majuscule, une lettre minuscule et un caractère spécial";
                  setErreurs((prev) => ({ ...prev, motDePasse: erreur }));
                } else {
                  setErreurs((prev) => ({ ...prev, motDePasse: "" }));
                }
              }}
            />
            {erreurs.motDePasse && (
              <p className="erreur">{erreurs.motDePasse}</p>
            )}
          </>
        }
        bouton={"."}
      />
      <Formulaire />
    </section>
  );
}

export default Inscription;
