import { Link, useNavigate } from "react-router-dom";
import Bouton from "../components/components-partages/Formulaire/FormulaireBouton/Bouton";

function Bienvenue() {
  const navigate = useNavigate();

  return (
    <main
      className="
      flex items-end justify-center min-h-screen py-10 px-5
      font-body
       bg-[linear-gradient(0deg,rgba(0,0,0,0.7)25%,rgba(0,0,0,0)),url('../assets/images/heroBienvenue.webp')] bg-cover bg-center
      "
    >
      <section className="w-full max-w-md">
        {/* Texte de bienvenue */}
        <header
          className="
          text-center mb-8
          text-principal-premier-plan
          "
        >
          <p
            className="
            mb-1
            text-(length:--taille-petit) font-normal
            "
          >
            Votre cave personnelle, organisée
          </p>

          <p
            className="
            mb-8
            text-(length:--taille-petit) font-normal
            "
          >
            comme vous le souhaitez
          </p>

          <h1
            className="
            mb-12
            text-(length:--taille-tres-gros) font-display font-bold
            "
          >
            Bienvenue à Vino
          </h1>
        </header>

        {/* Boutons d'action */}
        <div className="flex flex-col gap-4">
          {/* Bouton Primaire - Se connecter */}
          <Bouton
            texte="Se connecter"
            type="primaire"
            action={() => navigate("/connexion")}
          />

          {/* Lien "Pas encore de compte?" */}
          <div className="text-center mt-4">
            <p
              className="
              text-(length:--taille-petit)
              text-principal-premier-plan
              "
            >
              Pas encore de compte?{" "}
              <Link
                to="/inscription"
                className="
                font-semibold
                text-principal-200
                hover:text-principal-100 transition-couleurs"
              >
                Je m'inscris
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Bienvenue;
