import { useState } from "react";
import Icon from "../Icon/Icon";
import RasinLogo from "../../../assets/images/grape_logo.svg";

function MenuEnHaut({}) {
  // Dans la propos envoyer les infos de la personne connecter pour les afficher au menu
  const [estMenuOuvert, setestMenuOuvert] = useState(false);

  return (
    <nav className="flex items-center justify-between max-w-[500px] mx-auto inset-x-0 p-(--rythme-base) bg-(--color-fond-secondaire)">
      <div className="relative">
        {/* Bouton hamburger */}
        <button
          onClick={() => setestMenuOuvert(!estMenuOuvert)}
          aria-label={estMenuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={estMenuOuvert}
        >
          {!estMenuOuvert ? (
            <Icon
              nom="menuHamburger"
              typeMenu="haut"
              couleur="(--color-principal-300)"
            />
          ) : (
            <Icon
              nom="fermer"
              typeMenu="haut"
              couleur="(--color-principal-300)"
            />
          )}
        </button>

        {/* Menu déroulant */}
        {estMenuOuvert && (
          <div className="absolute mt-(--rythme-tres-serre) py-(--rythme-base) min-w-[300px] bg-(--color-fond-secondaire)">
            <header className="mb-[var(--rythme-espace)]">
              <h2 className="text-(--color-principal-300) text-(length:--taille-grand) font-display font-bold">
                Utilisateur
              </h2>
              <small className="text-(--color-principal-300) text-(length:--taille-moyen) font-display">
                Courriel
              </small>
            </header>
            <div className="flex flex-col gap-(--rythme-base)">
              <a href="#">
                <Icon
                  nom="profil"
                  typeMenu="haut"
                  couleur="(--color-principal-300)"
                />
              </a>
              <a href="#">
                <Icon
                  nom="chateau"
                  typeMenu="haut"
                  couleur="(--color-principal-300)"
                />
              </a>
              <a href="#">
                <Icon
                  nom="cellier"
                  typeMenu="haut"
                  couleur="(--color-principal-300)"
                />
              </a>
              <a href="#">
                <Icon
                  nom="liste"
                  typeMenu="haut"
                  couleur="(--color-principal-300)"
                />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Logo */}
      <header className="flex items-center">
        <h2 className="text-(--color-principal-300) text-(length:--taille-grand) font-display">
          Vin
        </h2>
        <img src={RasinLogo} alt="Logo raisin" width="43" height="35" />
      </header>

      {/* Déconnexion */}

      <button aria-label="Deconnection">
        <Icon
          nom="deconnection"
          typeMenu="haut"
          couleur="(--color-principal-300)"
        />
      </button>
    </nav>
  );
}

export default MenuEnHaut;
