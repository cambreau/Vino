import { Link } from "react-router-dom";
import "../styles/bienvenue.css";

const Bienvenue = () => {
  return (
    <main className="bienvenue">
      <section className="conteneur-max-md">

        {/* Texte de bienvenue */}
        <header className="bienvenue__texte">
          <p className="bienvenue__sousTitre">
            Votre cave personnelle, organisée <br />
            comme vous le souhaitez
          </p>

          <h1>Bienvenue à Vino</h1>
        </header>

        {/* Boutons d'action */}
        <div className="btn__action">
          <Link to="/" className="btn__primaire block text-center">
            Créer votre compte
          </Link>
          <Link to="/connexion" className="btn__secondaire block text-center">
            Se connecter
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Bienvenue;
