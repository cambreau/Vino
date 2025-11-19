// Recuperer les icons:
import { AiFillHome } from "react-icons/ai"; // Accueil
import { GiCellarBarrels } from "react-icons/gi"; // Celliers
import { GiNotebook } from "react-icons/gi"; // Liste
import { BiSearch } from "react-icons/bi"; // Recherche
import { FaUser } from "react-icons/fa"; // Profil
import { TiThMenu } from "react-icons/ti"; // Menu
import { MdLogout } from "react-icons/md"; // Deconnection
import { PiCastleTurret } from "react-icons/pi"; // Chateau
import { IoClose } from "react-icons/io5"; // Fermer
import { formatMajDebut } from "../../../lib/utils";

// Objet qui mappe les noms aux icônes
const icons = {
  accueil: AiFillHome,
  cellier: GiCellarBarrels,
  liste: GiNotebook,
  recherche: BiSearch,
  profil: FaUser,
  utilisateur: FaUser,
  menuHamburger: TiThMenu,
  deconnection: MdLogout,
  chateau: PiCastleTurret,
  fermer: IoClose,
};

function Icon({ name, size = 24, typeMenu }) {
  const IconComponent = icons[name];

  return (
    <div className="flex flex-col items-center gap-(--rythme-tres-serre) w-full text-${couleur}">
      <IconComponent size={size} color={couleur} />
      <p style={{ color: couleur }}>{formatMajDebut(nom)}</p>
    </div>
  );
}

export default Icon;
