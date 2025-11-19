import { useState } from "react";
import Icon from "../Icon/Icon";
import RasinLogo from "../../../assets/images/grape_logo.svg";
import FormulaireInput from "../Formulaire/FormulaireInput/FormulaireInput";

function MenuEnHaut({}) {
  // Dans la propos envoyer les infos de la personne connecter pour les afficher au menu
  const [estMenuOuvert, setestMenuOuvert] = useState(false);
  const [estRechercheOuvert, setestRechercheOuvert] = useState(false);

  // VOIR COMMENT UTILISER LE FORMINPUT ---- POUR ENLEVER LE BUG
  const handleChange = (e) => {
    setRecherche(e.target.value);
  };

  const handleBlur = (e) => {};

  return (
    <nav className="flex items-center justify-between max-w-[500px] mx-auto inset-x-0 p-(--rythme-base) bg-(--color-fond-secondaire)">
      <div className="relative">
        {/* Bouton hamburger */}
        <button
          onClick={() => setestMenuOuvert(!estMenuOuvert)}
          aria-label={estMenuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={estMenuOuvert}
        >
          <Icon
            nom="menuHamburger"
            typeMenu="haut"
            couleur="(--color-principal-300)"
          />
        </button>

        {/* Overlay gris (voile) */}
        {estMenuOuvert && (
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setestMenuOuvert(false)}
          />
        )}

        {/* Menu déroulant */}
        {estMenuOuvert && (
          <div className="absolute -left-(--rythme-base) mt-(--rythme-tres-serre) p-(--rythme-base) h-screen  min-w-[300px] bg-(--color-fond-secondaire)">
            <div className="flex justify-between mb-(--rythme-espace)">
              <header>
                <h2 className="text-(--color-principal-300) text-(length:--taille-grand) font-display font-bold">
                  Utilisateur
                </h2>
                <small className="text-(--color-principal-300) text-(length:--taille-moyen) font-display">
                  Courriel
                </small>
              </header>
              <button
                className="absolute right-(--rythme-base) top-(--rythme-serre)"
                onClick={() => setestMenuOuvert(!estMenuOuvert)}
                aria-label={estMenuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={estMenuOuvert}
              >
                <Icon
                  nom="fermer"
                  typeMenu="haut"
                  couleur="(--color-principal-300)"
                />
              </button>
            </div>
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

      {/* Bouton Recherche */}
      <div className="flex items-center gap-(--rythme-base) mb-(--rythme-tres-serre) relative">
        <button
          onClick={() => setestRechercheOuvert(!estRechercheOuvert)}
          aria-label={
            estRechercheOuvert ? "Fermer la recherche" : "Ouvrir la recherche"
          }
        >
          <Icon
            nom="recherche"
            couleur="(--color-principal-300)"
            typeMenu="haut"
          />
        </button>

        {/* Overlay gris */}
        {estRechercheOuvert && (
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setestRechercheOuvert(false)}
          />
        )}

        {/* Menu de recherche déroulant */}
        {estRechercheOuvert && (
          <div className="absolute top-full h-screen -right-(--rythme-base) mt-(--rythme-serre) p-(--rythme-espace) px-(--rythme-base) min-w-[300px] bg-(--color-fond-secondaire)">
            <div>
              <FormulaireInput
                type="test"
                nom=""
                genre="un"
                estObligatoire={true}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <button
                className="absolute right-(--rythme-base) top-(--rythme-serre)"
                onClick={() => setestRechercheOuvert(!estRechercheOuvert)}
                aria-label={
                  estRechercheOuvert ? "Fermer recherche" : "Ouvrir recherche"
                }
                aria-expanded={estRechercheOuvert}
              >
                <Icon
                  nom="fermer"
                  typeMenu="haut"
                  couleur="(--color-principal-300)"
                />
              </button>
            </div>
          </div>
        )}

        {/* Déconnexion */}
        <button aria-label="Déconnexion">
          <Icon
            nom="deconnection"
            typeMenu="haut"
            couleur="(--color-principal-300)"
          />
        </button>
      </div>
    </nav>
  );
}

export default MenuEnHaut;
