import MenuEnHaut from "../components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "../components/components-partages/MenuEnBas/MenuEnBas";
import Carte from "../components/carte/CarteBouteille";

function Catalogue() {
  return (
    <>
      <MenuEnHaut titre="Catalogue" />

      <main className="min-h-screen font-body max-w-[500px] mx-auto inset-x-0 bg-fond">
        <section className="pt-(--rythme-espace) pb-(--rythme-base) px-(--rythme-serre)">
          {/* Contenu du catalogue à ajouter ici */}
          <Carte />
        </section>
      </main>

      <MenuEnBas />
    </>
  );
}

export default Catalogue;
