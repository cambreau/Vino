import MenuEnHaut from "../components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "../components/components-partages/MenuEnBas/MenuEnBas";
import authentificationStore from "../stores/authentificationStore.js";
import { useState, useEffect } from "react";
import { recupererTousCellier, creerCellier } from "../lib/requetes.js";
import Bouton from "../components/components-partages/Boutons/Bouton";
import FormulaireInput from "../components/components-partages/Formulaire/FormulaireInput/FormulaireInput";
import BoiteModale from "../components/components-partages/BoiteModale/BoiteModale";
import Message from "../components/components-partages/Message/Message";
import CarteCellier from "../components/carte-cellier/CarteCellier";

function SommaireCellier() {
  const utilisateur = authentificationStore((state) => state.utilisateur);
  const idUtilisateur = utilisateur?.id; // Si null ou undefined = undefined
  const [celliers, setCelliers] = useState([]);
  const [estModaleOuverte, setEstModaleOuverte] = useState(false);
  const [nomCellier, setNomCellier] = useState("");

  // Fonction pour charger les celliers
  const chargerCelliers = async () => {
    if (idUtilisateur) {
      const celliersDatas = await recupererTousCellier(idUtilisateur);
      if (celliersDatas) {
        setCelliers(celliersDatas);
      }
    }
  };

  // Charger les celliers
  useEffect(() => {
    chargerCelliers();
  }, [idUtilisateur]); // Permet de charger au montage du component

  // Fonction pour ouvrir la boite modale de creation
  const gererCreerCellier = () => {
    setEstModaleOuverte(true);
  };

  // Fonction pour fermer la boite modale de creation
  const fermerModale = () => {
    setEstModaleOuverte(false);
    setNomCellier("");
  };

  // Fonction pour creer le cellier avec le nom
  const creerCellierAvecNom = async () => {
    const resultat = await creerCellier(idUtilisateur, nomCellier);
    if (resultat.succes) {
      await chargerCelliers();
      fermerModale();
    }
  };

  return (
    <>
      <header>
        <MenuEnHaut titre="Sommaire celliers" />
      </header>
      <main
        className="min-h-screen font-body max-w-[500px] mx-auto inset-x-0 relative
      bg-[linear-gradient(0deg,rgba(0,0,0,0.05)25%,rgba(0,0,0,0)),url('../assets/images/sommaireCellier.webp')] bg-cover bg-center bg-fond"
      >
        <div className="absolute inset-0 bg-white/40 pointer-events-none"></div>

        <section className="relative pt-(--rythme-espace) pb-(--rythme-base) px-(--rythme-serre)">
          <Bouton
            taille="moyen"
            texte="Ajouter un cellier"
            type="primaire"
            typeHtml="button"
            action={gererCreerCellier}
          />

          {/* Message si aucun cellier */}
          {celliers.length === 0 && (
            <div className="mt-(--rythme-base)">
              <Message
                type="information"
                texte="Vous n'avez pas encore de celliers. Cliquez sur 'Ajouter un cellier' pour en créer un."
              />
            </div>
          )}

          {/* Liste des celliers */}
          {celliers.length > 0 && (
            <div className="mt-(--rythme-base) grid grid-cols-2 gap-(--rythme-base)">
              {celliers.map((cellier) => (
                <CarteCellier
                  key={cellier.id_cellier}
                  titre={cellier.nom}
                  idCellier={cellier.id_cellier}
                />
              ))}
            </div>
          )}

          {/* Modale pour creer un cellier */}
          {estModaleOuverte && (
            <BoiteModale
              texte="Créer un nouveau cellier"
              contenu={
                <>
                  <FormulaireInput
                    type="text"
                    nom="nom du cellier"
                    genre="un"
                    estObligatoire={true}
                    classCouleur="Dark"
                    classCouleurLabel="Dark"
                    value={nomCellier}
                    onChange={(e) => setNomCellier(e.target.value)}
                  />
                </>
              }
              bouton={
                <>
                  <Bouton
                    texte="Annuler"
                    type="secondaire"
                    typeHtml="button"
                    action={fermerModale}
                  />
                  <Bouton
                    texte="Ajouter"
                    type="primaire"
                    typeHtml="button"
                    action={creerCellierAvecNom}
                  />
                </>
              }
            />
          )}
        </section>
      </main>
      <footer>
        <MenuEnBas />
      </footer>
    </>
  );
}

export default SommaireCellier;
