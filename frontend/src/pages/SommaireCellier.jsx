import MenuEnHaut from "../components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "../components/components-partages/MenuEnBas/MenuEnBas";

function SommaireCellier() {
  return (
    <>
      <header>
        <MenuEnHaut titre="Sommaire cellier" />
      </header>
      <main
        className="min-h-screen font-body max-w-[500px] mx-auto inset-x-0 relative
      bg-[linear-gradient(0deg,rgba(0,0,0,0.05)25%,rgba(0,0,0,0)),url('../assets/images/sommaireCellier.webp')] bg-cover bg-center bg-fond"
      >
        <div className="absolute inset-0 bg-white/40 pointer-events-none"></div>

        <section className="relative pt-(--rythme-espace) pb-(--rythme-base) px-(--rythme-serre)"></section>
      </main>
      <footer>
        <MenuEnBas />
      </footer>
    </>
  );
}

export default SommaireCellier;
