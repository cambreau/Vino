import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MenuEnHaut from "../components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "../components/components-partages/MenuEnBas/MenuEnBas";
import Bouton from "../components/components-partages/Boutons/Bouton";
import Message from "../components/components-partages/Message/Message";
import CarteBouteille from "../components/carte/CarteBouteille";
import {
  recupererCellier,
  recupererBouteillesCellier,
} from "../lib/requetes.js";

function Cellier() {
  const navigate = useNavigate();
  // Récupérer id du cellier dans l'URL
  const { idCellier } = useParams();

  // Etat pour le cellier : nom
  const [cellier, setCellier] = useState({
    nom: "",
  });

  useEffect(() => {
    const chargerCellier = async () => {
      const donneesCellier = await recupererCellier(idCellier);
      setCellier({
        nom: donneesCellier.nom || "",
      });
    };
    chargerCellier();
  }, [idCellier]);

  // Etat pour les bouteilles : récupérer les bouteilles complètes du cellier
  const [bouteillesCellier, setBouteillesCellier] = useState([]);
  const [chargementBouteilles, setChargementBouteilles] = useState(false);

  useEffect(() => {
    const chargerBouteillesCellier = async () => {
      setChargementBouteilles(true);
      const datas = await recupererBouteillesCellier(idCellier);
      console.log("Bouteilles récupérées pour le cellier:", datas);
      setBouteillesCellier(datas || []);
      setChargementBouteilles(false);
    };
    chargerBouteillesCellier();
  }, [idCellier]);

  return (
    <div className="h-screen font-body grid grid-rows-[auto_1fr_auto] overflow-hidden">
      <header>
        <MenuEnHaut />
      </header>

      <main className="bg-fond overflow-y-auto">
        <section className="pt-(--rythme-espace) pb-(--rythme-base) px-(--rythme-serre)">
          <h1 className="text-(length:--taille-moyen) text-center font-display font-semibold text-principal-300">
            Cellier - {cellier.nom}
          </h1>

          <article className="mt-(--rythme-base) p-(--rythme-serre) min-h-[200px]">
            {chargementBouteilles ? (
              <Message
                type="information"
                texte="Chargement des bouteilles du cellier..."
              />
            ) : bouteillesCellier.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bouteillesCellier.map((bouteille) => (
                  <CarteBouteille
                    key={bouteille.id}
                    bouteille={bouteille}
                    type="cellier"
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-(--rythme-base)">
                <div className="mb-(--rythme-base) w-full">
                  <Message
                    type="information"
                    texte="Vous n'avez pas encore de bouteilles dans ce cellier."
                  />
                </div>

                <Bouton
                  taille="moyen"
                  texte="Ajouter une bouteille"
                  type="primaire"
                  typeHtml="button"
                  action={() => {
                    navigate("/catalogue");
                  }}
                />
              </div>
            )}
          </article>
        </section>
      </main>

      <MenuEnBas />
    </div>
  );
}

export default Cellier;
