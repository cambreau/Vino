function Formulaire({
  titreFormulaire,
  method,
  action = null,
  enfants,
  bouton,
}) {
  return (
    <section>
      <h2>{titreFormulaire}</h2>
      <form method={method} action={action}>
        {enfants}
        {bouton}
      </form>
    </section>
  );
}

export default Formulaire;
