import { Link } from "react-router-dom";
import MenuEnHaut from "@components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "@components/components-partages/MenuEnBas/MenuEnBas";
import CarteBouteille from "@components/carte/CarteBouteille";
import Message from "@components/components-partages/Message/Message";
import NonTrouver from "@components/components-partages/NonTrouver/NonTrouver";
import Spinner from "@components/components-partages/Spinner/Spinner";
import Filtres from "@components/components-partages/Filtre/Filtre";

import authentificationStore from "@store/authentificationStore";
import { useDocumentTitle } from "@lib/utils.js";
import { useCatalogue } from "@lib/useCatalogue";

function Catalogue() {
  useDocumentTitle("Catalogue");
  const utilisateur = authentificationStore((state) => state.utilisateur);

  const {
    mainRef,
    sentinelRef,
    etat,
    filtresActifs,
    etiquetteTri,
    criteresFiltresStore,
    criteresRechercheStore,
    handleFiltrer,
    handleRecherche,
    handleTri,
    handleSupprimerFiltre,
    handleReinitialiserFiltres,
    ajouterALaListe,
  } = useCatalogue(utilisateur?.id);

  const { chargementInitial, message, scrollLoading, hasMore, bouteilles, total } = etat;
  const messageListeVide = filtresActifs
    ? "Aucune bouteille ne correspond à vos critères"
    : "Aucune bouteille disponible";

  // Si l'utilisateur n'est pas connecté
  if (!utilisateur?.id) {
    return (
      <div className="h-screen font-body grid grid-rows-[auto_1fr_auto] overflow-hidden">
        <header>
          <MenuEnHaut />
        </header>
        <main ref={mainRef} className="bg-fond overflow-y-auto">
          <section className="pt-(--rythme-base) px-(--rythme-serre)">
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

      <main ref={mainRef} className="bg-fond overflow-y-auto">
        <h1 className="text-(length:--taille-grand) mt-(--rythme-base) text-center font-display font-semibold text-principal-300">
          Catalogue des vins
        </h1>

        <section className="pt-(--rythme-espace) px-(--rythme-serre)">
          {message.texte && <Message texte={message.texte} type={message.type} />}

          {/* Filtres - centrés sur mobile et tablette, en colonne jusqu'à xl */}
          <div className="flex flex-col items-center gap-(--rythme-base) mb-(--rythme-espace)">
            <Filtres
              filtresActuels={criteresFiltresStore}
              rechercheActuelle={
                typeof criteresRechercheStore === "string"
                  ? criteresRechercheStore
                  : criteresRechercheStore?.nom || ""
              }
              onFiltrer={handleFiltrer}
              onRecherche={handleRecherche}
              onTri={handleTri}
              onSupprimerFiltre={handleSupprimerFiltre}
              onReinitialiserFiltres={handleReinitialiserFiltres}
              titreTri={etiquetteTri}
              className="shrink-0"
            />
            {total > 0 && (
              <p className="text-(length:--taille-petit) text-texte-secondaire text-center">
                {total} bouteille{total > 1 ? "s" : ""} trouvée{total > 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Grille des bouteilles */}
          <div>
              {chargementInitial ? (
                <div className="flex justify-center items-center py-(--rythme-espace)">
                  <Spinner size={220} ariaLabel="Chargement du catalogue de bouteilles" />
                </div>
              ) : bouteilles.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {bouteilles.map((b) => (
                      <Link key={b.id} to={`/bouteilles/${b.id}`}>
                        <CarteBouteille
                          bouteille={b}
                          type="catalogue"
                          onAjouterListe={ajouterALaListe}
                        />
                      </Link>
                    ))}
                  </div>

                  {hasMore && (
                    <div ref={sentinelRef} className="h-4 w-full" aria-hidden="true" />
                  )}

                  {scrollLoading && (
                    <div className="flex justify-center py-(--rythme-base)">
                      <Spinner size={140} ariaLabel="Chargement de nouvelles bouteilles" />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex justify-center py-(--rythme-espace)">
                  <NonTrouver size={180} message={messageListeVide} />
                </div>
              )}
            </div>
        </section>
      </main>

      <MenuEnBas />
    </div>
  );
}

export default Catalogue;
