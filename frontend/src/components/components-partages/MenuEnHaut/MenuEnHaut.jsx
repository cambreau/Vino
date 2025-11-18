import { useState } from "react";
import Icon from "../Icon/Icon";
import RasinLogo from "../../../assets/images/grape_logo.svg";

function MenuEnHaut({}) {
  // Dans la propos envoyer les infos de la personne connecter pour les afficher au menu
  const [estMenuOuvert, setestMenuOuvert] = useState(false);

  return (
    <nav>
      {/* Bouton hamburger */}
      <button onClick={() => setestMenuOuvert(!estMenuOuvert)}>
        {!estMenuOuvert ? (
          <Icon name="menuHamburger" typeMenu="haut" />
        ) : (
          <Icon name="fermer" typeMenu="haut" />
        )}
      </button>
      {/* Menu déroulant */}
      {estMenuOuvert && (
        <div>
          <header>
            <h2>Utilisateur</h2>
            <small>Courriel</small>
          </header>
          <ul>
            <li>
              <Icon name="utilisateur" typeMenu="haut" />
              <p>Profil</p>
            </li>
            <li>
              <Icon name="chateau" typeMenu="haut" />
              <p>Savoir Plus</p>
            </li>
            <li>
              <Icon name="cellier" typeMenu="haut" />
              <p>Celliers</p>
            </li>
            <li>
              <Icon name="liste" typeMenu="haut" />
              <p>Liste d'achat</p>
            </li>
          </ul>
        </div>
      )}

      {/* Logo */}
      <header>
        <h2>Vin</h2>
        <img src={RasinLogo} alt="Logo raisin" width="43" height="35" />
      </header>

      {/* Déconnexion */}
      <Icon name="deconnection" typeMenu="haut" />
    </nav>
  );
}

export default MenuEnHaut;
