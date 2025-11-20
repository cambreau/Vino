import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { recupererUtilisateur } from "../lib/requetes.js";
import MenuEnBas from "../components/components-partages/MenuEnBas/MenuEnBas";
import MenuEnHaut from "../components/components-partages/MenuEnHaut/MenuEnHaut";
import Bouton from "../components/components-partages/Boutons/Bouton";
import Icon from "../components/components-partages/Icon/Icon";

function Profil() {
  const [utilisateur, setUtilisateur] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const chargerUtilisateur = async () => {
      const userConnecte = JSON.parse(localStorage.getItem("utilisateur"));
      if (!userConnecte || !userConnecte.id_utilisateur) {
        navigate("/connexion");
        return;
      }

      const data = await recupererUtilisateur(userConnecte.id_utilisateur);
      setUtilisateur(data);
    };
    chargerUtilisateur();
  }, [navigate]);

  const supprimerCompte = () => {
    // TODO : implémenter la suppression
    console.log("Supprimer compte");
  };
  const modifierCompte = () => {
    // TODO : implémenter la modification
    console.log("Modifier compte");
  };

  return (
    <>
      <section className="flex flex-col min-h-screen">
        <header>
          <MenuEnHaut />
        </header>
        <main className="flex flex-col bg-(--color-fond-secondaire) m-(--rythme-base) pt-(--rythme-tres-serre) justify-between grow">
          <div>
            <div className="flex justify-between align-items">
              <header>
                <h1 className="text-(length:--taille-moyen) font-medium">
                  {utilisateur.nom}
                </h1>
                <p className="text-(length:--taille-tres-petit)">
                  {utilisateur.courriel}
                </p>
              </header>
              <p>Icone</p>
            </div>

            <div className="flex flex-col mt-8 gap-(--rythme-serre)">
              <p>{utilisateur.nom}</p>
              <p>{utilisateur.courriel}</p>
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
    </>
  );
}

export default Profil;
