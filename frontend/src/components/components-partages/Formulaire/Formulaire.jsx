function Formulaire({
  titreFormulaire,
  method,
  action = null,
  enfants,
  bouton,
}) {
  return (
    <section className="px-(--rythme-base)">
      <h2 className="text-(length:--taille-grand) text-(--color-fond) font-display font-bold mb-(--rythme-base)">
        {titreFormulaire}
      </h2>
      <form method={method} action={action} className="flex flex-col gap-6">
        {enfants}
        {bouton}
      </form>
    </section>
  );
}

export default Formulaire;
