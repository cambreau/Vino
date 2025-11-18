import { useState } from "react";
import Icon from "../Icon/Icon";
import RasinLogo from "../../../assets/images/grape_logo.svg";

function MenuEnHaut({}) {
  // Dans la propos envoyer les infos de la personne connecter pour les afficher au menu
  const [estMenuOuvert, setestMenuOuvert] = useState(false);

  return (
    <nav className="flex items-center justify-between fixed top-0 w-full p-[var(--rythme-base)] bg-[var(--color-fond-secondaire)]">
      <div className="relative">
        {/* Bouton hamburger */}
        <button onClick={() => setestMenuOuvert(!estMenuOuvert)}>
          {!estMenuOuvert ? (
            <Icon
              nom="menuHamburger"
              typeMenu="haut"
              couleur="var(--color-principal-200)"
            />
          ) : (
            <Icon
              nom="fermer"
              typeMenu="haut"
              couleur="var(--color-principal-200)"
            />
          )}
        </button>

        {/* Menu déroulant */}
        {estMenuOuvert && (
          <div className="absolute mt-[var(--rythme-tres-serre)] py-[var(--rythme-base)] min-w-[300px] bg-[var(--color-fond-secondaire)]">
            <header className="mb-[var(--rythme-espace)]">
              <h2
                className="text-[var(--color-principal-200)] font-bold"
                style={{
                  fontSize: "var(--taille-grand)",
                  fontFamily: "var(--font-display)",
                }}
              >
                Utilisateur
              </h2>
              <small
                className="text-[var(--color-principal-200)]"
                style={{
                  fontSize: "var(--taille-moyen)",
                  fontFamily: "var(--font-display)",
                }}
              >
                Courriel
              </small>
            </header>
            <div className="flex flex-col gap-[var(--rythme-base)]">
              <a href="#">
                <Icon
                  nom="profil"
                  typeMenu="haut"
                  couleur="var(--color-principal-200)"
                />
              </a>
              <a href="#">
                <Icon
                  nom="chateau"
                  typeMenu="haut"
                  couleur="var(--color-principal-200)"
                />
              </a>
              <a href="#">
                <Icon
                  nom="cellier"
                  typeMenu="haut"
                  couleur="var(--color-principal-200)"
                />
              </a>
              <a href="#">
                <Icon
                  nom="liste"
                  typeMenu="haut"
                  couleur="var(--color-principal-200)"
                />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Logo */}
      <header className="flex items-center">
        <h2
          className="text-[var(--color-principal-200)]"
          style={{
            fontSize: "var(--taille-grand)",
            fontFamily: "var(--font-display)",
          }}
        >
          Vin
        </h2>
        <img src={RasinLogo} alt="Logo raisin" width="43" height="35" />
      </header>

      {/* Déconnexion */}

      <button>
        <Icon
          nom="deconnection"
          typeMenu="haut"
          couleur="var(--color-principal-200)"
        />
      </button>
    </nav>
  );
}

export default MenuEnHaut;
