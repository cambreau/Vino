import MenuEnHaut from "@components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "@components/components-partages/MenuEnBas/MenuEnBas";
import Bouton from "@components/components-partages/Boutons/Bouton";
import BoutonRetour from "@components/components-partages/Boutons/BoutonRetour";
import HistoriqueNotes from "@components/HistoriqueNotes/HistoriqueNotes";

import { formatDetailsBouteille } from "@lib/utils.js";
import { useDocumentTitle } from "@lib/utils.js";
import { recupererBouteille } from "@lib/requetes.js";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BoiteModaleAjoutBouteilleCellier from "@components/boiteModaleAjoutBouteilleCellier/boiteModaleAjoutBouteilleCellier";

function Bouteille() {
  const navigate = useNavigate();
  //Recuperer id dans l'url
  const { id } = useParams();
  // Les informations utilisateur
  const [bouteille, setBouteille] = useState({
    id: id,
    nom: "",
    millenisme: "",
    region: "",
    cepage: "",
    image: "",
    description: "",
    tauxAlcool: "",
    prix: "",
    pays: "",
    type: "",
  });

  useDocumentTitle(bouteille.nom || "Bouteille");

  // État pour contrôler l'ouverture de la modale
  const [modaleOuverte, setModaleOuverte] = useState(false);

  // Scroller vers la section Historique Notes si le hash est présent dans l'URL
  useEffect(() => {
    if (window.location.hash === "#historique-notes") {
      setTimeout(() => {
        const element = document.getElementById("historique-notes");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [id]);

  /**
   * Recuperer les informations d'une bouteille' cote backend.
   */
  useEffect(() => {
    const chargerBouteille = async () => {
      const bouteilleDatas = await recupererBouteille(id);

      if (bouteilleDatas) {
        const bouteilleData = bouteilleDatas.donnees;

        setBouteille({
          id: bouteilleData.id,
          nom: bouteilleData.nom,
          millenisme: bouteilleData.millenisme,
          region: bouteilleData.region,
          cepage: bouteilleData.cepage,
          image: bouteilleData.image,
          description: formatDetailsBouteille(bouteilleData.description),
          tauxAlcool: bouteilleData.tauxAlcool,
          prix: bouteilleData.prix,
          pays: bouteilleData.pays,
          type: bouteilleData.type,
        });
      }
    };
    chargerBouteille();
  }, [id]);

  return (
    <div className="h-screen font-body grid grid-rows-[auto_1fr_auto]  overflow-hidden">
      <header>
        {/* Menu haut fixe */}
        <MenuEnHaut />
      </header>
      <main className="py-(--rythme-base) px-(--rythme-serre) bg-fond overflow-y-auto">
        <article className=" font-body">
          <header>
            <BoutonRetour />
            <h1 className="text-principal-300 text-(length:--taille-grand) text-center mt-(--rythme-base)">
              <strong>{bouteille.nom}</strong>
            </h1>
          </header>
          <div className="flex flex-col gap-(--rythme-base) mt-(--rythme-base)">
            <picture className="flex items-center justify-center">
              <img
                src={
                  bouteille.image ||
                  "/Vino/frontend/src/assets/images/grape_logo.svg"
                } // À remplacer par une image par défaut
                alt={bouteille.nom || "Bouteille de vin"}
                className="h-auto w-auto max-h-[300px] object-contain"
              />
            </picture>
            <div className="flex flex-col py-(--rythme-base) px-(--rythme-serre)">
              <header>
                <h2 className="mb-2 text-(length:--taille-normal) font-semibold text-texte-premier">
                  Détails de la bouteille
                </h2>
                <hr className="my-(--rythme-serre)" />
              </header>
              <div className="flex flex-col gap-(--rythme-serre)">
                <section className="flex gap-(--rythme-base) border-b-[0.5px] border-gray-300 pb-(--rythme-serre)">
                  <h3 className="text-principal-300 w-1/3">
                    <strong>Type:</strong>
                  </h3>
                  <p className="flex-1"> {bouteille.type}</p>
                </section>
                <section className="flex gap-(--rythme-base) border-b-[0.5px] border-gray-300 pb-(--rythme-serre)">
                  <h3 className="text-principal-300 w-1/3">
                    <strong>Millésime :</strong>
                  </h3>
                  <p className="flex-1">{bouteille.millenisme}</p>
                </section>
                <section className="flex gap-(--rythme-base) border-b-[0.5px] border-gray-300 pb-(--rythme-serre)">
                  <h3 className="text-principal-300 w-1/3">
                    <strong>Region : </strong>
                  </h3>
                  <p className="flex-1">{bouteille.region}</p>
                </section>
                <section className="flex gap-(--rythme-base) border-b-[0.5px] border-gray-300 pb-(--rythme-serre)">
                  <h3 className="text-principal-300 w-1/3">
                    <strong>Degré d'alcool : </strong>
                  </h3>
                  <p className="flex-1"> {bouteille.tauxAlcool} %</p>
                </section>
                <section className="flex gap-(--rythme-base) border-b-[0.5px] border-gray-300 pb-(--rythme-serre)">
                  <h3 className="text-principal-300 w-1/3">
                    <strong>Cepage : </strong>
                  </h3>
                  <p className="flex-1"> {bouteille.cepage}</p>
                </section>
                <section className="flex gap-(--rythme-base)">
                  <h3 className="text-principal-300 w-1/3">
                    <strong>Accords : </strong>
                  </h3>
                  <p className="flex-1">{bouteille.description}</p>
                </section>
                {/* Bouton pour ajouter/modifier une bouteille dans le cellier */}
                <div className="mb-(--rythme-base) pt-(--rythme-base)">
                  <Bouton
                    taille="moyen"
                    texte="Ajouter au cellier"
                    type="primaire"
                    typeHtml="button"
                    action={() => {
                      setModaleOuverte(true);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </article>
        <div className="flex flex-col gap-(--rythme-serre) mx-(--rythme-serre)">
          <HistoriqueNotes id_bouteille={id} />
        </div>
      </main>

      <MenuEnBas />

      {/* Modale pour ajouter/modifier la bouteille au cellier */}
      <BoiteModaleAjoutBouteilleCellier
        id_bouteille={id}
        nom_bouteille={bouteille.nom}
        estOuverte={modaleOuverte}
        onFermer={() => setModaleOuverte(false)}
      />
    </div>
  );
}

export default Bouteille;
