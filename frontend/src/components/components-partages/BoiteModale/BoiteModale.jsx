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
              mx-(--rythme-base)
              bg-fond-secondaire
              border border-(--color-secondaire)
              rounded-(--arrondi-grand)
              shadow-lg
              p-(--rythme-base)
            "
      >
        <h2
          className="
                text-texte-premier
                text-(length:--taille-moyen)
                font-display font-bold
                mb-(--rythme-base)
                text-center
              "
        >
          {texte}
        </h2>
        <div className="mt-(--rythme-espace) flex justify-center">
          {contenu}
        </div>
        <div className="mt-(--rythme-espace) flex justify-center gap-(--rythme-base)">
          {bouton}
        </div>
      </section>
    </div>
  );
}

export default BoiteModale;
