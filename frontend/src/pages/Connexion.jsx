import Formulaire from "../components/components-partages/Formulaire/Formulaire";
import FormulaireInput from "../components/components-partages/Formulaire/FormulaireInput/FormulaireInput";
import Bouton from "../components/components-partages/Boutons/Bouton";
import BoutonRetour from "../components/components-partages/Boutons/BoutonRetour";
import Message from "../components/components-partages/Message/Message";

import { regex, validationChamp } from "../lib/validationFormulaire.js";
import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

function Connexion() {
  const navigation = useNavigate();

  // Stocker les valeurs des champs
  const [valeurs, setValeurs] = useState({
    email: "",
    motDePasse: "",
  });

  // Stocker les messages d'erreurs de chaque champ
  const [erreurs, setErreurs] = useState({
    email: "",
    motDePasse: "",
  });

  // Fonction appelée quand on clique sur le bouton retour
  const gererRetour = () => {
    navigation(-1);
  };

  return (
    <main
      className="
      flex flex-col items-center justify-center min-h-screen py-10 px-5
      font-body
      bg-[linear-gradient(0deg,rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url('../assets/images/connexion-bg.webp')] bg-cover bg-center
      "
    >
      {/* Bouton retour en haut */}
      <div className="w-full max-w-md mb-8">
        <BoutonRetour action={gererRetour} />
      </div>

      <section className="w-full max-w-md">
        <Formulaire
          titreFormulaire="Se connecter"
          method="POST"
          enfants={
            <>
              {/* Champ email */}
              <FormulaireInput
                type="email"
                nom="courriel"
                genre="un"
                estObligatoire={true}
                onChange={(e) => {
                  // Récupère la valeur saisie dans le champ
                  const valeur = e.target.value;
                  
                  // Vérifie si l'email respecte le format attendu
                  if (!validationChamp(regex.regEmail, valeur)) {
                    // Si invalide, affiche un message d'erreur
                    const erreur = "Veuillez saisir un email valide.";
                    setErreurs((prev) => ({ ...prev, email: erreur }));
                  } else {
                    // Si valide, efface le message d'erreur
                    setErreurs((prev) => ({ ...prev, email: "" }));
                  }
                }}
              />
              {/* Affiche le message d'erreur s'il existe */}
              {erreurs.email && (
                <Message 
                  texte={erreurs.email} 
                  type="erreur"
                  onClose={() => setErreurs((prev) => ({ ...prev, email: "" }))}
                />
              )}

              {/* Champ mot de passe */}
              <FormulaireInput
                type="password"
                nom="mot de passe"
                genre="un"
                estObligatoire={true}
                onChange={(e) => {
                  // Récupère la valeur saisie dans le champ
                  const valeur = e.target.value;
                  
                  // Vérifie si le mot de passe respecte les critères de sécurité
                  if (!validationChamp(regex.regMotDePasse, valeur)) {
                    // Si invalide, affiche un message d'erreur détaillé
                    const erreur =
                      "Le mot de passe doit contenir au moins 8 caractères, dont une lettre majuscule, une lettre minuscule et un caractère spécial";
                    setErreurs((prev) => ({ ...prev, motDePasse: erreur }));
                  } else {
                    // Si valide, efface le message d'erreur
                    setErreurs((prev) => ({ ...prev, motDePasse: "" }));
                  }
                }}
              />
              {/* Affiche le message d'erreur s'il existe */}
              {erreurs.motDePasse && (
                <Message 
                  texte={erreurs.motDePasse} 
                  type="erreur"
                  onClose={() => setErreurs((prev) => ({ ...prev, motDePasse: "" }))}
                />
              )}

              {/* Lien "Mot de passe oublié?" */}
              <div className="text-right mt-2">
                <Link
                  to="/mot-de-passe-oublie"
                  className="
                  text-(length:--taille-petit)
                  text-texte-premier
                  hover:text-principal-200 transition-colors
                  "
                >
                  Mot de passe oublié?
                </Link>
              </div>
            </>
          }
          bouton={<Bouton texte="Se connecter" typeHtml="submit" />}
        />
      </section>
    </main>
  );
}

export default Connexion;