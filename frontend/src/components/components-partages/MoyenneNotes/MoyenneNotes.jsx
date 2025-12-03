import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { recupererNotes } from "@lib/requetes";

/**
 * Composant qui affiche la moyenne des notes de dEgustation d'une bouteille
 * sous forme de lien vers la page details de la bouteille.
 * @param {string|number} id_bouteille - L'identifiant unique de la bouteille
 */
function MoyenneNotes({ id_bouteille }) {
  const [moyenne, setMoyenne] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const calculerMoyenne = async () => {
      setChargement(true);
      const notes = await recupererNotes(id_bouteille);

      // Si notes existe, notes est un tableau (Array.isArray) et notes contient au moins une note (length > 0)
      if (notes && Array.isArray(notes) && notes.length > 0) {
        // Calculer la moyenne des notes
        // reduce() parcourt chaque élément du tableau et accumule une valeur.
        // Ref: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
        const sommeNotes = notes.reduce((acc, note) => {
          const noteValue = note.note || note.note_degustation || 0;
          return acc + noteValue;
        }, 0);
        //Moyenne
        const moyenneCalculee = sommeNotes / notes.length;
        setMoyenne(moyenneCalculee.toFixed(1)); // Arrondir à 1 décimale
      } else {
        setMoyenne(null);
      }
      setChargement(false);
    };
    calculerMoyenne();
  }, [id_bouteille]);

  // Ne rien afficher si en chargement ou si pas de moyenne
  if (chargement || moyenne === null) {
    ("Aucune note");
  }

  return (
    <Link
      to={`/bouteilles/${id_bouteille}`}
      className="text-principal-300 hover:text-principal-200 transition-colors"
    >
      {moyenne}
    </Link>
  );
}

export default MoyenneNotes;
