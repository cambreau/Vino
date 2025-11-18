import Icon from "../Icon/Icon";

function MenuEnBas({}) {
  return (
    <footer className="flex justify-around fixed bottom-0 w-full p-[var(--rythme-base)] bg-[var(--color-principal-300)]">
      <a href="#">
        <Icon nom="accueil" couleur="var(--color-principal-100)" />
      </a>
      <a href="#">
        <Icon nom="cellier" couleur="var(--color-principal-100)" />
      </a>
      <a href="#">
        <Icon nom="liste" couleur="var(--color-principal-100)" />
      </a>
      <a href="#">
        <Icon nom="recherche" couleur="var(--color-principal-100)" />
      </a>
      <a href="#">
        <Icon nom="profil" couleur="var(--color-principal-100)" />
      </a>
    </footer>
  );
}

export default MenuEnBas;
