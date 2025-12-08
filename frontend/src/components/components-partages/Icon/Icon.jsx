// Récupérer les icônes en tant que composants React (inline SVG)
// L'utilisation de ?react inline les SVG dans le bundle, éliminant les requêtes HTTP séparées
import { formatMajDebut } from "@lib/utils";
import CatalogueSvg from "@assets/images/catalogue.svg?react";
import CatalogueActiveSvg from "@assets/images/catalogueActive.svg?react";
import ProfilSvg from "@assets/images/profil.svg?react";
import ProfilActiveSvg from "@assets/images/profilActive.svg?react";
import ListeSvg from "@assets/images/liste.svg?react";
import ListeActiveSvg from "@assets/images/listeActive.svg?react";
import CellierSvg from "@assets/images/cellier.svg?react";
import CellierActifSvg from "@assets/images/cellierActif.svg?react";
import RechercheSvg from "@assets/images/recherche.svg?react";
import MenuHamburgerSvg from "@assets/images/menuHamburger.svg?react";
import FermerSvg from "@assets/images/fermer.svg?react";
import DeconnectionSvg from "@assets/images/deconnection.svg?react";
import EtoileSvg from "@assets/images/etoile.svg?react";
import EtoileVideSvg from "@assets/images/etoileVide.svg?react";
import FiltreSvg from "@assets/images/filtre.svg?react";
import ChevronBasSvg from "@assets/images/chevronBas.svg?react";
import RaisinsSvg from "@assets/images/raisins.svg?react";
import MondeSvg from "@assets/images/monde.svg?react";
import CalendrierSvg from "@assets/images/calendrier.svg?react";
import FermerXSvg from "@assets/images/fermerX.svg?react";
import EchangeSvg from "@assets/images/echange.svg?react";
import EntrepotSvg from "@assets/images/entrepot.svg?react";
import VinSvg from "@assets/images/vin.svg?react";
import ErreurSvg from "@assets/images/erreur.svg?react";
import SuccesSvg from "@assets/images/succes.svg?react";
import InfoSvg from "@assets/images/info.svg?react";
import FlecheGaucheSvg from "@assets/images/flecheGauche.svg?react";
import EditerSvg from "@assets/images/editer.svg?react";
import PoubelleSvg from "@assets/images/poubelle.svg?react";
import CarnetSvg from "@assets/images/carnet.svg?react";
import UtilisateurSvg from "@assets/images/utilisateur.svg?react";

// Objet qui mappe les noms aux composants SVG
const icons = {
  catalogue: CatalogueSvg,
  catalogueActif: CatalogueActiveSvg,
  cellier: CellierSvg,
  cellierActif: CellierActifSvg,
  liste: ListeSvg,
  listeActif: ListeActiveSvg,
  recherche: RechercheSvg,
  profil: ProfilSvg,
  profilActif: ProfilActiveSvg,
  menuHamburger: MenuHamburgerSvg,
  deconnection: DeconnectionSvg,
  fermer: FermerSvg,
  etoile: EtoileSvg,
  etoileVide: EtoileVideSvg,
  filtre: FiltreSvg,
  chevronBas: ChevronBasSvg,
  raisins: RaisinsSvg,
  monde: MondeSvg,
  calendrier: CalendrierSvg,
  fermerX: FermerXSvg,
  echange: EchangeSvg,
  entrepot: EntrepotSvg,
  vin: VinSvg,
  erreur: ErreurSvg,
  succes: SuccesSvg,
  info: InfoSvg,
  flecheGauche: FlecheGaucheSvg,
  editer: EditerSvg,
  poubelle: PoubelleSvg,
  carnet: CarnetSvg,
  utilisateur: UtilisateurSvg,
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

  // Si le composant n'existe pas, retourner null
  if (!IconComposant) {
    console.warn(`Icône "${nomIcone}" non trouvée`);
    return null;
  }

  // Si typeMenu n'est pas défini, afficher seulement l'icône sans texte
  if (!typeMenu) {
    return (
      <div className={className}>
        <IconComposant
          width={size}
          height={size}
          className={couleur ? `text-${couleur}` : undefined}
          aria-label={nom}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Verifier le si c'est le menu en haut ou en bas pour avoir la bonne affichage d'ensemble du icon et nom correspondent */}
      {typeMenu === "bas" ? (
        <div className="flex flex-col items-center gap-(--rythme-tres-serre) w-full ">
          <IconComposant
            width={size}
            height={size}
            className={couleur ? `text-${couleur}` : undefined}
            aria-label={nom}
          />

          {typeMenu === "bas" ? (
            <p className={couleur ? `text-${couleur}` : undefined}>{formatMajDebut(nom)}</p>
          ) : null}
        </div>
      ) : (
        <div className="flex items-center gap-(--rythme-base) w-full ">
          <IconComposant
            width={size}
            height={size}
            className={couleur ? `text-${couleur}` : undefined}
            aria-label={nom}
          />
          {/* Affiche le texte seulement si nom n'est PAS menuHamburger ou Fermer */}
          {nom !== "menuHamburger" &&
            nom !== "fermer" &&
            nom !== "deconnection" &&
            nom !== "recherche" &&
            nom !== "etoile" &&
            nom !== "etoileVide" && (
              <p className={couleur ? `text-${couleur}` : undefined}>{formatMajDebut(nom)}</p>
            )}
        </div>
      )}
    </div>
  );
}

export default Icon;
