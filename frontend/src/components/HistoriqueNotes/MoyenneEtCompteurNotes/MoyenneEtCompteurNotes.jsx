import { useState, useEffect } from "react";
import Spinner from "@components/components-partages/Spinner/Spinner";
import { recupererNotes } from "@lib/requetes";

/**
 * Composant qui affiche la moyenne et le nombre total de notes d'une bouteille.
 * @param {string|number} id_bouteille - L'identifiant unique de la bouteille
 * @param {string|null} moyenneNotes - La moyenne des notes (si fournie, évite l'appel API)
 * @param {number} nombreNotes - Le nombre de notes (si fourni, évite l'appel API)
 * @param {number} reactualiser - Compteur pour forcer le rechargement
 */
function MoyenneEtCompteurNotes({
  id_bouteille,
  moyenneNotes: moyenneInitiale = null,
  nombreNotes: nombreInitial = null,
  reactualiser = 0,
}) {
  // Si les données sont fournies en props, pas besoin de fetch
  const donneesEnProps = moyenneInitiale !== null || nombreInitial !== null;

  const [moyenne, setMoyenne] = useState(moyenneInitiale);
  const [nombreNotes, setNombreNotes] = useState(nombreInitial || 0);
  const [chargement, setChargement] = useState(!donneesEnProps);

  useEffect(() => {
    // Si les données sont fournies en props, les utiliser directement
    if (donneesEnProps && reactualiser === 0) {
      setMoyenne(moyenneInitiale);
      setNombreNotes(nombreInitial || 0);
      setChargement(false);
      return;
    }

    // Sinon, faire un appel API (pour les pages détail ou après mise à jour)
    const calculerMoyenneEtCompteur = async () => {
      setChargement(true);
      try {
        const notesRecuperees = await recupererNotes(id_bouteille);

        // Extraire data si la réponse du backend est un objet avec une propriété data (les notes)
        const notesData = notesRecuperees?.data || notesRecuperees;

        // S'assurer que notesData est un tableau sinon on utilise un tableau vide
        const notesArray = Array.isArray(notesData) ? notesData : [];

        // Si notesArray contient au moins une note
        if (notesArray.length > 0) {
          // Calculer la moyenne des notes
          // reduce() parcourt chaque élément du tableau et accumule une valeur.
          // Ref: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
          const sommeNotes = notesArray.reduce((acc, note) => {
            const noteValue =
              note.notes || note.note || note.note_degustation || 0;
            return acc + noteValue;
          }, 0);
          // Moyenne
          const moyenneCalculee = sommeNotes / notesArray.length;
          setMoyenne(moyenneCalculee.toFixed(1)); // Arrondir à 1 décimale
          setNombreNotes(notesArray.length);
        } else {
          setMoyenne(null);
          setNombreNotes(0);
        }
      } catch (error) {
        console.error("Erreur lors du calcul de la moyenne:", error);
        setMoyenne(null);
        setNombreNotes(0);
      } finally {
        setChargement(false);
      }
    };

    calculerMoyenneEtCompteur();
  }, [
    id_bouteille,
    reactualiser,
    donneesEnProps,
    moyenneInitiale,
    nombreInitial,
  ]);

  // Afficher un spinner pendant le chargement (taille petit)
  if (chargement) {
    return (
      <div className="flex items-center gap-(--rythme-serre)">
        <Spinner size={20} />
      </div>
    );
  }

  // Afficher "Aucune note" si pas de moyenne
  if (moyenne === null) {
    return (
      <div className="flex items-center gap-(--rythme-serre)">
        <p className="inline-block bg-principal-100 text-texte-principal px-(--rythme-serre) py-(--rythme-tres-serre) rounded-(--arrondi-grand) font-semibold text-(length:--taille-petit)">
          Aucune note
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-(--rythme-serre)">
      <p className="inline-block bg-principal-100 text-texte-principal px-(--rythme-serre) py-(--rythme-tres-serre) rounded-(--arrondi-grand) font-semibold text-(length:--taille-petit)">
        {moyenne}
      </p>
      <p className="text-(length:--taille-petit) italic text-texte-secondaire">
        ({nombreNotes} {nombreNotes === 1 ? "note" : "notes"})
      </p>
    </div>
  );
}

export default MoyenneEtCompteurNotes;
