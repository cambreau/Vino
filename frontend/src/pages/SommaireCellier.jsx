import MenuEnHaut from "@components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "@components/components-partages/MenuEnBas/MenuEnBas";
import authentificationStore from "@store/authentificationStore.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  recupererTousCellier,
  creerCellier,
  modifierCellier,
  supprimerCellier,
  recupererNomCellier,
} from "@lib/requetes.js";
import Bouton from "@components/components-partages/Boutons/Bouton";
import FormulaireInput from "@components/components-partages/Formulaire/FormulaireInput/FormulaireInput";
import BoiteModale from "@components/components-partages/BoiteModale/BoiteModale";
import Message from "@components/components-partages/Message/Message";
import CarteCellier from "@components/carte-cellier/CarteCellier";
import { useDocumentTitle } from "@lib/utils.js";

function SommaireCellier() {
  useDocumentTitle("Mes celliers");
  const navigate = useNavigate();
  //**** Variable et UseState */
  //Informations utilisateur
  const utilisateur = authentificationStore((state) => state.utilisateur);
  const idUtilisateur = utilisateur?.id; // Si null ou undefined = undefined
  //Informations tous les celliers
  const [celliers, setCelliers] = useState([]);
  //Informations modale ajout
  const [estModaleAjoutOuverte, setEstModaleAjoutOuverte] = useState(false);
  const [nomCellier, setNomCellier] = useState("");
  //Information modale modifier
  const [estModaleModificationOuverte, setEstModaleModificationOuverte] =
    useState(false);
  const [cellierAModifier, setCellierAModifier] = useState(null);
  const [nomCellierModification, setNomCellierModification] = useState("");

  //Information modale supprimer
  const [estModaleSuppresionOuverte, setEstModaleSuppressionOuverte] =
    useState(false);
  const [cellierASupprimer, setCellierASupprimer] = useState(null);
  // Verier si le nom du cellier existe
  const [nomExistant, setnomExistant] = useState(null);

  //**** Fonctions charger les celliers */
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

  //**** Fonctions creer un cellier */
  // Fonction pour ouvrir la boite modale de creation
  const gererCreerCellier = () => {
    setEstModaleAjoutOuverte(true);
  };

  // Fonction pour fermer la boite modale de creation
  const fermerModaleAjout = () => {
    setEstModaleAjoutOuverte(false);
    setNomCellier("");
    setnomExistant("");
  };

  // Fonction pour creer le cellier avec le nom
  const creerCellierAvecNom = async () => {
    const verifierCellierExiste = await recupererNomCellier(
      idUtilisateur,
      nomCellier
    );

    if (verifierCellierExiste === "Ce nom est disponible") {
      const resultat = await creerCellier(idUtilisateur, nomCellier);
      if (resultat.succes) {
        await chargerCelliers();
        fermerModaleAjout();
      }
    } else {
      setnomExistant(verifierCellierExiste);
    }
  };

  //**** Fonctions modifier un cellier */
  // Fonction pour ouvrir la boite modale de modification
  const gererModifierCellier = (idCellier) => {
    // Récupérer le cellier dans la liste des celliers obtenue précédemment.
    const cellier = celliers.find((c) => c.id_cellier === idCellier);
    if (cellier) {
      // Si le cellier est modifié, mettre à jour les variables pour la modification.
      setCellierAModifier(cellier);
      setNomCellierModification(cellier.nom);
      setEstModaleModificationOuverte(true);
    }
  };

  // Fonction pour fermer la boite modale de modification
  const fermerModaleModification = () => {
    setEstModaleModificationOuverte(false);
    setCellierAModifier(null);
    setNomCellierModification("");
  };

  // Fonction pour modifier le cellier avec le nom
  const modifierCellierAvecNom = async () => {
    if (
      !cellierAModifier ||
      !nomCellierModification ||
      nomCellierModification.trim() === ""
    ) {
      return;
    }
    const resultat = await modifierCellier(
      idUtilisateur,
      cellierAModifier.id_cellier,
      nomCellierModification.trim(),
      navigate
    );
    if (resultat.succes) {
      await chargerCelliers();
      fermerModaleModification();
    }
  };

  //**** Fonctions supprimer un cellier */
  // Fonction pour supprimer un cellier
  const gererSupprimerCellier = (idCellier) => {
    // Récupérer le cellier dans la liste des celliers obtenue précédemment.
    const cellier = celliers.find((c) => c.id_cellier === idCellier);
    if (cellier) {
      setCellierASupprimer(cellier);
      setEstModaleSuppressionOuverte(true);
    }
  };

  // Fonction pour fermer la boite modale de suppression
  const fermerModaleASupprimer = () => {
    setEstModaleSuppressionOuverte(false);
    setCellierASupprimer(null);
  };

  // Fonction pour supprimer le cellier
  const suppressionCellier = async () => {
    const resultat = await supprimerCellier(
      idUtilisateur,
      cellierASupprimer.id_cellier,
      navigate
    );
    if (resultat.succes) {
      await chargerCelliers();
      fermerModaleASupprimer();
    }
  };

  return (
    <div className="h-screen font-body grid grid-rows-[auto_1fr_auto] overflow-hidden">
      <header>
        <MenuEnHaut />
      </header>

      <main className="bg-fond overflow-y-auto">
        <h1 className="text-(length:--taille-grand) my-(--rythme-espace) text-center font-display font-semibold text-principal-300">
          Sommaire de mes celliers
        </h1>
        <section className="p-(--rythme-base)">
          <Bouton
            taille="moyen"
            texte="Ajouter un cellier"
            type="primaire"
            typeHtml="button"
            action={gererCreerCellier}
          />

          {/* Message si aucun cellier */}
          {celliers.length === 0 && (
            <div className="my-(--rythme-base)">
              <Message
                type="information"
                texte="Vous n'avez pas encore de celliers. Cliquez sur 'Ajouter un cellier' pour en créer un."
              />
            </div>
          )}

          {/* Liste des celliers */}
          {celliers.length > 0 && (
            <div className="flex flex-wrap my-(--rythme-espace) gap-(--rythme-base)  max-w-6xl">
              {celliers.map((cellier) => (
                <CarteCellier
                  key={cellier.id_cellier}
                  titre={cellier.nom}
                  idCellier={cellier.id_cellier}
                  onModifier={gererModifierCellier}
                  onSupprimer={gererSupprimerCellier}
                />
              ))}
            </div>
          )}

          {/* Modale pour creer un cellier */}
          {estModaleAjoutOuverte && (
            <BoiteModale
              texte="Créer un nouveau cellier"
              contenu={
                <div className="flex flex-col">
                  {/* Message si aucun cellier */}
                  {nomExistant === "Un cellier avec ce nom existe déjà" && (
                    <Message type="information" texte={nomExistant} />
                  )}
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
                </div>
              }
              bouton={
                <>
                  <Bouton
                    texte="Annuler"
                    type="secondaire"
                    typeHtml="button"
                    action={fermerModaleAjout}
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

          {/* Modale pour modifier un cellier */}
          {estModaleModificationOuverte && cellierAModifier && (
            <BoiteModale
              texte={`Modifier le nom du cellier ${cellierAModifier.nom}`}
              contenu={
                <>
                  <FormulaireInput
                    type="text"
                    nom="nom du cellier"
                    genre="un"
                    estObligatoire={true}
                    classCouleur="Dark"
                    classCouleurLabel="Dark"
                    value={nomCellierModification}
                    onChange={(e) => setNomCellierModification(e.target.value)}
                  />
                </>
              }
              bouton={
                <>
                  <Bouton
                    texte="Annuler"
                    type="secondaire"
                    typeHtml="button"
                    action={fermerModaleModification}
                  />
                  <Bouton
                    texte="Modifier"
                    type="primaire"
                    typeHtml="button"
                    action={modifierCellierAvecNom}
                  />
                </>
              }
            />
          )}

          {/* Modale pour supprimer un cellier */}
          {estModaleSuppresionOuverte && cellierASupprimer && (
            <BoiteModale
              texte={`Supprimer le cellier : ${cellierASupprimer.nom}`}
              bouton={
                <>
                  <Bouton
                    texte="Annuler"
                    type="secondaire"
                    typeHtml="button"
                    action={fermerModaleASupprimer}
                  />
                  <Bouton
                    texte="Supprimer"
                    type="primaire"
                    typeHtml="button"
                    action={suppressionCellier}
                  />
                </>
              }
            />
          )}
        </section>
      </main>

      <MenuEnBas />
    </div>
  );
}

export default SommaireCellier;
