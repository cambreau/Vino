import LottieImport from "lottie-react";
import animationData from "./Zen Loading Trails.json";

// Normalise l'export par défaut pour fonctionner n'importe où.
const LottieComponent =
	typeof LottieImport === "function"
		? LottieImport
		: typeof LottieImport?.default === "function"
		? LottieImport.default
		: null;

function Spinner({
	size = 48,
	ariaLabel = "Chargement",
	className = "",
	color = "#821250" // couleur principale-300
}) {
	const wrapperStyle = {
		display: "inline-flex",
		justifyContent: "center",
		alignItems: "center",
	};

	const spinnerStyle = {
		width: size,
		height: size,
		border: `${Math.max(3, size / 12)}px solid #e5e7eb`,
		borderTopColor: color,
		borderRadius: "50%",
		animation: "spinnerRotate 0.8s linear infinite",
	};

	const animationStyle = {
		width: size,
		height: size,
	};

	return (
		<>
			<style>{`
				@keyframes spinnerRotate {
					to { transform: rotate(360deg); }
				}
			`}</style>
			<div
				role="status"
				aria-live="polite"
				aria-label={ariaLabel}
				className={className}
				style={wrapperStyle}>
				{LottieComponent ? (
					<LottieComponent
						animationData={animationData}
						loop
						autoplay
						style={animationStyle}
					/>
				) : (
					<div style={spinnerStyle} />
				)}
			</div>
		</>
	);
}

export default Spinner;
