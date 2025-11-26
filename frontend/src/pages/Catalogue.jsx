import { useState, useEffect } from "react";
import MenuEnHaut from "../components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "../components/components-partages/MenuEnBas/MenuEnBas";
import CarteBouteille from "../components/carte/CarteBouteille";
import Message from "../components/components-partages/Message/Message";
import { recupererTousBouteilles } from "../lib/requetes";

const etatInitialListe = {
  donnees: [],
  chargement: true,
  message: { texte: "", type: "" },
};

function Catalogue() {
  const [etatListe, setEtatListe] = useState(etatInitialListe);

  useEffect(() => {
    let ignore = false;

    const chargerCatalogue = async () => {
      setEtatListe((etat) => ({
        ...etat,
        chargement: true,
        message: { texte: "", type: "" },
      }));

      const resultat = await recupererTousBouteilles();

      if (ignore) return;

      if (resultat?.succes) {
        setEtatListe({
          donnees: resultat.donnees ?? [],
          chargement: false,
          message: { texte: "", type: "" },
        });
      } else {
        setEtatListe({
          donnees: [],
          chargement: false,
          message: {
            texte: resultat?.erreur || "Impossible de charger le catalogue",
            type: "erreur",
          },
        });
      }
    };

    chargerCatalogue();

    return () => {
      ignore = true;
    };
  }, []);

  const { donnees, chargement, message } = etatListe;

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
              {donnees.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {donnees.map((bouteille) => (
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

