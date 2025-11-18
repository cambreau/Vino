import { MdError, MdCheckCircle, MdInfo, MdClose } from "react-icons/md";

function Message({
  texte,
  type = "information", //Ou erreur ou succes
  onClose,
}) {
  // Classes de base pour les messages
  const classesBase = `
    w-full px-(--rythme-base) py-(--rythme-serre)
    font-body font-medium text-taille-petit text-principal-premier-plan
    rounded-(--arrondi-grand) shadow-md
    transition-all duration-300
    flex items-center justify-between gap-(--rythme-serre)
  `;

  // Classes selon le type
  const classesErreur = `bg-erreur`;
  const classesSucces = `bg-succes`;
  const classesInformation = `bg-texte-secondaire`;

  // Sélection des classes selon le type
  const classesType =
    type === "erreur"
      ? classesErreur
      : type === "succes"
      ? classesSucces
      : classesInformation;

  // Icône selon le type
  const getIcone = () => {
    const iconSize = 24;
    const iconClass = "";

    switch (type) {
      case "erreur":
        return <MdError size={iconSize} className={iconClass} />;
      case "succes":
        return <MdCheckCircle size={iconSize} className={iconClass} />;
      default:
        return <MdInfo size={iconSize} className={iconClass} />;
    }
  };

  return (
    <div className={`${classesBase} ${classesType}`} role="alert">
      <div>{getIcone()}</div>

      <div className="text-center">
        <span>{texte}</span>
      </div>

      <div>
        {onClose && (
          <button
            onClick={onClose}
            className="hover:opacity-75 transition-opacity cursor-pointer"
            aria-label="Fermer le message"
          >
            <MdClose size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Message;
