/**
 * @source backend/src/utils
 * Ce gabarit rappelle comment structurer un module utilitaire partage.
 * Les utilitaires devraient rester purs, testes et independants des couches
 * Express pour encourager la reutilisation.
 *
 * Mode d'emploi:
 * - Enumerez chaque fonction prevue avec sa signature attendue.
 * - Decrivez les hypotheses d'entree et les effets de bord.
 * - Lister les validations minimales a effectuer.
 */
export const utilitairesPrevus = [
  {
    nom: 'calculerPrixMoyen',
    signature: '(listeProduits: Produit[]) => nombre',
    hypotheses: [
      'listeProduits contient au moins un element',
      'chaque produit expose une cle prix en nombre',
    ],
    validations: ['rejeter les valeurs NaN', 'arrondir a deux decimales'],
  },
];
