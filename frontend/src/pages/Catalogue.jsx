import { useState, useEffect } from "react";
import MenuEnHaut from "../components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "../components/components-partages/MenuEnBas/MenuEnBas";
import CarteBouteille from "../components/carte/CarteBouteille";
import Message from "../components/components-partages/Message/Message";
import { recupererBouteilles } from "../lib/requetes";

function Catalogue() {
  const [bouteilles, setBouteilles] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [message, setMessage] = useState({ texte: "", type: "" });

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
            <div className="text-center py-8">
              <p className="text-texte-secondaire">
                Chargement du catalogue...
              </p>
            </div>
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
                <div className="text-center py-8">
                  <p className="text-texte-secondaire">
                    Aucune bouteille disponible dans le catalogue
                  </p>
                </div>
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
