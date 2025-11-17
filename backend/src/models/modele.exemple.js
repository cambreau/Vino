/**
 * @source backend/src/models
 * Ce gabarit explique comment decrire un modele de domaine pour Vino.
 * Utiliser-le pour preciser la structure, les contraintes et les regles de
 * transformation associees sans ecrire de logique executable.
 *
 * Conseils:
 * - Preferez des noms explicites pour chaque attribut.
 * - Ajouter les invariants metier attendus.
 * - Lister les conversions necessaires en entree et sortie.
 */
export const modeleProduitExemple = {
  identifiant: {
    type: 'uuid',
    obligatoire: true,
    description: 'Identifiant unique du produit SAQ.',
  },
  nom: {
    type: 'string',
    obligatoire: true,
    description: 'Nom commercial tel que fourni par la SAQ.',
  },
  prix: {
    type: 'number',
    obligatoire: true,
    unite: 'CAD',
    contraintes: ['>= 0'],
  },
  formatsDisponibles: {
    type: 'array<string>',
    obligatoire: false,
    description: 'Liste des contenances disponibles en inventaire.',
  },
  reglesMetier: [
    'le prix doit etre synchronise avec la derniere extraction SAQ',
    'formatsDisponibles doit rester trie par volume croissant',
  ],
};
