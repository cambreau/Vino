import Icon from "../Icon/Icon";
import { Link } from "react-router-dom";
function MenuEnBas({}) {
  return (
    <footer className="flex justify-around fixed bottom-0 w-full p-[var(--rythme-base)] bg-[var(--color-principal-300)]">
      <Link href="#">
        <Icon nom="accueil" couleur="var(--color-principal-100)" />
      </Link>
      <Link href="#">
        <Icon nom="cellier" couleur="var(--color-principal-100)" />
      </Link>
      <Link href="#">
        <Icon nom="liste" couleur="var(--color-principal-100)" />
      </Link>
      <Link href="#">
        <Icon nom="recherche" couleur="var(--color-principal-100)" />
      </Link>
      <Link href="#">
        <Icon nom="profil" couleur="var(--color-principal-100)" />
      </Link>
    </footer>
  );
}

export default MenuEnBas;
