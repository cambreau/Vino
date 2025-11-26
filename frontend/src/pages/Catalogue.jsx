import { useState, useEffect } from "react";
import MenuEnHaut from "../components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "../components/components-partages/MenuEnBas/MenuEnBas";
import CarteBouteille from "../components/carte/CarteBouteille";
import Message from "../components/components-partages/Message/Message";
import { recupererBouteilles } from "../lib/requetes";
import authentificationStore from "../stores/authentificationStore";

function Catalogue() {
  const [bouteilles, setBouteilles] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [message, setMessage] = useState({ texte: "", type: "" });

  // Récupérer l'utilisateur connecté
  const utilisateur = authentificationStore((state) => state.utilisateur);

  useEffect(() => {
    const chargerBouteilles = async () => {
      try {
        const data = await recupererBouteilles();
        if (!data || !data.donnees) {
          setMessage({
            texte: "Impossible de charger le catalogue",
            type: "erreur",
          });
          setChargement(false);
          return;
        }
        setBouteilles(data.donnees);
        setChargement(false);
      } catch (erreur) {
        console.error("Erreur:", erreur);
        setMessage({
          texte: "Impossible de charger le catalogue",
          type: "erreur",
        });
        setChargement(false);
      }
    };
    chargerBouteilles();
  }, []);

  // Vérification utilisateur connecté
  if (!utilisateur || !utilisateur.id) {
    return (
      <div className="h-screen font-body grid grid-rows-[auto_1fr_auto] overflow-hidden">
        <header>
          <MenuEnHaut />
        </header>
        <main className="font-body bg-fond overflow-y-auto">
          <section className="pt-(--rythme-espace) pb-(--rythme-base) px-(--rythme-serre)">
            <Message 
              texte="Vous devez être connecté pour accéder au catalogue"
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
      <main className="font-body bg-fond overflow-y-auto">
        <section className="pt-(--rythme-espace) pb-(--rythme-base) px-(--rythme-serre)">
          {message.texte && (
            <div className="mb-4">
              <Message texte={message.texte} type={message.type} />
            </div>
          )}
          {chargement ? (
            <Message texte="Chargement du catalogue..." type="information" />
          ) : (
            <>
              {bouteilles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {bouteilles.map((bouteille) => (
                    <CarteBouteille
                      key={bouteille.id}
                      bouteille={bouteille}
                      type="catalogue"
                    />
                  ))}
                </div>
              ) : (
                <Message
                  texte="Aucune bouteille disponible dans le catalogue"
                  type="information"
                />
              )}
            </>
          )}
        </section>
      </main>
      <MenuEnBas />
    </div>
  );
}

export default Catalogue;