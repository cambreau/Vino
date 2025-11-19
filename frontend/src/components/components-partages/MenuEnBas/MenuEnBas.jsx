import Icon from "../Icon/Icon";
import { Link } from "react-router-dom";
function MenuEnBas({}) {
  return (
    <footer className="flex justify-around fixed bottom-0 w-full p-(--rythme-base) bg-(--color-principal-300)">
      <Link href="#">
        <Icon
          nom="accueil"
          couleur="var(--color-principal-100)"
          typeMenu="bas"
        />
      </Link>
      <Link href="#">
        <Icon
          nom="cellier"
          couleur="var(--color-principal-100)"
          typeMenu="bas"
        />
      </Link>
      <Link href="#">
        <Icon nom="liste" couleur="var(--color-principal-100)" typeMenu="bas" />
      </Link>
      <Link href="#">
        <Icon
          nom="recherche"
          couleur="var(--color-principal-100)"
          typeMenu="bas"
        />
      </Link>
      <Link href="#">
        <Icon
          nom="profil"
          couleur="var(--color-principal-100)"
          typeMenu="bas"
        />
      </Link>
    </footer>
  );
}

export default MenuEnBas;
