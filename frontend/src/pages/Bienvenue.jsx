import { Link } from "react-router-dom";

function Bienvenue() {
  return (
    <main className="
      flex items-end justify-center min-h-screen py-10 px-5
      font-[family-name:var(--font-body)]
      bg-[linear-gradient(0deg,rgba(0,0,0,0.7)25%,rgba(0,0,0,0)),url('../assets/images/heroBienvenue.webp')] bg-cover bg-center
      ">
      
      <section className="w-full max-w-md">

        {/* Texte de bienvenue */}
        <header className="
          text-center mb-8
          text-[color:var(--color-principal-premier-plan)]
          ">
          
          <p className="
            mb-1
            text-[length:var(--taille-petit)] font-normal
            ">
            Votre cave personnelle, organisée
          </p>
          
          <p className="
            mb-8
            text-[length:var(--taille-petit)] font-normal
            ">
            comme vous le souhaitez
          </p>

          <h1 className="
            mb-12
            text-[length:var(--taille-tres-gros)] font-[family-name:var(--font-display)] font-bold
            ">
            Bienvenue à Vino
          </h1>
        </header>

        {/* Boutons d'action */}
        <div className="flex flex-col gap-4">

          {/* Bouton Secondaire - Se connecter */}
          <Link to="/connexion" className="
            block text-center px-8 py-3
            text-[length:var(--taille-normal)] font-semibold
            bg-[color:var(--color-principal-200)] text-[color:var(--color-fond)] border-1 border-[color:var(--color-principal-200)]  rounded-[length:var(--arrondi-grand)] shadow-md
            hover:bg-[color:var(--color-principal-premier-plan)] hover:text-[color:var(--color-principal-300)] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
            Se connecter
          </Link>

          {/* Lien "Pas encore de compte?" */}
          <div className="text-center mt-4">
            <p className="
              text-[length:var(--taille-petit)]
              text-[color:var(--color-principal-premier-plan)]
              ">
              Pas encore de compte?{' '}
              <Link to="/inscription" className="
                font-semibold
                text-[color:var(--color-principal-200)]
                hover:text-[color:var(--color-principal-100)] transition-colors">
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