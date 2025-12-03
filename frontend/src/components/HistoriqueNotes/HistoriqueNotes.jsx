import { useState, useEffect } from "react";
import Bouton from "@components/components-partages/Boutons/Bouton";
import Message from "@components/components-partages/Message/Message";
import Spinner from "@components/components-partages/Spinner/Spinner";
import MoyenneNotes from "@components/components-partages/MoyenneNotes/MoyenneNotes";
import CarteNoteDegustation from "@components/HistoriqueNotes/CarteNoteDegustation/CarteNoteDegustation";
import {
  recupererNotes,
  modifierNote,
  supprimerNote,
  traiterNotes,
} from "@lib/requetes";
import authentificationStore from "@store/authentificationStore";

function HistoriqueNotes({ id_bouteille }) {
  const utilisateur = authentificationStore((state) => state.utilisateur);
  const [notes, setNotes] = useState([]);
  //Si l'utilisateur a deja mis une note
  const [noteUtilisateur, setNoteUtilisateur] = useState(null);
  //On est en cours de chargement des notes false ou true
  const [chargement, setChargement] = useState(true);
  // On affiche seulement 5 notes au chargement de la page.
  const [nombreNotesAffichees, setNombreNotesAffichees] = useState(5);

  // On recupere les notes et on gere l'afichage durant le chargement.
  useEffect(() => {
    const chargerNotes = async () => {
      setChargement(true);
      const notesRecuperees = await recupererNotes(id_bouteille);
      const idUtilisateurActuel = utilisateur?.id;
      const { noteUtilisateur, autresNotes } = traiterNotes(
        notesRecuperees,
        idUtilisateurActuel
      );
      setNoteUtilisateur(noteUtilisateur);
      setNotes(autresNotes);
      setChargement(false);
    };
    chargerNotes();
  }, [id_bouteille, utilisateur?.id]);

  // Fonction pour recharger les notes
  const rechargerNotes = async () => {
    setChargement(true);
    const notesRecuperees = await recupererNotes(id_bouteille);
    const idUtilisateurActuel = utilisateur?.id;
    const { noteUtilisateur, autresNotes } = traiterNotes(
      notesRecuperees,
      idUtilisateurActuel
    );
    setNoteUtilisateur(noteUtilisateur);
    setNotes(autresNotes);
    setChargement(false);
  };

  // Fonction pour recharger les notes après modification
  // L'API est gérée directement dans BoiteModaleNotes
  const gererModifierNote = async () => {
    await rechargerNotes();
  };

  // Fonction pour supprimer une note
  const gererSupprimerNote = async (note) => {
    const resultat = await supprimerNote({
      id_utilisateur: note.id_utilisateur,
      id_bouteille: note.id_bouteille,
    });
    if (resultat.succes) {
      // Recharger les notes après suppression
      await rechargerNotes();
    } else {
      console.error("Erreur lors de la suppression:", resultat.erreur);
    }
  };

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
      <h2 className="mb-2 text-(length:--taille-normal) font-semibold text-texte-premier">
        Historique Notes
      </h2>
      {!chargement && (
        <div className="flex items-center gap-(--rythme-serre) mb-(--rythme-base)">
          <div className="text-(length:--taille-petit)">
            <MoyenneNotes id_bouteille={id_bouteille} />
          </div>
          <p className="text-(length:--taille-petit) italic text-texte-secondaire">
            ({notes.length} {notes.length === 1 ? "note" : "notes"})
          </p>
        </div>
      )}
      {chargement ? (
        <Spinner />
      ) : noteUtilisateur || notes.length > 0 ? (
        <>
          {/* Note de l'utilisateur actuel en premier avec fond pâle */}
          {noteUtilisateur && (
            <div className="mb-(--rythme-base) bg-principal-50 rounded-(--arrondi-grand) p-(--rythme-base)">
              <CarteNoteDegustation
                note={noteUtilisateur}
                estNoteUtilisateur={true}
                onModifier={gererModifierNote}
                onSupprimer={gererSupprimerNote}
              />
            </div>
          )}
          {/* Autres notes */}
          {notesAffichees.map((note, index) => (
            <CarteNoteDegustation
              key={index}
              note={note}
              estNoteUtilisateur={false}
            />
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
