import { useState,useEffect } from "react";
import MenuEnHaut from "@components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "@components/components-partages/MenuEnBas/MenuEnBas";
import Message from "@components/components-partages/Message/Message";
import Spinner from "@components/components-partages/Spinner/Spinner";


import authentificationStore from "@store/authentificationStore";
import { useDocumentTitle } from "@lib/utils.js";
import { recupererListeAchat } from "@lib/requetes";


function ListeAchat() {

useDocumentTitle("Liste d'achat");
const utilisateur = authentificationStore((state) => state.utilisateur);

  const [etat, setEtat] = useState({
    bouteilles: [],
    chargement: true,
    erreur: null
  });


  // useEffect pour charger les données
  useEffect(() => {
    if (!utilisateur?.id) {
      setEtat({
        bouteilles: [],
        chargement: false,
        erreur: "Utilisateur non connecté"
      });
      return;
    }

    let ignore = false;

    const chargerListeAchat = async () => {
      try {
        setEtat(prev => ({ ...prev, chargement: true, erreur: null }));
        
        const donnees = await recupererListeAchat(utilisateur.id);
        
        if (ignore) return;
        
        setEtat({
          bouteilles: donnees?.donnees ?? donnees ?? [],
          chargement: false,
          erreur: null
        });
      } catch (err) {
        if (ignore) return;
        
        console.error("Erreur lors du chargement de la liste d'achat:", err);
        setEtat({
          bouteilles: [],
          chargement: false,
          erreur: "Impossible de charger la liste d'achat"
        });
      }
    };

    chargerListeAchat();

    return () => {
      ignore = true;
    };
  }, [utilisateur?.id]);


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