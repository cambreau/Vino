import MenuEnHaut from "../components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "../components/components-partages/MenuEnBas/MenuEnBas";
import { useNavigate } from "react-router-dom";
import Bouton from "../components/components-partages/Boutons/Bouton";
import Message from "../components/components-partages/Message/Message";
import heroBienvenue from "../assets/images/heroBienvenue.webp";

function Celliers() {
  const navigate = useNavigate();
  return (
    <>
      <header>
        {/* Menu haut fixe */}
        <MenuEnHaut titre="Vin" />
      </header>
      <main className="flex gap-(--rythme-tres-serre) h-screen font-body max-w-[500px] mx-auto inset-x-0 bg-fond">
        <picture className="w-2/5">
          <img
            src={heroBienvenue}
            alt=""
            className="w-full h-full object-cover"
          />
        </picture>
        <div className="flex flex-col flex-1 py-(--rythme-base) px-(--rythme-serre)">
          <header>
            <h1>titre du vin, un teste pour un nom trop long</h1>
            <hr className="my-(--rythme-serre)" />
          </header>
          <div className="flex flex-col gap-(--rythme-tres-serre) ">
            <div className="flex flex-col gap-(--rythme-tres-serre)">
              <h2>
                <strong>Type:</strong>
              </h2>
              <p>Type</p>
            </div>
            <div className="flex flex-col gap-(--rythme-tres-serre)">
              <h2>
                <strong>Millésime :</strong>
              </h2>
              <p>2012</p>
            </div>
            <div className="flex flex-col gap-(--rythme-tres-serre)">
              <h2>
                <strong>Température : </strong>
              </h2>
              <p>Type</p>
            </div>
            <div className="flex flex-col gap-(--rythme-tres-serre)">
              <h2>
                <strong>Degré d'alcool : </strong>
              </h2>
              <p>Type</p>
            </div>
            <div className="flex flex-col gap-(--rythme-tres-serre)">
              <h2>
                <strong>Volume : </strong>
              </h2>
              <p>Type</p>
            </div>
            <div className="flex flex-col gap-(--rythme-tres-serre)">
              <h2>
                <strong>Accords : </strong>
              </h2>
              <p>
                Pâtes sauce tomate L'acidité du vin s'équilibre bien avec la
                sauce tomate piquante. Légumes grillés Rehausse la douceur
                naturelle des légumes grillés.
              </p>
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

export default Celliers;
