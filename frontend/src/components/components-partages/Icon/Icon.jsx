// Recuperer les icons:
import { AiFillHome } from "react-icons/ai"; // Accueil
import { GiCellarBarrels } from "react-icons/gi"; // Celliers
import { GiNotebook } from "react-icons/gi"; // Liste
import { BiSearch } from "react-icons/bi"; // Recherche
import { FaUser } from "react-icons/fa"; // Profil

// Objet qui mappe les noms aux icônes
const icons = {
  accueil: AiFillHome,
  cellier: GiCellarBarrels,
  liste: GiNotebook,
  recherche: BiSearch,
  profil: FaUser,
};

function Icon({ nom, size = 24, couleur }) {
  const IconComponent = icons[nom];
  // Fonction pour capitaliser la première lettre
  const IconNomMajuscule = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  return (
    <div className="flex flex-col items-center gap-[var(--rythme-tres-serre)] w-full text-[${couleur}]">
      <IconComponent size={size} color={couleur} />
      <p style={{ color: couleur }}>{IconNomMajuscule(nom)}</p>
    </div>
  );
}

export default Icon;
