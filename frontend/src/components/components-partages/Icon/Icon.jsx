// Recuperer les icons:
import { formatMajDebut } from "@lib/utils";
import catalogue from "@assets/images/catalogue.svg?react";
import catalogueActive from "@assets/images/catalogueActive.svg";
import profil from "@assets/images/profil.svg";
import profilActive from "@assets/images/profilActive.svg";
import liste from "@assets/images/liste.svg";
import listeActive from "@assets/images/listeActive.svg";
import cellier from "@assets/images/cellier.svg";
import cellierActif from "@assets/images/cellierActif.svg";
import recherche from "@assets/images/recherche.svg";
import menuHamburger from "@assets/images/menuHamburger.svg";
import fermer from "@assets/images/fermer.svg";
import deconnection from "@assets/images/deconnection.svg";
import etoile from "@assets/images/etoile.svg";
import etoileVide from "@assets/images/etoileVide.svg";
import filtre from "@assets/images/filtre.svg";
import chevronBas from "@assets/images/chevronBas.svg";
import raisins from "@assets/images/raisins.svg";
import monde from "@assets/images/monde.svg";
import calendrier from "@assets/images/calendrier.svg";
import fermerX from "@assets/images/fermerX.svg";
import echange from "@assets/images/echange.svg";
import entrepot from "@assets/images/entrepot.svg";
import vin from "@assets/images/vin.svg";
import erreur from "@assets/images/erreur.svg";
import succes from "@assets/images/succes.svg";
import info from "@assets/images/info.svg";
import flecheGauche from "@assets/images/flecheGauche.svg";
import editer from "@assets/images/editer.svg";
import poubelle from "@assets/images/poubelle.svg";
import carnet from "@assets/images/carnet.svg";
import utilisateur from "@assets/images/utilisateur.svg";

// Objet qui mappe les noms aux icônes
const icons = {
  catalogue: catalogue,
  catalogueActif: catalogueActive,
  cellier: cellier,
  cellierActif: cellierActif,
  liste: liste,
  listeActif: listeActive,
  recherche: recherche,
  profil: profil,
  profilActif: profilActive,
  menuHamburger: menuHamburger,
  deconnection: deconnection,
  fermer: fermer,
  etoile: etoile,
  etoileVide: etoileVide,
  filtre: filtre,
  chevronBas: chevronBas,
  raisins: raisins,
  monde: monde,
  calendrier: calendrier,
  fermerX: fermerX,
  echange: echange,
  entrepot: entrepot,
  vin: vin,
  erreur: erreur,
  succes: succes,
  info: info,
  flecheGauche: flecheGauche,
  editer: editer,
  poubelle: poubelle,
  carnet: carnet,
  utilisateur: utilisateur,
};

function Icon({
  nom,
  size = 24,
  couleur,
  typeMenu,
  className = "",
  actif = false,
}) {
  // Si actif est true, utiliser l'icône active, sinon utiliser l'icône normale
  const nomIcone = actif ? `${nom}Actif` : nom;
  const IconComposant = icons[nomIcone] || icons[nom];

  // Si typeMenu n'est pas défini, afficher seulement l'icône sans texte
  if (!typeMenu) {
    return (
      <div className={className}>
        <img
          src={IconComposant}
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
            src={IconComposant}
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
            src={IconComposant}
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
