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
  menuHamburger: TiThMenu,
  deconnection: MdLogout,
  chateau: PiCastleTurret,
  fermer: IoClose,
};

function Icon({ nom, size = 24, couleur, typeMenu }) {
  const IconComponent = icons[nom];
  // Fonction pour capitaliser la première lettre
  const IconNomMajuscule = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  return (
    <div>
      {/* Verifier le si c'est le menu en haut ou en bas pour avoir la bonne affichage d'ensemble du icon et nom correspondent */}
      {typeMenu === "bas" ? (
        <div className="flex flex-col items-center gap-(--rythme-tres-serre) w-full text-[${couleur}]">
          <IconComponent size={size} color={couleur} />
          {typeMenu === "bas" ? (
            <p style={{ color: couleur }}>{IconNomMajuscule(nom)}</p>
          ) : null}
        </div>
      ) : (
        <div className="flex items-center gap-(--rythme-base) w-full text-[${couleur}]">
          <IconComponent size={size} color={couleur} />
          {/* Affiche le texte seulement si nom n’est PAS menuHamburger ou Fermer */}
          {nom !== "menuHamburger" &&
            nom !== "fermer" &&
            nom !== "deconnection" && (
              <p style={{ color: couleur }}>{IconNomMajuscule(nom)}</p>
            )}
        </div>
      )}
    </div>
  );
}

export default Icon;
