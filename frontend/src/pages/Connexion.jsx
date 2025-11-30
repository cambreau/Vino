import BoutonRetour from "@components/components-partages/Boutons/BoutonRetour";
import ConnexionForm from "@components/connexion/ConnexionForm";

function Connexion() {
	return (
		<main
			className="
      min-h-screen py-(--rythme-espace) grid grid-rows-[1fr_5fr] items-end
      bg-[linear-gradient(0deg,rgba(0,0,0,0.7)25%,rgba(0,0,0,0)),url('@assets/images/bg3.png')] bg-cover bg-center bg-no-repeat bg-[#e0e0e0]">
			<header className="px-(--rythme-base)">
				<BoutonRetour />
			</header>

			<ConnexionForm />
		</main>
	);
}

export default Connexion;
