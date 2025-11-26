import MenuEnHaut from "../components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "../components/components-partages/MenuEnBas/MenuEnBas";
import CarteBouteille from "../components/carte/CarteBouteille";
import Message from "../components/components-partages/Message/Message";
import bouteillesStore from "../stores/bouteillesStore";

function Catalogue() {
  const { bouteilles, erreur, chargement } = bouteillesStore();

  const enChargement = chargement || (!bouteilles.length && !erreur);

  return (
    <div className="h-screen font-body grid grid-rows-[auto_1fr_auto] overflow-hidden">
      <header>
        <MenuEnHaut />
      </header>

      <main className="font-body bg-fond overflow-y-auto">
        <section className="pt-(--rythme-espace) pb-(--rythme-base) px-(--rythme-serre)">
          {erreur && (
            <div className="mb-4">
              <Message texte={erreur} type="erreur" />
            </div>
          )}

          {enChargement ? (
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
