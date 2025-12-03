import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import MenuEnHaut from "@components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "@components/components-partages/MenuEnBas/MenuEnBas";
import Bouton from "@components/components-partages/Boutons/Bouton";
import Message from "@components/components-partages/Message/Message";
import CarteListeAchat from "@components/carte-liste-achat/CarteListeAchat";
import {
  recupererListeAchatComplete,
  supprimerBouteilleListe 
} from "@lib/requetes.js";
import { useDocumentTitle } from "@lib/utils.js";
import authentificationStore from "@store/authentificationStore";

function ListeAchat() {
  const navigate = useNavigate();
  const utilisateur = authentificationStore((state) => state.utilisateur);

  useDocumentTitle("Liste d'achat");

  const [bouteillesCellier, setBouteillesCellier] = useState([]);
  const [chargementBouteilles, setChargementBouteilles] = useState(false);
  const [messageAction, setMessageAction] = useState({ texte: "", type: "" });
  const [bouteillesEnTraitement, setBouteillesEnTraitement] = useState(
    () => new Set()
  );

  // Charger la liste d'achat
  useEffect(() => {
    const chargerListeAchat = async () => {
      if (!utilisateur?.id) return;
      setChargementBouteilles(true);
      const datas = await recupererListeAchatComplete(utilisateur.id);
      setBouteillesCellier(datas || []);
      setChargementBouteilles(false);
    };
    chargerListeAchat();
  }, [utilisateur?.id]);

   // Gestion du traitement
  const definirTraitement = (idBouteille, actif) => {

    setBouteillesEnTraitement((courant) => {

      //On crée une copie de l'état actuel (Set) pour ne pas modifier directement l'état
      const prochain = new Set(courant);

      //Si actif = true, on ajoute l'id de la bouteille dans le Set
      if (actif) {
        prochain.add(idBouteille);
      } else {
        //Si actif = false, on retire l'id de la bouteille du Set
        prochain.delete(idBouteille);
      }

      //On retourne le nouveau Set qui devient le nouvel état
      return prochain;
    });
  };

  // Supprimer une bouteille de la liste
  const gererSupprimer = async (idBouteille) => {
    if (bouteillesEnTraitement.has(idBouteille)) return;
    
    // Marquer cette bouteille comme en cours de traitement
    definirTraitement(idBouteille, true);

    const resultat = await supprimerBouteilleListe(utilisateur.id, idBouteille);
    //Retirer la bouteille de la liste des bouteilles en traitement
    definirTraitement(idBouteille, false);

    if (!resultat?.succes) {
      setMessageAction({
        texte: resultat?.erreur || "Impossible de supprimer la bouteille.",
        type: "erreur",
      });
      return;
    }

    setMessageAction({ texte: "Bouteille retirée de la liste", type: "succes" });
    
    // Mettre à jour l'état pour retirer la bouteille de l'affichage
    setBouteillesCellier((precedent) =>
      precedent.filter((b) => b.id !== idBouteille)
    );
  };


  // Gestion utilisateur non connecté
  if (!utilisateur?.id) {
    return (
      <div className="h-screen font-body grid grid-rows-[auto_1fr_auto] overflow-hidden">
        <header>
          <MenuEnHaut />
        </header>

        <main className="bg-fond overflow-y-auto">
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-(--rythme-base) p-(--rythme-base)">
            <Message
              type="information"
              texte="Veuillez vous connecter pour accéder à votre liste d'achat."
            />
            <Bouton
              taille = ""
              texte="Se connecter"
              type="primaire"
              typeHtml="button"
              action={() => navigate("/")}
            />
          </div>
        </main>

        <MenuEnBas />
      </div>
    );
  }

  // Structure principale et affichage des bouteilles
  return (
    <div className="h-screen font-body grid grid-rows-[auto_1fr_auto] overflow-hidden">
      <header>
        <MenuEnHaut />
      </header>

      <main className="bg-fond overflow-y-auto">
        <header className="pt-(--rythme-espace) pb-(--rythme-base) px-(--rythme-serre)">
          <h1 className="text-(length:--taille-grand) text-center font-display font-semibold text-principal-300">
            Votre Liste d'achat
          </h1>
        </header>

        <article className="mt-(--rythme-base) p-(--rythme-serre) min-h-[200px]">
          {/* Affichage des messages d'action */}
          {messageAction.texte && (
            <div className="mb-(--rythme-base)">
              <Message type={messageAction.type} texte={messageAction.texte} />
            </div>
          )}

          {chargementBouteilles ? (
            <Message
              type="information"
              texte="Chargement des bouteilles de la liste..."
            />
          ) : bouteillesCellier.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {/* Affichage des bouteilles */}
              {bouteillesCellier.map((bouteille) => (
                <Link key={bouteille.id} to={`/bouteilles/${bouteille.id}`}>
                  <CarteListeAchat
                    key={bouteille.id}
                    bouteille={bouteille}
                    onSupprimer={gererSupprimer}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-(--rythme-base)">
              <div className="mb-(--rythme-base) w-full">
                <Message
                  type="information"
                  texte="Vous n'avez pas encore de bouteilles dans la liste."
                />
              </div>

              <Bouton
                taille="moyen"
                texte="Ajouter une bouteille"
                type="primaire"
                typeHtml="button"
                action={() => {
                  navigate("/catalogue");
                }}
              />
            </div>
          )}
        </article>
      </main>

      <MenuEnBas />
    </div>
  );
}

export default ListeAchat;