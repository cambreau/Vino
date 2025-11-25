import Icon from "../Icon/Icon";
import { Link } from "react-router-dom";
function MenuEnBas({}) {
  return (
    <footer className="grid grid-cols-4 mt-auto max-w-[500px] mx-auto inset-x-0 p-[var(--rythme-base)] bg-[var(--color-principal-300)]">
      <Link to="/catalogue">
        <Icon
          nom="catalogue"
          couleur="(--color-principal-100)"
          typeMenu="bas"
        />
      </Link>
      {/* ATTENTION LIEN A FAIRE */}
      <Link to="/sommaire-cellier">
        <Icon nom="cellier" couleur="(--color-principal-100)" typeMenu="bas" />
      </Link>
      {/* ATTENTION LIEN A FAIRE */}
      <Link to="#">
        <Icon nom="liste" couleur="(--color-principal-100)" typeMenu="bas" />
      </Link>
      <Link to="/profil">
        <Icon nom="profil" couleur="(--color-principal-100)" typeMenu="bas" />
      </Link>
    </footer>
  );
}

export default MenuEnBas;
