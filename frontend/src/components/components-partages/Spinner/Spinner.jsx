import Lottie from "lottie-react";
import animationData from "./Zen Loading Trails.json";

function Spinner({ size = 160, ariaLabel = "Chargement", className = "" }) {
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
		<div
			role="status"
			aria-live="polite"
			aria-label={ariaLabel}
			className={className}
			style={wrapperStyle}>
			<Lottie
				animationData={animationData}
				loop
				autoplay
				style={animationStyle}
			/>
		</div>
	);
}

export default Spinner;
