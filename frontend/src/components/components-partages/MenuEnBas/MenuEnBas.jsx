import Icon from "@components/components-partages/Icon/Icon";
import { Link } from "react-router-dom";
function MenuEnBas({}) {
  return (
    <footer className="grid grid-cols-4 mt-auto p-(--rythme-base) bg-principal-300">
      <Link to="/catalogue">
        <Icon nom="catalogue" couleur="principal-100" typeMenu="bas" />
      </Link>
      {/* ATTENTION LIEN A FAIRE */}
      <Link to="/sommaire-cellier">
        <Icon nom="cellier" couleur="principal-100" typeMenu="bas" />
      </Link>
      {/* ATTENTION LIEN A FAIRE */}
      <Link to="#">
        <Icon nom="liste" couleur="principal-100" typeMenu="bas" />
      </Link>
      <Link to="/profil">
        <Icon nom="profil" couleur="principal-100" typeMenu="bas" />
      </Link>
    </footer>
  );
}

export default MenuEnBas;
