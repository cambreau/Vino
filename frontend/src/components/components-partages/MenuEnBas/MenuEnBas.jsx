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
        const actifClasses = "bg-fond-secondaire text-principal-300";
        const inactifClasses =
          "text-principal-100/80 hover:text-fond-secondaire hover:-translate-y-0.5";

        return (
          <Link
            key={item.nom}
            to={item.to}
            aria-current={actif ? "page" : undefined}
            className={`${baseClasses} ${
              actif ? actifClasses : inactifClasses
            }`}
          >
            <Icon
              nom={item.nom}
              typeMenu="bas"
              className="w-full"
              couleur={actif ? "principal-300" : "principal-100"}
            />
          </Link>
        );
      })}
    </footer>
  );
}

export default MenuEnBas;
