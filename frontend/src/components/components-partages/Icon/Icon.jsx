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

function Icon({ nom, size = 24, couleur }) {
  const IconComponent = icons[nom];
  // Fonction pour capitaliser la première lettre
  const IconNomMajuscule = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
function Icon({ name, size = 24, typeMenu }) {
  const IconComponent = icons[name];

  return (
    <div className="flex flex-col items-center gap-[var(--rythme-tres-serre)] w-full text-[${couleur}]">
      <IconComponent size={size} color={couleur} />
      <p style={{ color: couleur }}>{IconNomMajuscule(nom)}</p>
    <div>
      <IconComponent size={size} />
      {typeMenu === "bas" ? <p>{name}</p> : null}
    </div>
  );
}

export default Icon;
