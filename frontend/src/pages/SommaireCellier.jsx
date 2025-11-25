import MenuEnHaut from "../components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "../components/components-partages/MenuEnBas/MenuEnBas";

function SommaireCellier() {
  return (
    <>
      <header>
        <MenuEnHaut titre="Sommaire cellier" />
      </header>
      <main className="min-h-screen font-body max-w-[500px] mx-auto inset-x-0 bg-fond">
        <section className="pt-(--rythme-espace) pb-(--rythme-base) px-(--rythme-serre)"></section>
      </main>
      <footer>
        <MenuEnBas />
      </footer>
    </>
  );
}

export default SommaireCellier;
