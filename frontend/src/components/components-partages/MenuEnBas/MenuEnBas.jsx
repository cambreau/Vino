import Icon from "../Icon/Icon";
import { Link } from "react-router-dom";
function MenuEnBas({}) {
  return (
    <footer className="flex justify-around fixed bottom-0 max-w-[500px] mx-auto inset-x-0 p-(--rythme-base) bg-(--color-principal-300)">
      <Link href="#">
        <Icon nom="accueil" couleur="(--color-principal-100)" typeMenu="bas" />
      </Link>
      <Link href="#">
        <Icon nom="cellier" couleur="(--color-principal-100)" typeMenu="bas" />
      </Link>
      <Link href="#">
        <Icon nom="liste" couleur="(--color-principal-100)" typeMenu="bas" />
      </Link>
      <Link href="#">
        <Icon
          nom="recherche"
          couleur="(--color-principal-100)"
          typeMenu="bas"
        />
      </Link>
      <Link href="#">
        <Icon nom="profil" couleur="(--color-principal-100)" typeMenu="bas" />
      </Link>
    </footer>
  );
}

export default MenuEnBas;
