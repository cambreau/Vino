function Formulaire({
  titreFormulaire,
  method,
  action = null,
  enfants,
  bouton,
  classeTitre = "", // accent ou rien
}) {
  const titreAccent = "text-(--color-principal-300)";
  return (
    <section className="px-(--rythme-base)">
      <h1
        className={`text-(length:--taille-grand)  font-display font-bold mb-(--rythme-base)
      ${classeTitre === "accent" ? titreAccent : "text-(--color-fond)"}`}
      >
        {titreFormulaire}
      </h1>
      <form method={method} className="flex flex-col gap-(--rythme-base)">
        {enfants}
        {bouton}
      </form>
    </section>
  );
}

export default Formulaire;
