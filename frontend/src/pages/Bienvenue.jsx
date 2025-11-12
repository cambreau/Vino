import { Link } from "react-router-dom";

function Bienvenue() {
  return (
    <div className="hero-welcome flex items-end justify-center py-10 px-5">
      <div className="w-full max-w-md">
        {/* Texte de bienvenue */}
        <div className="text-center text-primary-foreground mb-8">
          <p className="text-sm mb-1 opacity-95">
            Votre cave personnelle, organisée
          </p>
          <p className="text-sm mb-8 opacity-95">comme vous le souhaitez</p>

          <h1 className="text-5xl font-bold mb-12">Bienvenue à Vino</h1>
        </div>

        {/* Boutons d'action */}
        <div className="space-y-4">
          <Link to="/" className="btn-primary text-center block">
            Créer votre compte
          </Link>
          <Link to="/connexion" className="btn-secondary text-center block">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Bienvenue;
