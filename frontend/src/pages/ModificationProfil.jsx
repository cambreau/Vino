import MenuEnHaut from "../components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "../components/components-partages/MenuEnBas/MenuEnBas";
import Formulaire from "../components/components-partages/Formulaire/Formulaire";
import FormulaireInput from "../components/components-partages/Formulaire/FormulaireInput/FormulaireInput";
import Bouton from "../components/components-partages/Boutons/Bouton";
import Message from "../components/components-partages/Message/Message";
import { regex, validationChamp } from "../lib/validationFormulaire.js";
// import { recupererUtilisateur, modifierUtilisateur } from "../lib/requetes.js";
import { useState, useEffect } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";

function ModificationProfil() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const echec = searchParams.get("echec") === "true";

  //Recuperer id dans l'url
  const { id } = useParams();
  // Les informations utilisateur
  const [utilisateur, setUtilisateur] = useState({
    id: id,
    nom: "",
    courriel: "",
    mot_de_passe: "",
  });
  // Confirmation du mot de passe (non envoyée au backend)
  const [confirmation, setConfirmation] = useState("");

  /**
   * Recuperer les informations de l'utilisateur cote backend.
   */
  useEffect(() => {
    const chargerUtilisateur = async () => {
      const utilisateur = await recupererUtilisateur(id); // Fonction a creer requetes.js
      if (utilisateur) {
        setUtilisateur({
          id: utilisateur.id,
          nom: utilisateur.nom || "",
          courriel: utilisateur.courriel || "",
          mot_de_passe: mot_de_passe || "",
        });
      }
    };
    chargerUtilisateur();
  }, []);

  // Regroupe les messages d'erreurs à afficher.
  const [erreurs, setErreurs] = useState({
    nom: "",
    courriel: "",
    confirmation: "",
    motDePasse: "",
  });

  /**
   * Fonction envoie la modification du profil de l'utilisateur
   * @param {Event} e - L'événement de soumission du formulaire
   */
  const envoieModificationProfil = async (e) => {
    e.preventDefault();

    // Envoyer les données utilisateur
    await modifierUtilisateur(utilisateur, navigate); // Creer fonction requetes.js
  };

  /**
   * Ferme le message d'erreur en supprimant le paramètre "echec" de l'URL.
   */
  const fermerMessage = () => {
    searchParams.delete("echec");
    setSearchParams(searchParams);
  };

  /**
   * Recharge les données de l'utilisateur depuis le backend.
   */
  const reinitialiserFormulaire = async () => {
    if (id) {
      const utilisateurData = await recupererUtilisateur(id);
      if (utilisateurData) {
        setUtilisateur({
          id: utilisateurData.id,
          nom: utilisateurData.nom || "",
          courriel: utilisateurData.courriel || "",
          mot_de_passe: "",
        });
        setConfirmation("");
        setErreurs({
          nom: "",
          courriel: "",
          confirmation: "",
          motDePasse: "",
        });
      }
    }
  };

  return (
    <>
      <header>
        <MenuEnHaut />
      </header>
      <main
        className="
        px-(--rythme-serre) py-(--rythme-base) grid grid-rows-[1fr_5fr] items-end
        bg-(--color-fond)
        "
      >
        {echec && (
          <Message
            texte="Une erreur est survenue lors de la modification. Veuillez réessayer."
            type="erreur"
            onClose={fermerMessage}
          />
        )}
        <Formulaire
          titreFormulaire="Modification de votre profil"
          method="POST"
          action={envoieModificationProfil}
          classeTitre="accent"
          enfants={
            <>
              <FormulaireInput
                type="text"
                nom="nom"
                genre="un"
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
                estObligatoire={true}
                value={utilisateur.courriel}
                onChange={(e) => {
                  const valeur = e.target.value;
                  setUtilisateur((prev) => ({ ...prev, courriel: valeur }));
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
                type="text"
                nom="mot_de_passe"
                genre="un"
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
                type="text"
                nom="confirmation"
                genre="une"
                estObligatoire={true}
                value={confirmation}
                onChange={(e) => {
                  setConfirmation(e.target.value);
                }}
                onBlur={(e) => {
                  const valeur = e.target.value;
                  if (utilisateur.mot_de_passe !== valeur) {
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
            <>
              <Bouton
                taille="moyen"
                texte="Annuler"
                type="secondaire"
                typeHtml="button"
                action={reinitialiserFormulaire}
              />
              <Bouton
                taille="moyen"
                texte="Enregistrer"
                type="primaire"
                typeHtml="button"
                action={envoieModificationProfil}
              />
            </>
          }
        />
      </main>
      <footer>
        <MenuEnBas />
      </footer>
    </>
  );
}

export default ModificationProfil;
