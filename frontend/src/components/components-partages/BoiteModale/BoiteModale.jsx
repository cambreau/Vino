import { createPortal } from "react-dom";

function BoiteModale({ texte, contenu = null, bouton }) {
  /**
   * Empêche la propagation des clics dans le contenu de la modale
   * Cela évite que la modale se ferme lorsqu'on clique dans les champs de formulaire (textarea, input, etc.)
   * @param {Event} e - L'événement de clic
   */
  const gererClicContenu = (e) => {
    e.stopPropagation();
  };

  const modaleContent = (
    <div
      className="
            fixed inset-0
            bg-black/50
            flex items-center justify-center
            z-50
          "
      onClick={(e) => {
        // Empêche la propagation vers les éléments parents (comme un Link)
        e.stopPropagation();
      }}
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
        onClick={gererClicContenu}
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

  /**
   * Utilise createPortal pour rendre la modale directement dans le body
   * Cela garantit qu'elle est en dehors de la hiérarchie DOM (et donc du Link)
   * Ref: https://react.dev/reference/react-dom/createPortal
   */
  return createPortal(modaleContent, document.body);
}

export default BoiteModale;
