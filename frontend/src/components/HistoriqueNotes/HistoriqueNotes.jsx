import { useState, useEffect } from "react";
import Bouton from "@components/components-partages/Boutons/Bouton";
import Message from "@components/components-partages/Message/Message";
import Spinner from "@components/components-partages/Spinner/Spinner";
import CarteNoteDegustation from "@components/HistoriqueNotes/CarteNoteDegustation/CarteNoteDegustation";
import { recupererNotes } from "@lib/requetes";

function HistoriqueNotes({ id_bouteille }) {
  const [notes, setNotes] = useState([]);
  const [chargement, setChargement] = useState(true);
  // On affiche seulement 5 notes au chargement de la page.
  const [nombreNotesAffichees, setNombreNotesAffichees] = useState(5);

  // On recupere les notes et on gere l'afichage durant le chargement.
  useEffect(() => {
    const chargerNotes = async () => {
      setChargement(true);
      const notesRecuperees = await recupererNotes(id_bouteille);
      if (notesRecuperees) {
        // Trier les notes par date (les plus récentes en premier)
        const notesTriees = Array.isArray(notesRecuperees)
          ? [...notesRecuperees].sort((a, b) => {
              const dateA = new Date(
                a.date_creation || a.date || a.created_at || 0
              );
              const dateB = new Date(
                b.date_creation || b.date || b.created_at || 0
              );
              return dateB - dateA; // Ordre décroissant (plus récent en premier)
            })
          : [];
        setNotes(notesTriees);
      } else {
        setNotes([]);
      }
      setChargement(false);
    };
    chargerNotes();
  }, [id_bouteille]);

  // Fonction pour afficher plus de notes
  const afficherPlus = () => {
    setNombreNotesAffichees((prev) => prev + 5);
  };

  // Limite l'affichage aux N premières notes selon nombreNotesAffichees
  // Si nombreNotesAffichees = 5, on obtient les 5 premieres notes.
  // Si nombreNotesAffichees = 10, on obtient les 10 premieres notes.
  const notesAffichees = notes.slice(0, nombreNotesAffichees);
  //
  // Vérifie si toutes les notes sont affichées.
  // Retourne true si le nombre de notes affichées est supérieur ou égal
  // notes.length = 12, nombreNotesAffichees = 5 = false (il reste des notes)
  // notes.length = 12, nombreNotesAffichees = 15 = true (toutes affichées)
  const toutesNotesAffichees = nombreNotesAffichees >= notes.length;

  return (
    <section className="border border-principal-100 rounded-(--arrondi-grand) shadow-md p-(--rythme-base)">
      <h2 className="text-(length:--taille-normal) font-semibold text-principal-300 mb-(--rythme-base)">
        Historique Notes
      </h2>
      {!chargement && (
        <p className="text-(length:--taille-petit) italic text-texte-secondaire mb-(--rythme-base)">
          ({notes.length} {notes.length === 1 ? "note" : "notes"})
        </p>
      )}
      {chargement ? (
        <Spinner />
      ) : notes.length > 0 ? (
        <>
          {notesAffichees.map((note, index) => (
            <CarteNoteDegustation key={index} note={note} />
          ))}
          {!toutesNotesAffichees && (
            // Max 5 de plus a chaque clics
            <Bouton
              texte="Voir plus"
              type="secondaire"
              action={afficherPlus}
              typeHtml="button"
            />
          )}
        </>
      ) : (
        <Message type="information" texte="Aucune note disponible" />
      )}
    </section>
  );
}

export default HistoriqueNotes;
