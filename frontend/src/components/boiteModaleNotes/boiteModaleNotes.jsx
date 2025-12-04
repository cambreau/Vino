import { useState } from "react";
import BoiteModale from "@components/components-partages/BoiteModale/BoiteModale";
import FormulaireTextarea from "@components/components-partages/Formulaire/FormulaireTextarea/FormulaireTextarea";
import Icon from "@components/components-partages/Icon/Icon";
import Bouton from "@components/components-partages/Boutons/Bouton";
import Message from "@components/components-partages/Message/Message";
import iconNotez from "@assets/images/evaluation.svg";
import authentificationStore from "@store/authentificationStore";
import { creerNoteDegustations, modifierNote } from "@lib/requetes";

function BoiteModaleNotes({ id_bouteille, noteInitiale = null, onFermer }) {
  //On recupere l'info de l'utilisateur.
  const utilisateur = authentificationStore((state) => state.utilisateur);
  //On valide si c'est un ajout ou une modification
  const estModeModification = noteInitiale !== null;

  // Initialise la note : si en mode modification, utilise notes de noteInitiale, sinon 0 (mode ajout)
  const [note, setNote] = useState(noteInitiale?.notes || 0); //Au pluriel a cause de la BD mais c'est bien une seule note.
  const [noteSurvol, setNoteSurvol] = useState(0); // Note affichée au survol des étoiles
  const [commentaire, setCommentaire] = useState(
    noteInitiale?.commentaire || ""
  );
  // S'il n'y a pas de notes, id_utilisateur ou id_bouteille
  const [erreur, setErreur] = useState("");

  /**
   * Gère le clic sur une étoile pour sélectionner la note (1-5).
   * @param {number} index - L'index de l'étoile cliquée (0-4)
   */
  const gererClicEtoile = (index) => {
    setNote(index + 1);
  };

  /**
   * Gère la soumission du formulaire.
   * Valide les données et appelle l'API pour créer ou modifier la note.
   */
  const gererSoumission = async () => {
    // Réinitialiser les erreurs
    setErreur("");
    // On recupere id utilisateur.
    const id_utilisateur = utilisateur?.id;

    // Validation : vérifier qu'il y a au moins une note, un id_utilisateur et un id_bouteille
    if (!note || note === 0) {
      setErreur("Une note est requise");
      return;
    }
    if (!id_utilisateur) {
      setErreur("Vous devez être connecté pour noter une bouteille");
      return;
    }
    if (!id_bouteille) {
      setErreur("L'identifiant de la bouteille est requis");
      return;
    }

    // On forme les datas a envoyer
    const donneesDegustation = {
      date: noteInitiale?.date || new Date().toISOString(),
      id_bouteille: id_bouteille,
      id_utilisateur: id_utilisateur,
      commentaire: commentaire,
      notes: note,
    };

    try {
      // Appelle les fonctions de requetes.js qui gèrent les appels au backend
      if (estModeModification) {
        await modifierNote(donneesDegustation);
      } else {
        await creerNoteDegustations(donneesDegustation);
      }

      // On ferme la boite modale après succès
      onFermer();
    } catch (err) {
      console.error(err);
      setErreur("Une erreur est survenue lors de l'enregistrement de la note.");
    }
  };

  /**
   * Gère l'annulation : réinitialise les valeurs et ferme la modale.
   */
  const gererAnnulation = () => {
    setNote(noteInitiale?.notes || 0);
    setCommentaire(noteInitiale?.commentaire || "");
    setErreur("");
    if (onFermer) {
      onFermer();
    }
  };

  return (
    <BoiteModale
      texte={
        <span className="flex items-center justify-center gap-(--rythme-serre)">
          Notez
          <img src={iconNotez} alt="Icône évaluation" className="w-5 h-5" />
        </span>
      }
      contenu={
        <div className="w-full flex flex-col gap-(--rythme-base)">
          {/* Affichage des erreurs */}
          {erreur && <Message type="erreur" texte={erreur} />}

          {/* Étoiles pour la notation */}
          <div className="flex justify-center items-center gap-(--rythme-serre)">
            {[...Array(5)].map((_, index) => {
              const etoileIndex = index + 1;
              // Affiche la note au survol si disponible, sinon la note sélectionnée
              const estRemplie = etoileIndex <= (noteSurvol || note);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => gererClicEtoile(index)}
                  onMouseEnter={() => setNoteSurvol(etoileIndex)}
                  onMouseLeave={() => setNoteSurvol(0)}
                  className="transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                  aria-label={`Noter ${etoileIndex} étoile${
                    index > 0 ? "s" : ""
                  }`}
                >
                  <Icon
                    nom={estRemplie ? "etoile" : "etoileVide"}
                    size={32}
                    couleur="principal-200"
                    className="transition-colors"
                  />
                </button>
              );
            })}
          </div>

          {/* Textarea pour les commentaires */}
          <div className="w-full">
            <FormulaireTextarea
              nom="commentaire"
              genre="un"
              estObligatoire={false}
              value={commentaire}
              classCouleur="Clair"
              onChange={(e) => setCommentaire(e.target.value)}
            />
          </div>
        </div>
      }
      bouton={
        <>
          <Bouton
            texte="Annuler"
            type="secondaire"
            typeHtml="button"
            action={gererAnnulation}
          />
          <Bouton
            texte={estModeModification ? "Enregistrer" : "Valider"}
            type="primaire"
            typeHtml="button"
            action={gererSoumission}
          />
        </>
      }
    />
  );
}

export default BoiteModaleNotes;
