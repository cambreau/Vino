import { useState } from "react";
import MenuEnHaut from "@components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "@components/components-partages/MenuEnBas/MenuEnBas";
import Message from "@components/components-partages/Message/Message";



import authentificationStore from "@store/authentificationStore";
import { useDocumentTitle } from "@lib/utils.js";

function ListeAchat() {

useDocumentTitle("Liste d'achat");
const utilisateur = authentificationStore((state) => state.utilisateur);

  const [etat, setEtat] = useState({
    bouteilles: [],
    chargement: true,
    erreur: null
  });

// Vérification de l'authentification
if (!utilisateur?.id) {
    return (
      <div className="h-screen font-body grid grid-rows-[auto_1fr_auto] overflow-hidden">
        <header>
          <MenuEnHaut />
        </header>
        <main className="bg-fond overflow-y-auto">
          <section className="pt-(--rythme-espace) px-(--rythme-serre)">
            <Message
              texte="Vous devez être connecté pour accéder à votre liste d'achat"
              type="erreur"
            />
          </section>
        </main>
        <MenuEnBas />
      </div>
    );
}

return (
    <div className="h-screen font-body grid grid-rows-[auto_1fr_auto] overflow-hidden">
      <header>
        <MenuEnHaut />
      </header>
      <main className="bg-fond overflow-y-auto">
        <section className="pt-(--rythme-espace) px-(--rythme-serre)">
         
        </section>
      </main>
      <MenuEnBas />
    </div>
  );
}

export default ListeAchat;