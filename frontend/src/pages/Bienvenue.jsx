import { Link } from "react-router-dom";
import "../styles/bienvenue.css";

const Bienvenue = () => {
  return (
    <div className="bienvenue-hero">
      <div className="conteneur-max-md">
        {/* Texte de bienvenue */}
        <div className="texte-bienvenue">
          <p className="sous-titre-bienvenue">
            Votre cave personnelle, organisée <br />
            comme vous le souhaitez
          </p>

          <h1 className="titre-bienvenue">Bienvenue à Vino</h1>
        </div>

        {/* Boutons d'action */}
        <div className="conteneur-boutons">
          <Link to="/" className="btn-primaire lien-bloc-centre">
            Créer votre compte
          </Link>
          <Link to="/connexion" className="btn-secondaire lien-bloc-centre">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Bienvenue;
