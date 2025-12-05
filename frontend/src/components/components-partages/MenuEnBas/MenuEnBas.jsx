import Icon from "@components/components-partages/Icon/Icon";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    nom: "catalogue",
    to: "/catalogue",
    zonesActives: ["/catalogue", "/bouteilles"],
  },
  {
    nom: "cellier",
    to: "/sommaire-cellier",
    zonesActives: ["/sommaire-cellier", "/cellier"],
  },
  {
    nom: "liste",
    to: "/liste-achat",
    zonesActives: ["/liste-achat", "/liste"],
  },
  {
    nom: "profil",
    to: "/profil",
    zonesActives: ["/profil", "/modifier-utilisateur"],
  },
];

function MenuEnBas({}) {
  const { pathname } = useLocation();

  const estActif = (zones = []) =>
    zones.some((segment) => pathname.startsWith(segment));

  return (
    <footer className="grid grid-cols-4 bg-principal-300 border-t border-principal-200">
      {menuItems.map((item) => {
        const actif = estActif(item.zonesActives);
        const baseClasses =
          "flex flex-col items-center gap-(--rythme-tres-serre)  py-(--rythme-serre) transition-all duration-200 ease-out transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fond-secondaire";
        const actifClasses = actif ? "bg-fond-secondaire" : "";

        return (
          <Link
            key={item.nom}
            to={item.to}
            aria-current={actif ? "page" : undefined}
            className={`${baseClasses} ${actifClasses}`}
          >
            <Icon
              nom={item.nom}
              actif={actif}
              couleur={actif ? "principal-300" : "fond-secondaire"}
              typeMenu="bas"
              className="w-full"
            />
          </Link>
        );
      })}
    </footer>
  );
}

export default MenuEnBas;
