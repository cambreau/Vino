import MenuEnHaut from "../components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "../components/components-partages/MenuEnBas/MenuEnBas";
import { useNavigate } from "react-router-dom";
import Bouton from "../components/components-partages/Boutons/Bouton";
import Message from "../components/components-partages/Message/Message";

function Celliers() {
  const navigate = useNavigate();
  return (
    <>
      <header>
        {/* Menu haut fixe */}
        <MenuEnHaut titre="Celliers" />
      </header>
      <main className="min-h-screen font-body max-w-[500px] mx-auto inset-x-0 bg-fond">
        <section className="pt-(--rythme-espace) pb-(--rythme-base) px-(--rythme-serre)">
          {/* Contenu du catalogue (celliers) à ajouter ici */}
          <h1 className="text-(length:--taille-moyen) text-center font-display font-semibold text-principal-300">
            Cellier - NomDuCellier
          </h1>
          <article className="mt-(--rythme-base) p-(--rythme-serre) min-h-[200px] flex flex-col items-center justify-center">
            {/* Contenu des bouteilles dans le cellier à ajouter ici */}
            {/* Message lorsque le cellier est vide */}
            <div className="mb-(--rythme-base) w-full ">
              <Message
                type="erreur"
                texte="Vous n'avez pas encore de bouteilles dans ce cellier."
              />
            </div>
            {/* Bouton CTA vers l'ajout d'une bouteille (catalogue) */}
            <Bouton
              taille="moyen"
              texte="Ajouter une bouteille"
              type="primaire"
              typeHtml="button"
              action={() => {
                navigate("/catalogue");
              }}
            />
          </article>
        </section>
      </main>
      <footer>
        {/* Menu bas fixe */}
        <MenuEnBas />
      </footer>
    </>
  );
}

export default Celliers;
