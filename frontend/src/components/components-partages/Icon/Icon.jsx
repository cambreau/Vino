// Recuperer les icons:
import { FaUser, FaStar, FaRegStar } from "react-icons/fa"; // Profil, Etoile, Etoile vide
import { formatMajDebut } from "@lib/utils";
import catalogue from "@assets/images/catalogue.svg?react";
import profil from "@assets/images/profil.svg";
import liste from "@assets/images/liste.svg";
import cellier from "@assets/images/cellier.svg";
import recherche from "@assets/images/recherche.svg";
import menuHamburger from "@assets/images/menuHamburger.svg";
import fermer from "@assets/images/fermer.svg";
import deconnection from "@assets/images/deconnection.svg";
import etoile from "@assets/images/etoile.svg";
import etoileVide from "@assets/images/etoileVide.svg";
// Objet qui mappe les noms aux icônes
const icons = {
  catalogue: catalogue,
  cellier: cellier,
  liste: liste,
  recherche: recherche,
  profil: profil,
  menuHamburger: menuHamburger,
  deconnection: deconnection,
  fermer: fermer,
  etoile: etoile,
  etoileVide: etoileVide,
};

function Icon({ nom, size = 24, couleur, typeMenu, className = "" }) {
  const IconComposant = icons[nom];

  // Si typeMenu n'est pas défini, afficher seulement l'icône sans texte
  if (!typeMenu) {
    return (
      <div className={className}>
        <img
          src={icons[nom]}
          alt={nom}
          width={size}
          className={`text-${couleur}`}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Verifier le si c'est le menu en haut ou en bas pour avoir la bonne affichage d'ensemble du icon et nom correspondent */}
      {typeMenu === "bas" ? (
        <div className="flex flex-col items-center gap-(--rythme-tres-serre) w-full ">
          <img
            src={icons[nom]}
            alt={nom}
            width={size}
            className={`text-${couleur}`}
          />

          {typeMenu === "bas" ? (
            <p className={`text-${couleur}`}>{formatMajDebut(nom)}</p>
          ) : null}
        </div>
      ) : (
        <div className="flex items-center gap-(--rythme-base) w-full ">
          <img
            src={icons[nom]}
            alt={nom}
            width={size}
            className={`text-${couleur}`}
          />
          {/* Affiche le texte seulement si nom n'est PAS menuHamburger ou Fermer */}
          {nom !== "menuHamburger" &&
            nom !== "fermer" &&
            nom !== "deconnection" &&
            nom !== "recherche" &&
            nom !== "etoile" &&
            nom !== "etoileVide" && (
              <p className={`text-${couleur}`}>{formatMajDebut(nom)}</p>
            )}
        </div>
      )}
    </div>
  );
}

export default Icon;
