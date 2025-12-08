import { useEffect, useState } from "react";
import {
  IconErreur,
  IconSucces,
  IconInfo,
  IconFermerX,
} from "@components/components-partages/Icon/SvgIcons";

/**
 * Composant Toast pour afficher des notifications temporaires
 * @param {string} texte - Le texte du message
 * @param {string} type - Le type de message (succes, erreur, information)
 * @param {number} duree - Durée d'affichage en ms (défaut: 3000)
 * @param {function} onFerme - Callback appelé à la fermeture
 */
function Toast({
  texte,
  type = "information",
  duree = 3000,
  onFerme,
}) {
  const [visible, setVisible] = useState(true);
  const [sortie, setSortie] = useState(false);

  useEffect(() => {
    if (!texte) return;

    // Timer pour lancer l'animation de sortie
    const timerSortie = setTimeout(() => {
      setSortie(true);
    }, duree - 300); // Commencer l'animation 300ms avant la fin

    // Timer pour fermer complètement
    const timerFermeture = setTimeout(() => {
      setVisible(false);
      if (onFerme) onFerme();
    }, duree);

    return () => {
      clearTimeout(timerSortie);
      clearTimeout(timerFermeture);
    };
  }, [texte, duree, onFerme]);

  // Fermeture manuelle
  const gererFermeture = () => {
    setSortie(true);
    setTimeout(() => {
      setVisible(false);
      if (onFerme) onFerme();
    }, 300);
  };

  if (!visible || !texte) return null;

  // Classes de base pour le toast
  const classesBase = `
    fixed top-4 left-4 right-4 z-50
    mx-auto max-w-md
    px-(--rythme-serre) py-(--rythme-serre)
    font-body font-light text-(length:--taille-petit) text-(--color-fond)
    rounded-(--arrondi-grand) shadow-lg
    flex items-center justify-between gap-(--rythme-serre)
  `;

  // Animation d'entrée/sortie
  const classesAnimation = sortie
    ? "animate-toast-out"
    : "animate-toast-in";

  // Classes selon le type
  const classesType =
    type === "erreur"
      ? "bg-erreur"
      : type === "succes"
      ? "bg-succes"
      : "bg-texte-secondaire";

  // Icône selon le type
  const getIcone = () => {
    const iconTaille = 24;

    switch (type) {
      case "erreur":
        return <IconErreur size={iconTaille} />;
      case "succes":
        return <IconSucces size={iconTaille} />;
      default:
        return <IconInfo size={iconTaille} />;
    }
  };

  return (
    <div
      className={`${classesBase} ${classesType} ${classesAnimation}`}
      role="alert"
      aria-live="polite"
    >
      <div className="shrink-0">{getIcone()}</div>

      <div className="flex-1 text-center">
        <span>{texte}</span>
      </div>

      <button
        onClick={gererFermeture}
        className="shrink-0 hover:opacity-75 transition-opacity cursor-pointer"
        aria-label="Fermer le message"
      >
        <IconFermerX size={20} />
      </button>
    </div>
  );
}

export default Toast;
