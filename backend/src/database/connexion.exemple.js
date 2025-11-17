/**
 * @source backend/src/database
 * Ce gabarit deconnexion aide a documenter l'acces aux donnees sans implementer
 * la couche de persistence. Utiliser-le pour decrire les attentes envers le
 * client de base de donnees choisi (SQL, NoSQL, cache, etc.).
 *
 * Instructions rapides:
 * 1. Decrire chaque champ requis pour etablir une connexion securisee.
 * 2. Referencer les requetes critiques et leurs indices de performance.
 * 3. Rappeler les contraintes de reprise apres incident.
 */
export const connexionExemple = {
  moteur: 'postgresql',
  hote: 'localhost',
  port: 5432,
  nomBase: 'vino',
  utilisateur: 'service_vino',
  strategieSecrets: 'variable_environnement',
};

export const requetesCritiques = [
  {
    nom: 'recupererProduitsDisponibles',
    pseudoSql:
      'SELECT * FROM produits WHERE disponibilite = TRUE ORDER BY popularite DESC;',
    indexSuggere: ['produits(disponibilite, popularite)'],
  },
];
