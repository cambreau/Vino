import { useState } from "react";
import { createPortal } from "react-dom";
import Icon from "@components/components-partages/Icon/Icon";
import Bouton from "@components/components-partages/Boutons/Bouton";
import BoiteModaleNotes from "@components/boiteModaleNotes/boiteModaleNotes";

const CarteNoteDegustation = ({
  note = {},
  estNoteUtilisateur = false,
  onModifier,
  onSupprimer,
}) => {
  const [estModaleOuverte, setEstModaleOuverte] = useState(false);

  // Extraire les données de la note
  const noteValue = note.notes || note.note || note.note_degustation || 0;
  const commentaire = note.commentaire || "";
  const dateNote =
    note.date_degustation || note.date_creation || note.date || "";
  const nomUtilisateur = note.nom_utilisateur || note.nom || "Utilisateur";

  // Formater la date
  const formaterDate = (dateString) => {
    if (!dateString) return "Date non disponible";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Générer les étoiles
  const genererEtoiles = () => {
    const etoiles = [];
    for (let i = 1; i <= 5; i++) {
      etoiles.push(
        <Icon
          key={i}
          nom={i <= noteValue ? "etoile" : "etoileVide"}
          size={24}
          couleur="principal-200"
          className="transition-colors"
        />
      );
    }
    return etoiles;
  };

  const ouvrirModale = () => {
    setEstModaleOuverte(true);
  };

  const fermerModale = () => {
    setEstModaleOuverte(false);
  };

  const gererFermetureModale = () => {
    fermerModale();
    // Recharger les notes après modification
    if (onModifier) {
      onModifier();
    }
  };

  const gererSupprimer = (noteASupprimer) => {
    if (onSupprimer) {
      onSupprimer(noteASupprimer);
    }
    fermerModale();
  };

  return (
    <>
      <div
        className="
        flex gap-(--rythme-serre)
        bg-fond-secondaire p-(--rythme-base) 
        
        rounded-(--arrondi-grand) shadow-md"
      >
        {/* Section INFORMATIONS de la bouteille */}
        <div className="flex-1 flex flex-col gap-(--rythme-serre) max-w-full">
          {/* Nom */}
          <div>
            <header className="flex justify-between items-center mb-(--rythme-tres-serre)">
              <h3 className="text-(length:--taille-normal) font-semibold text-principal-300">
                {nomUtilisateur}
              </h3>
              {/* Étoiles pour la notation */}
              <div className="flex justify-center items-center gap-(--rythme-serre)">
                {genererEtoiles()}
              </div>
            </header>
            <hr className="my-(--rythme-serre)" />
          </div>

          {/* Commentaire et date */}
          <div className="flex flex-col gap-(--rythme-serre)">
            {commentaire && (
              <p className="text-(length:--taille-petit) text-texte-secondaire ">
                Commentaire:{" "}
                <strong className="font-semibold text-principal-300">
                  {commentaire}
                </strong>
              </p>
            )}
            {dateNote && (
              <p className="text-(length:--taille-petit) text-texte-secondaire">
                Date:{" "}
                <strong className="font-semibold text-principal-300">
                  {formaterDate(dateNote)}
                </strong>
              </p>
            )}
          </div>

          {/* Boutons modifier et supprimer seulement si c'est la note de l'utilisateur */}
          {estNoteUtilisateur && (
            <div className="flex gap-(--rythme-serre) mt-(--rythme-serre)">
              <Bouton
                texte="Modifier"
                type="secondaire"
                typeHtml="button"
                action={ouvrirModale}
              />
              <Bouton
                texte="Supprimer"
                type="secondaire"
                typeHtml="button"
                action={() => gererSupprimer(note)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modale pour modifier la note */}
      {estModaleOuverte &&
        createPortal(
          <BoiteModaleNotes
            id_bouteille={note.id_bouteille}
            noteInitiale={note}
            onFermer={gererFermetureModale}
          />,
          document.body
        )}
    </>
  );
};

export default CarteNoteDegustation;
