import MenuEnHaut from "../components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "../components/components-partages/MenuEnBas/MenuEnBas";
import authentificationStore from "../stores/authentificationStore.js";
import { useState, useEffect } from "react";
import { recupererTousCellier, creerCellier } from "../lib/requetes.js";
import Bouton from "../components/components-partages/Boutons/Bouton";

function SommaireCellier() {
  const utilisateur = authentificationStore((state) => state.utilisateur);
  const idUtilisateur = utilisateur?.id; // Si null ou undefined = undefined
  const [celliers, setCelliers] = useState([]);

  // Fonction pour charger les celliers
  const chargerCelliers = async () => {
    if (idUtilisateur) {
      const celliersDatas = await recupererTousCellier(idUtilisateur);
      if (celliersDatas) {
        setCelliers(celliersDatas);
      }
    }
  };

  // Charger les celliers
  useEffect(() => {
    chargerCelliers();
  }, [idUtilisateur]); // Permet de charger au montage du component

  // Fonction pour gerer la creation d'un nouveau cellier
  const gererCreerCellier = async () => {
    const resultat = await creerCellier(idUtilisateur);
    await chargerCelliers();
  };

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

        <section className="relative pt-(--rythme-espace) pb-(--rythme-base) px-(--rythme-serre)">
          <div className="mb-(--rythme-base)">
            <Bouton
              taille="moyen"
              texte="Ajouter un cellier"
              type="primaire"
              typeHtml="button"
              action={gererCreerCellier}
            />
          </div>
        </section>
      </main>
      <footer>
        <MenuEnBas />
      </footer>
    </>
  );
}

export default SommaireCellier;
