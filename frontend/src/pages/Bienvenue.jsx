import { Link } from "react-router-dom";
import ConnexionForm from "@components/connexion/ConnexionForm";
import { useDocumentTitle } from "@lib/utils.js";

function Bienvenue() {
  useDocumentTitle("Bienvenue");
  return (
    <main
      className="
        flex items-end justify-center min-h-screen py-(--rythme-espace) px-(--rythme-base)
        font-body
        bg-[linear-gradient(0deg,rgba(0,0,0,0.7)25%,rgba(0,0,0,0)),url('@assets/images/heroBienvenue.webp')] bg-cover bg-center
      "
    >
      <section className="w-full max-w-md">
        {/* Texte de bienvenue */}
        <header
          className="
            text-center mb-(--rythme-tres-espace)
          "
        >
          <h1
            className="
			mb-(--rythme-base)
              text-(length:--taille-tres-gros)
              font-display font-bold
              text-fond
            "
          >
            Bienvenue à Vino
          </h1>

          <p
            className="
              mt-(--rythme-tres-serre)
              text-(length:--taille-petit) font-normal text-fond
            "
          >
            Votre cave personnelle, organisée comme vous le souhaitez
          </p>
        </header>

        <ConnexionForm messageWrapperClassName="mb-(--rythme-espace)" />

        {/* Lien "Pas encore de compte?" */}
        <div className="text-center mt-(--rythme-base)">
          <p
            className="
              text-(length:--taille-petit)
              text-fond
            "
          >
            Pas encore de compte?{" "}
            <Link
              to="/inscription"
              className="
                font-semibold
                text-principal-200
                hover:text-principal-100 transition-colors
              "
            >
              Je m'inscris
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Bienvenue;
