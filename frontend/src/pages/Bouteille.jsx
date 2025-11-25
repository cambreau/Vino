import MenuEnHaut from "../components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "../components/components-partages/MenuEnBas/MenuEnBas";
import Bouton from "../components/components-partages/Boutons/Bouton";

import { formatDetailsBouteille } from "../lib/utils.js";
import { recupererBouteille } from "../lib/requetes.js";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    <>
      <header>
        {/* Menu haut fixe */}
        <MenuEnHaut titre="Bouteille" />
      </header>
      <main className="flex gap-(--rythme-tres-serre) h-screen font-body max-w-[500px] mx-auto py-(--rythme-base) bg-fond">
        <picture className="w-1/2 max-h-[800px]">
          <img
            src={bouteille.image}
            alt=""
            className="w-full h-full object-cover"
          />
        </picture>
        <div className="flex flex-col flex-1 py-(--rythme-base) px-(--rythme-serre)">
          <header>
            <h1 className="text-(--color-principal-300) text-(length:--taille-moyen)">
              <strong>{bouteille.nom}</strong>
            </h1>
            <hr className="my-(--rythme-serre)" />
          </header>
          <div className="flex flex-col gap-(--rythme-tres-serre)">
            <div className="flex flex-col gap-(--rythme-tres-serre)">
              <h2 className="text-(--color-principal-300)">
                <strong>Type:</strong>
              </h2>
              <p> {bouteille.type}</p>
            </div>
            <div className="flex flex-col gap-(--rythme-tres-serre)">
              <h2 className="text-(--color-principal-300)">
                <strong>Millésime :</strong>
              </h2>
              <p>{bouteille.millenisme}</p>
            </div>
            <div className="flex flex-col gap-(--rythme-tres-serre)">
              <h2 className="text-(--color-principal-300)">
                <strong>Region : </strong>
              </h2>
              <p>{bouteille.region}</p>
            </div>
            <div className="flex flex-col gap-(--rythme-tres-serre)">
              <h2 className="text-(--color-principal-300)">
                <strong>Degré d'alcool : </strong>
              </h2>
              <p> {bouteille.tauxAlcool}</p>
            </div>
            <div className="flex flex-col gap-(--rythme-tres-serre)">
              <h2 className="text-(--color-principal-300)">
                <strong>Cepage : </strong>
              </h2>
              <p> {bouteille.cepage}</p>
            </div>
            <div className="flex flex-col gap-(--rythme-tres-serre)">
              <h2 className="text-(--color-principal-300)">
                <strong>Accords : </strong>
              </h2>
              <p>{bouteille.description}</p>
            </div>
          </div>
          {/* Bouton CTA vers l'ajout d'une bouteille (catalogue) */}
          <div className="mt-auto">
            <Bouton
              taille="moyen"
              texte="Ajouter cette bouteille"
              type="primaire"
              typeHtml="button"
              action={() => {
                navigate("/catalogue");
              }}
            />
          </div>
        </div>
      </main>
      <footer>
        {/* Menu bas fixe */}
        <MenuEnBas />
      </footer>
    </>
  );
}

export default Bouteille;
