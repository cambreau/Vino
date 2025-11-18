export const regex = {
  regNom: /^[A-Za-zÀ-ÖØ-öø-ÿ-]{2,50}$/,
  regcourriel: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  //- au moins 8 caractères, au moins une lettre minuscule, au moins une lettre majuscule, au moins un caractère spécial (ex. !@#$%^&*())
  regMotDePasse: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/,
};

export const validationChamp = (regEx, valeur) => {
  return regEx.test(valeur);
};
