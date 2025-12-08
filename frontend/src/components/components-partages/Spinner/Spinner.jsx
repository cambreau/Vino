function Spinner({ size = 48, ariaLabel = "Chargement", className = "" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      className={className}
      style={{
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          border: `${Math.max(2, size / 12)}px solid var(--color-principal-100, #e5e7eb)`,
          borderTopColor: "var(--color-principal-300, #6366f1)",
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

export default Spinner;
