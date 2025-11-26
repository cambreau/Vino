import MenuEnHaut from "../components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "../components/components-partages/MenuEnBas/MenuEnBas";
import CarteBouteille from "../components/carte/CarteBouteille";
import Message from "../components/components-partages/Message/Message";
import bouteillesStore from "../stores/bouteillesStore";

function Catalogue() {
  const { bouteilles, erreur, chargement } = bouteillesStore();

  const enChargement = chargement || (!bouteilles.length && !erreur);

  return (
    <>
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

      {/* Fenêtre modale d’ajout  */}
      {modale.ouverte && modale.bouteille && (
        <BoiteModale
          texte="Confirmation d'ajout"
          contenu={
            <div className="w-full">
              <p className="text-texte-principal font-bold text-center mb-(--rythme-base)">
                {modale.bouteille.nom}
              </p>

              <div className="mb-(--rythme-base)">
                <FormulaireSelect
                  nom="Cellier"
                  genre="un"
                  estObligatoire={true}
                  arrayOptions={celliers.map((c) => c.nom)}
                  value={
                    celliers.find(
                      (c) => String(c.id_cellier) === cellierSelectionne
                    )?.nom || ""
                  }
                  onChange={(e) => {
                    const c = celliers.find((x) => x.nom === e.target.value);
                    if (c) changerCellier(String(c.id_cellier));
                  }}
                  classCouleur="Clair"
                  fullWidth={true}
                />
              </div>

              {modale.existe ? (
                <Message
                  texte={`Cette bouteille est déjà dans ce cellier (quantité : ${modale.quantite})`}
                  type="information"
                />
              ) : (
                <div className="flex items-center justify-center gap-(--rythme-serre)">
                  <span className="text-texte-secondaire">Quantité :</span>

                  <BoutonQuantite
                    type="diminuer"
                    onClick={() => modifierQuantite("diminuer")}
                    disabled={modale.quantite <= 1}
                  />

                  <span className="min-w-8 px-2 text-texte-principal font-bold">
                    {modale.quantite}
                  </span>

                  <BoutonQuantite
                    type="augmenter"
                    onClick={() => modifierQuantite("augmenter")}
                  />
                </div>
              )}
            </div>
          }
          bouton={
            <>
              <Bouton
                texte="Ajouter"
                type="primaire"
                typeHtml="button"
                action={confirmerAjout}
                disabled={modale.existe}
              />
              <Bouton
                texte="Annuler"
                type="secondaire"
                typeHtml="button"
                action={fermerModale}
              />
            </>
          }
        />
      )}
    </>
  );
}

export default Catalogue;
