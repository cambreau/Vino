import { Link } from "react-router-dom";

function Bienvenue() {
  return (
    <main className="
      // Disposition + Espacement
      flex items-end justify-center min-h-screen py-10 px-5
      // Typographie
      font-[family-name:var(--font-body)]
      // Visual
      bg-[linear-gradient(0deg,rgba(0,0,0,0.7)25%,rgba(0,0,0,0)),url('../assets/images/heroBienvenue.webp')] bg-cover bg-center
      ">
      
      <section className="
        // Disposition + Espacement
        w-full max-w-md">

        {/* Texte de bienvenue */}
        <header className="
          // Disposition + Espacement
          text-center mb-8
          // Visual
          text-[color:var(--color-principal-premier-plan)]
          // Interactif
          ">
          
          <p className="
            // Disposition + Espacement
            mb-1
            // Typographie
            text-[length:var(--taille-petit)] font-normal
            ">
            Votre cave personnelle, organisée
          </p>
          
          <p className="
            // Disposition + Espacement
            mb-8
            // Typographie
            text-[length:var(--taille-petit)] font-normal
            ">
            comme vous le souhaitez
          </p>

          <h1 className="
            // Disposition + Espacement
            mb-12
            // Typographie
            text-[length:var(--taille-tres-gros)] font-[family-name:var(--font-display)] font-bold
            ">
            Bienvenue à Vino
          </h1>
        </header>

        {/* Boutons d'action */}
        <div className="
          // Disposition + Espacement
          flex flex-col gap-4
          ">

          {/* Bouton Secondaire - Se connecter */}
          <Link to="/connexion" className="
            // Disposition + Espacement
            block text-center px-8 py-3
            // Typographie
            text-[length:var(--taille-normal)] font-semibold
            // Visual
            bg-[color:var(--color-principal-200)] text-[color:var(--color-fond)] border-1 border-[color:var(--color-principal-200)]  rounded-[length:var(--arrondi-grand)] shadow-md
            // Interactif
            hover:bg-[color:var(--color-principal-premier-plan)] hover:text-[color:var(--color-principal-300)] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
            Se connecter
          </Link>

          {/* Lien "Pas encore de compte?" */}
          <div className="
            // Disposition + Espacement
            text-center mt-4
            ">
            <p className="
              // Typographie
              text-[length:var(--taille-petit)]
              // Visual
              text-[color:var(--color-principal-premier-plan)]
              ">
              Pas encore de compte?{' '}
              <Link to="/inscription" className="
                // Typographie
                font-semibold
                // Visual
                text-[color:var(--color-principal-200)]
                // Interactif
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