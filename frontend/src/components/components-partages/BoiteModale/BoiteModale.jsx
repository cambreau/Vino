function BoiteModale({ texte, contenu = null, bouton }) {
  return (
    <div
      className="
            fixed inset-0
            bg-black/50
            flex items-center justify-center
            z-50
          "
    >
      <section
        className="
              max-w-[500px] w-full
              mx-[var(--rythme-base)]
              bg-[var(--color-fond-secondaire)]
              border border-[var(--color-secondaire)]
              rounded-[var(--arrondi-grand)]
              shadow-lg
              p-[var(--rythme-base)]
            "
      >
        <h2
          className="
                text-[var(--color-texte-premier)]
                text-[length:var(--taille-moyen)]
                font-display font-bold
                mb-[var(--rythme-base)]
                text-center
              "
        >
          {texte}
        </h2>
        <div className="mt-[var(--rythme-espace)] flex justify-center">
          {contenu}
        </div>
        <div className="mt-[var(--rythme-espace)] flex justify-center gap-[var(--rythme-base)]">
          {bouton}
        </div>
      </section>
    </div>
  );
}

export default BoiteModale;
