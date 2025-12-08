function NonTrouver({
  size = 160,
  ariaLabel = "Aucun résultat trouvé",
  className = "",
  message = "Aucune bouteille ne correspond à votre recherche",
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: 0.5,
        }}
      >
        <svg
          width={size * 0.5}
          height={size * 0.5}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 2v4m4-4v4m-4 0h4l2 4v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10l2-4" />
          <line x1="4" y1="4" x2="20" y2="20" stroke="#ef4444" strokeWidth="2" />
        </svg>
      </div>
      <p className="text-texte-secondaire text-(length:--taille-base) text-center">
        {message}
      </p>
    </div>
  );
}

export default NonTrouver;
