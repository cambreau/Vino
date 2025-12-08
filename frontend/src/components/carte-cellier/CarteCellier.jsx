import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconEditer,
  IconPoubelle,
} from "@components/components-partages/Icon/SvgIcons";
import Bouton from "@components/components-partages/Boutons/Bouton";

function CarteCellier({ titre, idCellier, onModifier, onSupprimer }) {
  const navigate = useNavigate();
  const tailleIcone = 22;

  const allerAuCellier = useCallback(() => {
    navigate(`/cellier/${idCellier}`);
  }, [navigate, idCellier]);

  const gererActivationClavier = useCallback(
    (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        allerAuCellier();
      }
    },
    [allerAuCellier]
  );

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={allerAuCellier}
      onKeyDown={gererActivationClavier}
      className="
        w-full
        max-w-[460px]
        min-h-[80px]
        rounded-(--arrondi-grand)
        border-2
        border-principal-200
        bg-fond-secondaire
        shadow-md
        px-(--rythme-espace)
        flex
		flex-wrap
        justify-between
        items-center
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-principal-200
        hover:border-principal-300
        transition
      "
    >
      <h2 className="text-texte-premier text-(length:--taille-moyen) font-bold wrap-break-word">
        {titre}
      </h2>
      <div className="flex gap-(--rythme-base) justify-center items-center">
        <Bouton
          texte={<IconEditer size={tailleIcone} />}
          type="secondaire"
          typeHtml="button"
          ariaLabel={`Modifier le cellier ${titre}`}
          action={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onModifier) onModifier(idCellier);
          }}
        />
        <Bouton
          texte={<IconPoubelle size={tailleIcone} />}
          type="primaire"
          typeHtml="button"
          ariaLabel={`Supprimer le cellier ${titre}`}
          action={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onSupprimer) onSupprimer(idCellier);
          }}
        />
      </div>
    </article>
  );
}

export default CarteCellier;
