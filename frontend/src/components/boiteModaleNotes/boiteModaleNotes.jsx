import { useState } from "react";
import BoiteModale from "@components/components-partages/BoiteModale/BoiteModale";
import FormulaireTextarea from "@components/components-partages/Formulaire/FormulaireTextarea/FormulaireTextarea";
import Icon from "@components/components-partages/Icon/Icon";
import Bouton from "@components/components-partages/Boutons/Bouton";
import iconNotez from "@assets/images/evaluation.svg";

function BoiteModaleNotes({ nomBouteille = "", onFermer, onValider }) {
  const [note, setNote] = useState(0);
  const [hoverNote, setHoverNote] = useState(0);
  const [commentaire, setCommentaire] = useState("");

  const gererClicEtoile = (index) => {
    setNote(index + 1);
  };

  const gererSoumission = () => {
    if (onValider) {
      onValider({ note, commentaire });
    }
  };

  const gererAnnulation = () => {
    setNote(0);
    setCommentaire("");
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
          {/* Étoiles pour la notation */}
          <div className="flex justify-center items-center gap-(--rythme-serre)">
            {[...Array(5)].map((_, index) => {
              const etoileIndex = index + 1;
              const estRemplie = etoileIndex <= (hoverNote || note);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => gererClicEtoile(index)}
                  onMouseEnter={() => setHoverNote(etoileIndex)}
                  onMouseLeave={() => setHoverNote(0)}
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
            texte="Valider"
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
