import { Link } from "react-router-dom";

function Bienvenue() {
  return (
    <main className="
        flex items-end justify-center
        py-10 px-5
        bg-[linear-gradient(0deg,rgba(0,0,0,1)25%,rgba(0,0,0,0)),url('../assets/images/heroBienvenue.webp')] bg-cover bg-center min-h-screen">
      <section className="
        w-full max-w-md">
        {/* Texte de bienvenue */}
        <header className="
          text-center
          mb-8
          text-primary-foreground">
          <p className="
            text-sm font-normal
            mb-1
            opacity-95">
            Votre cave personnelle, organisée
          </p>
          <p className="
            text-sm font-normal
            mb-8
            opacity-95">
            comme vous le souhaitez
          </p>

          <h1 className="
            text-5xl font-bold
            mb-12">
            Bienvenue à Vino
          </h1>
        </header>

        {/* Boutons d'action */}
        <div className="
          flex flex-col
          gap-4 ">

          {/* Bouton Secondaire */}
          <Link to="/connexion" className="
              text-center block
              px-8 py-3
              font-semibold
              bg-[#821250] text-white rounded-lg shadow-md
              hover:bg-[#A8427D] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
            Se connecter
          </Link>

          {/* Lien "Pas encore de compte?" */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-300">
              Pas encore de compte?{' '}
              <Link to="/inscription" className="text-[#A8427D] font-semibold hover:text-[#F5DFE5]">
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