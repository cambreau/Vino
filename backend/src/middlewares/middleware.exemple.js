/**
 * @source backend/src/middlewares
 * Ce gabarit documente la forme attendue d'un middleware Express.
 * Il sert a enumerer les objectifs, les dependances et les cas limites a couvrir
 * avant de coder la fonction (req, res, next).
 *
 * Bonnes pratiques:
 * - Garder le middleware pur et testable.
 * - Propager les erreurs via next(err).
 * - Logger uniquement les informations pertinentes.
 */
export const middlewareExemple = {
  nom: 'journalisationRequete',
  objectifs: [
    'Consigner les entetes critiques',
    'Uniformiser les identifiants de correlation',
  ],
  dependances: ['serviceJournalisation', 'outilTraque'],
  pseudoCode: [
    'verifier presence identifiant-correlation',
    'generer identifiant au besoin',
    'consigner methode + url + delai',
  ],
  risquesConnus: ['exposition de donnees sensibles si masquage oublie'],
};
