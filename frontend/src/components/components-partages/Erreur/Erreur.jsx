import { useNavigate } from "react-router-dom";
import Bouton from "@components/components-partages/Boutons/Bouton";
import Message from "@components/components-partages/Message/Message";

/**
 * Composant pour afficher une page d'erreur
 */
function Erreur({}) {
  const navigate = useNavigate();

  const handleAction = () => {
    navigate(lienBouton);
  };

  return (
    <section className="min-h-screen bg-fond flex flex-col items-center justify-center px-(--rythme-serre) py-(--rythme-espace)">
      <h1 className="text-(length:--taille-tres-grand) font-display font-bold text-erreur">
        Erreur 403 - Acces refuse
      </h1>
      <Message
        type="erreur"
        texte={"Vous n'avez pas l'autorisation d'accéder à cette ressource."}
      />
      <Bouton
        texte={texteBouton}
        type="primaire"
        typeHtml="button"
        action={handleAction}
      />
    </section>
  );
}

export default Erreur;
