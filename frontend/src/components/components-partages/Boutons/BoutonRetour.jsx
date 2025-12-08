import { IconFlecheGauche } from "@components/components-partages/Icon/SvgIcons";
import { useNavigate } from "react-router-dom";

function BoutonRetour() {
  const navigate = useNavigate();

  const revenirEnArriere = () => {
    navigate(-1); // redirige vers la page précédente
  };
  return (
    <button
      aria-label="Retour en arrière"
      type="button"
      className="
        flex items-center justify-center
        w-(--rythme-espace) h-(--rythme-espace)
        bg-fond-secondaire
        rounded-full
        shadow-md
        hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer
      "
      onClick={revenirEnArriere}
    >
      <IconFlecheGauche size={24} color="var(--color-texte-premier)" />
    </button>
  );
}

export default BoutonRetour;
