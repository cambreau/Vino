import MenuEnHaut from "../components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "../components/components-partages/MenuEnBas/MenuEnBas";
import authentificationStore from "../stores/authentificationStore.js";
import { useState, useEffect } from "react";
import { recupererTousCellier } from "../lib/requetes.js";

function SommaireCellier() {
  const utilisateur = authentificationStore((state) => state.utilisateur);
  const idUtilisateur = utilisateur?.id; // Si null ou undefined = undefined
  const [celliers, setCelliers] = useState([]);

  // Charger les celliers au montage du composant
  useEffect(() => {
    const chargerCelliers = async () => {
      if (idUtilisateur) {
        const celliersData = await recupererTousCellier(idUtilisateur);
        if (celliersData) {
          setCelliers(celliersData);
        }
      }
    };
    chargerCelliers();
  }, [idUtilisateur]);

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
