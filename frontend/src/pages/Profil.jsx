import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import MenuEnBas from "../components/components-partages/MenuEnBas/MenuEnBas";
import MenuEnHaut from "../components/components-partages/MenuEnHaut/MenuEnHaut";
import Bouton from "../components/components-partages/Boutons/Bouton";
import { FaUser } from "react-icons/fa";
import authentificationStore from "../stores/authentificationStore";

function Profil() {
  const navigate = useNavigate();

  // Récupérer les données du store
  const utilisateur = authentificationStore((state) => state.utilisateur);
  const estConnecte = authentificationStore((state) => state.estConnecte);

  useEffect(() => {
    if (!estConnecte || !utilisateur) {
      navigate("/connexion");
      return;
    }
  }, [estConnecte, utilisateur, navigate]);

  const supprimerCompte = () => {
    // TODO : implémenter la suppression
    console.log("Supprimer compte");
  };
  const modifierCompte = () => {
    if (utilisateur && utilisateur.id) {
      navigate(`/modifier-utilisateur/${utilisateur.id}`);
    }
  };

  return (
    <section className="flex flex-col min-h-screen">
      <header>
        <MenuEnHaut />
      </header>

      <main className="flex flex-col bg-fond px-(--rythme-base) pt-(--rythme-espace) gap-(--rythme-espace) grow">
        <div>
          <section className="flex items-center justify-between">
            <div>
              <h1 className="text-(length:--taille-moyen) font-display font-bold text-texte-premier">
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
            action={supprimerCompte}
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

      <footer>
        <MenuEnBas />
      </footer>
    </section>
  );
}

export default Profil;
