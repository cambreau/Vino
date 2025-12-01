import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
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
		[allerAuCellier],
	);

	return (
		<article
			role="button"
			tabIndex={0}
			onClick={allerAuCellier}
			onKeyDown={gererActivationClavier}
			className="
        w-full
        max-w-[360px]
        min-h-[170px]
        rounded-(--arrondi-grand)
        border-2
        border-principal-200
        bg-fond-secondaire
        shadow-md
        p-(--rythme-espace)
        flex
        flex-col
        justify-between
        text-center
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-principal-200
        hover:border-principal-300
        transition
      ">
			<h3 className="text-texte-premier text-(length:--taille-moyen) font-bold wrap-break-word">
				{titre}
			</h3>
			<div className="flex flex-wrap gap-(--rythme-base) justify-center mt-(--rythme-espace)">
				<Bouton
					texte={<FaEdit size={tailleIcone} />}
					type="secondaire"
					typeHtml="button"
					action={(e) => {
						e.preventDefault();
						e.stopPropagation();
						if (onModifier) onModifier(idCellier);
					}}
				/>
				<Bouton
					texte={<FaTrash size={tailleIcone} />}
					type="primaire"
					typeHtml="button"
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
