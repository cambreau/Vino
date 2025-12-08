import { lazy, Suspense } from "react";

// Lazy load du composant Spinner complet (avec Lottie)
const SpinnerLottie = lazy(() => import("./Spinner"));

// Fallback simple pendant le chargement
function SpinnerFallback({
	size = 48,
	className = "",
	color = "#821250",
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
				aria-label="Chargement"
				className={className}
				style={wrapperStyle}>
				<div style={spinnerStyle} />
			</div>
		</>
	);
}

function SpinnerLazy({
	size = 48,
	ariaLabel = "Chargement",
	className = "",
	color = "#821250",
}) {
	return (
		<Suspense
			fallback={
				<SpinnerFallback size={size} className={className} color={color} />
			}>
			<SpinnerLottie
				size={size}
				ariaLabel={ariaLabel}
				className={className}
				color={color}
			/>
		</Suspense>
	);
}

export default SpinnerLazy;
