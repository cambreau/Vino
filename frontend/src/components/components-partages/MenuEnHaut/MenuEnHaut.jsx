import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Icon from "../Icon/Icon";
import Bouton from "../Boutons/Bouton";
import RasinLogo from "../../../assets/images/grape_logo.svg";
import authentificationStore from "../../../stores/authentificationStore";

function MenuEnHaut({}) {
  const navigate = useNavigate();

  // Récupérer les données du store
  const utilisateur = authentificationStore((state) => state.utilisateur);
  const estConnecte = authentificationStore((state) => state.estConnecte);

  const [estMenuOuvert, setestMenuOuvert] = useState(false);

  /**
   * Fonction pour gérer la déconnexion
   */
  const gererDeconnexion = () => {
    authentificationStore.getState().deconnexion();
    navigate("/connexion?deconnexionSucces=true");
  };

  return (
    <nav className="flex items-center justify-between p-(--rythme-base) bg-(--color-fond-secondaire)">
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

        {/* Ombre */}
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
                <h2 className="text-(--color-texte-premier) text-(length:--taille-grand) font-display font-bold">
                  {estConnecte && utilisateur ? utilisateur.nom : ""}
                </h2>
                <small className="text-(--color-texte-premier) text-(length:--taille-moyen) font-display">
                  {estConnecte && utilisateur
                    ? utilisateur.courriel
                    : "Courriel"}
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
              <Link to="/profil" onClick={() => setestMenuOuvert(false)}>
                <Icon
                  nom="profil"
                  typeMenu="haut"
                  couleur="(--color-principal-300)"
                />
              </Link>
              <Link to="/catalogue" onClick={() => setestMenuOuvert(false)}>
                <Icon
                  nom="catalogue"
                  typeMenu="haut"
                  couleur="(--color-principal-300)"
                />
              </Link>
              <Link
                to="/sommaire-cellier"
                onClick={() => setestMenuOuvert(false)}
              >
                <Icon
                  nom="cellier"
                  typeMenu="haut"
                  couleur="(--color-principal-300)"
                />
              </Link>
              <Link to="#" onClick={() => setestMenuOuvert(false)}>
                <Icon
                  nom="liste"
                  typeMenu="haut"
                  couleur="(--color-principal-300)"
                />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Logo */}
      <Link to="/catalogue" className="flex items-center">
        <h2 className="text-(--color-principal-300) text-(length:--taille-grand) font-display">
          Vin
        </h2>
        <img src={RasinLogo} alt="Logo raisin" width="43" height="35" />
      </Link>

      {/* Déconnexion */}
      {estConnecte && (
        <Bouton
          texte={
            <Icon
              nom="deconnection"
              typeMenu="haut"
              couleur="(--color-principal-300)"
            />
          }
          type="secondaire"
          typeHtml="button"
          action={gererDeconnexion}
        />
      )}
    </nav>
  );
}

export default MenuEnHaut;
