import LottieImport from "lottie-react";
import animationData from "./Broken Bottle.json";

// Normalise l'export par défaut pour fonctionner n'importe où.
const LottieComponent =
  typeof LottieImport === "function"
    ? LottieImport
    : typeof LottieImport?.default === "function"
    ? LottieImport.default
    : null;

function NonTrouver({
  size = 160,
  ariaLabel = "Aucun résultat trouvé",
  className = "",
  message = "Aucune bouteille ne correspond à votre recherche",
}) {
  const wrapperStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
  };

  const animationStyle = {
    width: size,
    height: size,
  };

  return (
    LottieComponent && (
      <div
        role="status"
        aria-live="polite"
        aria-label={ariaLabel}
        className={className}
        style={wrapperStyle}
      >
        <LottieComponent
          animationData={animationData}
          loop
          autoplay
          style={animationStyle}
        />
        <p className="text-texte-secondaire text-(length:--taille-base) text-center">
          {message}
        </p>
      </div>
    )
  );
}

export default NonTrouver;
