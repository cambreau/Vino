import LottieImport from "lottie-react";
import animationData from "./Broken Bottle.json";

// Normalise l'export par défaut pour fonctionner n'importe où.
const LottieComponent =
	typeof LottieImport === "function"
		? LottieImport
		: typeof LottieImport?.default === "function"
		? LottieImport.default
		: null;

function NonTrouver({ size = 160, ariaLabel = "Chargement", className = "" }) {
	const wrapperStyle = {
		display: "inline-flex",
		justifyContent: "center",
		alignItems: "center",
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
				style={wrapperStyle}>
				<LottieComponent
					animationData={animationData}
					loop
					autoplay
					style={animationStyle}
				/>
			</div>
		)
	);
}

export default NonTrouver;
