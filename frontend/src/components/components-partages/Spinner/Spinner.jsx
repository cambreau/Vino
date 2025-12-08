/**
 * Spinner CSS léger pour le chargement initial.
 * Utilise uniquement du CSS, pas de dépendances externes.
 * Utilisez SpinnerLazy.jsx pour les animations Lottie (chargé en différé).
 */
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
				<div style={spinnerStyle} />
			</div>
		</>
	);
}

export default Spinner;
