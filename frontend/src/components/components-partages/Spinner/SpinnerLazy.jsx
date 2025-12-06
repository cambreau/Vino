import { lazy, Suspense } from "react";

// Lazy load du composant Spinner complet (avec Lottie)
const SpinnerLottie = lazy(() => import("./Spinner"));

// Fallback CSS simple pendant le chargement
function SpinnerFallback({ size = 160, className = "" }) {
	return (
		<div
			role="status"
			aria-live="polite"
			aria-label="Chargement"
			className={className}
			style={{
				display: "inline-flex",
				justifyContent: "center",
				alignItems: "center",
			}}>
			<div
				style={{
					width: size * 0.4,
					height: size * 0.4,
					border: "3px solid #e5e7eb",
					borderTopColor: "#6b21a8",
					borderRadius: "50%",
					animation: "spin 0.8s linear infinite",
				}}
			/>
			<style>{`
				@keyframes spin {
					to { transform: rotate(360deg); }
				}
			`}</style>
		</div>
	);
}

function SpinnerLazy({ size = 160, ariaLabel = "Chargement", className = "" }) {
	return (
		<Suspense fallback={<SpinnerFallback size={size} className={className} />}>
			<SpinnerLottie size={size} ariaLabel={ariaLabel} className={className} />
		</Suspense>
	);
}

export default SpinnerLazy;
