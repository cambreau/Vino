import { useNavigate } from "react-router-dom";
import MenuEnBas from "../components/components-partages/MenuEnBas/MenuEnBas";
import MenuEnHaut from "../components/components-partages/MenuEnHaut/MenuEnHaut";
import Bouton from "../components/components-partages/Boutons/Bouton";
import Icon from "../components/components-partages/Icon/Icon";

function Profil() {
  const supprimerCompte = () => {};
  const modifierCompte = () => {};
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <header>
          <MenuEnHaut />
        </header>
        <main className="flex flex-col bg-(--color-fond-secondaire) m-(--rythme-base) pt-(--rythme-tres-serre) justify-between grow">
          <div>
            <div className="flex justify-between align-items">
              <header>
                <h1 className="text-(length:--taille-moyen) font-medium">
                  Silvia Larois
                </h1>
                <p className="text-(length:--taille-tres-petit)">
                  silvialarois54 <span className="underline">@gmail.com</span>
                </p>
              </header>
              <p>Icone</p>
            </div>

            <div className="flex flex-col mt-8 gap-(--rythme-serre)">
              <p>Nom : Silvia Larois</p>
              <p>Courriel : silvialarois54@gmail.com</p>
              <p>Telephone : +1 555 555 5555 </p>
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
      </div>
    </>
  );
}

export default Profil;
