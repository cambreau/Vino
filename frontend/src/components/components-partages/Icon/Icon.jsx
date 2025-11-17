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
  utilisateur: FaUser,
};

function Icon({ name, size = 24 }) {
  const IconComponent = icons[name];

  return (
    <div>
      <IconComponent size={size} />
      <p>{name}</p>
    </div>
  );
}

export default Icon;
