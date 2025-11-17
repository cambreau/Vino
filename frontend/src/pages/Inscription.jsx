import Formulaire from "../components/components-partages/Formulaire/Formulaire";
import FormulaireInput from "../components/components-partages/Formulaire/FormulaireInput/FormulaireInput";
import { regex, validationChamp } from "../lib/validationFormulaire.js";

function Inscription() {
  const [erreurs, setErreurs] = useState({
    nom: "",
    email: "",
    confirmationEmail: "",
    motDePasse: "",
  });
  return (
    <section>
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
              type="email"
              nom="email"
              genre="un"
              estObligatoire={true}
              pattern={regex.regEmail}
              onChange={(e) => {
                const valeur = e.target.value;
                if (!validationChamp(pattern, valeur)) {
                  const erreur = "Veuillez saisir un email valide.";
                  setErreurs((prev) => ({ ...prev, email: erreur }));
                } // Ne pas oublier de valider que l'adresse courriel est unique
                else {
                  setErreurs((prev) => ({ ...prev, email: "" }));
                }
              }}
            />
            {erreurs.email && <p className="erreur">{erreurs.email}</p>}
            
            <FormulaireInput
              type="email"
              nom="confirmationEmail"
              genre="une"
              estObligatoire={true}
              pattern={regex.regEmail}
              onChange={(e) => {
                const valeur = e.target.value;
                const emailInput = document.querySelector(
                  'input[name="email"]'
                );
                const adresseEmail = emailInput.value;
                if (!adresseEmail == valeur) {
                  const erreur =
                    "La confirmation de l'adresse email n'est pas valide";
                  setErreurs((prev) => ({
                    ...prev,
                    confirmationEmail: erreur,
                  }));
                } else {
                  setErreurs((prev) => ({ ...prev, confirmationEmail: "" }));
                }
              }}
            />
            {erreurs.confirmationEmail && <p className="erreur">{erreurs.confirmationEmail}</p>}

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
             {erreurs.motDePasse && <p className="erreur">{erreurs.motDePasse}</p>}
          </>
        }
        bouton={}
      />
      <Formulaire />
    </section>
  );
}

export default Inscription;
