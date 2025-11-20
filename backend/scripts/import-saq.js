#!/usr/bin/env node
import ModeleBouteille from '../src/models/modele.bouteille.js';

(async () => {
  try {
    const arg = process.argv[2];
    const limite = arg ? Number.parseInt(arg, 10) : undefined;
    console.log(`Lancement de l'import SAQ (limite = ${limite ?? 'aucune'}) ...`);
    const resultat = await ModeleBouteille.importerDepuisEnregistrementsSaq({ limite });
    console.log('Import terminé :', JSON.stringify(resultat, null, 2));
    process.exit(0);
  } catch (err) {
    console.error("Erreur lors de l'import:", err?.message || err);
    process.exit(1);
  }
})();
