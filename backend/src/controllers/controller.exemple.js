/**
 * @source backend/src/controllers
 * Ce gabarit illustre la documentation attendue pour un controleur Express.
 * Utiliser ce fichier comme memo sur les responsabilites, les routes exposees
 * et les validations attendues avant d'ecrire la moindre logique metier.
 *
 * Structure recommande:
 * - meta: informations descriptives sur le controleur.
 * - schemaActions: definitions textuelles de chaque action REST.
 */
export const controleurExemple = {
  meta: {
    nom: 'ControleurCatalogue',
    dependances: ['serviceCatalogue', 'journalisation'],
    description: 'Expose les operations CRUD du catalogue SAQ.',
  },
  schemaActions: [
    {
      nomAction: 'listerProduits',
      verbeHttp: 'GET',
      chemin: '/produits',
      protections: ['authentificationOptionnelle'],
      etapesMetier: [
        'validerFiltres',
        'deleguerAuService',
        'formatterReponse',
      ],
    },
  ],
};
