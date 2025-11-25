import MenuEnHaut from "../components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "../components/components-partages/MenuEnBas/MenuEnBas";
import Formulaire from "../components/components-partages/Formulaire/Formulaire";
import FormulaireInput from "../components/components-partages/Formulaire/FormulaireInput/FormulaireInput";
import Bouton from "../components/components-partages/Boutons/Bouton";
import Message from "../components/components-partages/Message/Message";
import { regex, validationChamp } from "../lib/validationFormulaire.js";
import { recupererUtilisateur, modifierUtilisateur } from "../lib/requetes.js";
import { useState, useEffect } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";

function ModificationProfil() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const echecModification = searchParams.get("echec") == 1;
  const echecDoublon = searchParams.get("echec") == 2;

  //Recuperer id dans l'url
  const { id } = useParams();
  // Les informations utilisateur
  const [utilisateur, setUtilisateur] = useState({
    id: id,
    nom: "",
    courriel: "",
  });

  /**
   * Recuperer les informations de l'utilisateur cote backend.
   */
  useEffect(() => {
    const chargerUtilisateur = async () => {
      const utilisateurDatas = await recupererUtilisateur(id);
      if (utilisateurDatas) {
        setUtilisateur({
          id: utilisateurDatas.id_utilisateur,
          nom: utilisateurDatas.nom,
          courriel: utilisateurDatas.courriel,
        });
      }
    };
    chargerUtilisateur();
  }, [id]);

  // Regroupe les messages d'erreurs à afficher.
  const [erreurs, setErreurs] = useState({
    nom: "",
    courriel: "",
  });

  /**
   * Fonction envoie la modification du profil de l'utilisateur
   * @param {Event} e - L'événement de soumission du formulaire
   */
  const envoieModificationProfil = async (e) => {
    e.preventDefault();

    // Envoyer les données utilisateur
    await modifierUtilisateur(utilisateur, navigate);
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
          id: utilisateurData.id_utilisateur || utilisateurData.id || id,
          nom: utilisateurData.nom || "",
          courriel: utilisateurData.courriel || "",
        });
        setErreurs({
          nom: "",
          courriel: "",
        });
      }
    }
  };

  return (
    <>
      <MenuEnHaut />

      <main
        className="
        px-(--rythme-serre) py-(--rythme-base) grid grid-rows-[1fr_5fr] items-end
        bg-fond
        "
      >
        {echecModification && (
          <Message
            texte="Une erreur est survenue lors de la modification. Veuillez réessayer."
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
                classCouleurLabel="Dark"
                value={utilisateur.nom}
                onChange={(e) => {
                  setUtilisateur((prev) => ({
                    ...prev,
                    nom: e.target.value,
                  }));
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
                  setUtilisateur((prev) => ({
                    ...prev,
                    courriel: valeur,
                  }));
                  // Supprimer le message de doublon si l'utilisateur modifie le courriel
                  if (echecDoublon || echecModification) {
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
            </>
          }
          bouton={
            <>
              <div className="flex flex-wrap gap-(--rythme-base)">
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
              </div>
            </>
          }
        />
      </main>

      <MenuEnBas />
    </>
  );
}

export default ModificationProfil;
