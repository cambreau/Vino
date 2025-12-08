import { useLottie } from "lottie-react";
import animationData from "./Zen Loading Trails.json";

function Spinner({
  size = 48,
  ariaLabel = "Chargement",
  className = "",
}) {
  const wrapperStyle = {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const animationStyle = {
    width: size,
    height: size,
  };

  const { View } = useLottie({
    animationData,
    loop: true,
    autoplay: true,
    style: animationStyle,
  });

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      className={className}
      style={wrapperStyle}
    >
      {View}
    </div>
  );
}

export default Spinner;
