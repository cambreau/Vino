import { useState, useEffect } from "react";
import MenuEnHaut from "../components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "../components/components-partages/MenuEnBas/MenuEnBas";
import CarteBouteille from "../components/carte/CarteBouteille";
import Message from "../components/components-partages/Message/Message";

import BoiteModale from "../components/components-partages/BoiteModale/BoiteModale";
import Bouton from "../components/components-partages/Boutons/Bouton";
import BoutonQuantite from "../components/components-partages/Boutons/BoutonQuantite";

import { recupererBouteilles, ajouterBouteilleCellier, recupererTousCellier } from "../lib/requetes";
import authentificationStore from "../stores/authentificationStore";

function Catalogue() {
  // États pour gérer les bouteilles du catalogue
  const [bouteilles, setBouteilles] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [message, setMessage] = useState({ texte: "", type: "" });
  
  // États pour gérer la modale d'ajout
  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [bouteilleSelectionnee, setBouteilleSelectionnee] = useState(null);
  const [quantite, setQuantite] = useState(1);
  
  // États pour gérer les celliers de l'utilisateur
  const [celliers, setCelliers] = useState([]);
  const [cellierSelectionne, setCellierSelectionne] = useState("");

  // Récupérer l'utilisateur connecté depuis le store
  const utilisateur = authentificationStore((state) => state.utilisateur);

  // EFFET 1: Charger les celliers quand l'utilisateur est connecté
  useEffect(() => {
    const chargerCelliers = async () => {
      // Vérifier si un utilisateur est connecté
      if (utilisateur?.id) {
        try {
          // Appeler l'API pour récupérer les celliers
          const data = await recupererTousCellier(utilisateur.id);
          
          // Les données peuvent être dans data.donnees OU directement dans data
          const celliersData = data?.donnees || data;
          
          // Vérifier si on a reçu des celliers
          if (celliersData && Array.isArray(celliersData) && celliersData.length > 0) {
            // Sauvegarder les celliers dans l'état
            setCelliers(celliersData);
            
            // Sélectionner automatiquement le premier cellier
            const premierId = celliersData[0].id_cellier;
            setCellierSelectionne(String(premierId));
          } else {
            // Si aucun cellier n'existe, afficher un message
            setMessage({
              texte: "Vous devez d'abord créer un cellier",
              type: "information"
            });
          }
        } catch (erreur) {
          console.error("Erreur lors de la récupération des celliers:", erreur);
        }
      }
    };
    chargerCelliers();
  }, [utilisateur]);

  // EFFET 2: Charger toutes les bouteilles du catalogue au chargement de la page
  useEffect(() => {
    const chargerBouteilles = async () => {
      try {
        // Appeler l'API pour récupérer les bouteilles
        const data = await recupererBouteilles();
        
        // Vérifier si on a reçu des données
        if (!data || !data.donnees) {
          setMessage({
            texte: "Impossible de charger le catalogue",
            type: "erreur",
          });
          setChargement(false);
          return;
        }
        
        // Sauvegarder les bouteilles dans l'état
        setBouteilles(data.donnees);
        setChargement(false);
      } catch (erreur) {
        console.error("Erreur:", erreur);
        setMessage({
          texte: "Impossible de charger le catalogue",
          type: "erreur",
        });
        setChargement(false);
      }
    };
    chargerBouteilles();
  }, []);

  // FONCTION: Ouvrir la modale quand on clique sur "Ajouter au cellier"
  const ouvrirModale = (bouteille) => {
    setBouteilleSelectionnee(bouteille);
    setQuantite(1);
    setModaleOuverte(true);
  };

  // FONCTION: Fermer la modale et réinitialiser les valeurs
  const fermerModale = () => {
    setModaleOuverte(false);
    setBouteilleSelectionnee(null);
    setQuantite(1);
  };

  // FONCTION: Augmenter la quantité de +1
  const augmenterQuantite = () => {
    setQuantite(prev => prev + 1);
  };

  // FONCTION: Diminuer la quantité de -1 (minimum 1)
  const diminuerQuantite = () => {
    if (quantite > 1) {
      setQuantite(prev => prev - 1);
    }
  };

  // FONCTION: Confirmer l'ajout de la bouteille au cellier
  const confirmerAjout = async () => {
    // Vérifier qu'un cellier est bien sélectionné
    if (!cellierSelectionne) {
      setMessage({
        texte: "Veuillez sélectionner un cellier",
        type: "erreur"
      });
      return;
    }

    try {
      // Préparer les données à envoyer au backend
      const donnees = {
        id_bouteille: bouteilleSelectionnee.id,
        quantite: quantite
      };

      // Envoyer la requête pour ajouter la bouteille au cellier
      const resultat = await ajouterBouteilleCellier(cellierSelectionne, donnees);

      // Vérifier si l'ajout a réussi
      if (resultat.succes) {
        // Trouver le nom du cellier sélectionné pour l'afficher dans le message
        const cellierObj = celliers.find(c => String(c.id_cellier) === String(cellierSelectionne));
        const cellierNom = cellierObj ? cellierObj.nom : "";

        // Afficher le message de succès
        setMessage({
          texte: `${bouteilleSelectionnee.nom} a été ajouté au cellier ${cellierNom}`,
          type: "succes"
        });

        // Fermer la modale
        fermerModale();

        // Effacer le message après 5 secondes
        setTimeout(() => {
          setMessage({ texte: "", type: "" });
        }, 5000);

      } else {
        // Si l'ajout a échoué, afficher l'erreur
        setMessage({
          texte: resultat.erreur || "Erreur lors de l'ajout",
          type: "erreur"
        });
      }

    } catch (erreur) {
      console.error("Erreur:", erreur);
      setMessage({
        texte: "Erreur lors de l'ajout au cellier",
        type: "erreur"
      });
    }
  };

  // Si l'utilisateur n'est pas connecté, afficher un message d'erreur
  if (!utilisateur || !utilisateur.id) {
    return (
      <div className="h-screen font-body grid grid-rows-[auto_1fr_auto] overflow-hidden">
        <header>
          <MenuEnHaut />
        </header>
        <main className="font-body bg-fond overflow-y-auto">
          <section className="pt-(--rythme-espace) pb-(--rythme-base) px-(--rythme-serre)">
            <Message 
              texte="Vous devez être connecté pour accéder au catalogue"
              type="erreur"
            />
          </section>
        </main>
        <MenuEnBas />
      </div>
    );
  }

  // Affichage principal de la page catalogue
  return (
    <>
      <div className="h-screen font-body grid grid-rows-[auto_1fr_auto] overflow-hidden">
        <header>
          <MenuEnHaut />
        </header>
        
        <main className="font-body bg-fond overflow-y-auto">
          <section className="pt-(--rythme-espace) pb-(--rythme-base) px-(--rythme-serre)">
            
            {/* Afficher les messages (succès ou erreur) */}
            {message.texte && (
              <div className="mb-4">
                <Message texte={message.texte} type={message.type} />
              </div>
            )}
            
            {/* Afficher le chargement ou les bouteilles */}
            {chargement ? (
              <Message texte="Chargement du catalogue..." type="information" />
            ) : (
              <>
                {bouteilles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {bouteilles.map((bouteille) => (
                      <CarteBouteille
                        key={bouteille.id}
                        bouteille={bouteille}
                        type="catalogue"
                        onAjouter={ouvrirModale}
                      />
                    ))}
                  </div>
                ) : (
                  <Message
                    texte="Aucune bouteille disponible dans le catalogue"
                    type="information"
                  />
                )}
              </>
            )}
          </section>
        </main>
        
        <MenuEnBas />
      </div>

      {/* MODALE: Apparaît quand on clique sur "Ajouter au cellier" */}
      {modaleOuverte && bouteilleSelectionnee && (
        <BoiteModale
          texte="Confirmation d'ajout"
          contenu={
            <div className="w-full">
              
              {/* Afficher le nom de la bouteille */}
              <p className="text-texte-principal font-bold text-center mb-(--rythme-base)">
                {bouteilleSelectionnee.nom}
              </p>

              {/* Menu déroulant pour choisir le cellier */}
              <div className="mb-(--rythme-base)">
                <label className="block text-texte-secondaire mb-(--rythme-tres-serre)">
                  Cellier :
                </label>
                <select
                  value={cellierSelectionne}
                  onChange={(e) => setCellierSelectionne(e.target.value)}
                  className="w-full px-(--rythme-serre) py-(--rythme-tres-serre) 
                           bg-fond border border-principal-200 
                           rounded-(--arrondi-moyen) text-texte-principal
                           focus:outline-none focus:border-principal-300"
                >
                  {celliers.map((cellier) => (
                    <option key={cellier.id_cellier} value={cellier.id_cellier}>
                      {cellier.nom}
                    </option>
                  ))}
                </select>
              </div>

              {/* Boutons + et - pour choisir la quantité */}
              <div className="flex items-center justify-center gap-(--rythme-serre)">
                <span className="text-texte-secondaire">Quantité :</span>
                
                <div className="flex items-center gap-2">
                  {/* Bouton - */}
                  <BoutonQuantite 
                    type="diminuer"
                    onClick={diminuerQuantite}
                    disabled={quantite <= 1}
                  />
                  
                  {/* Afficher la quantité */}
                  <span className="flex items-center justify-center min-w-8 px-2 
                                 text-texte-principal font-bold text-(length:--taille-normal)">
                    {quantite}
                  </span>
                  
                  {/* Bouton + */}
                  <BoutonQuantite 
                    type="augmenter"
                    onClick={augmenterQuantite}
                  />
                </div>
              </div>
            </div>
          }
          bouton={
            <>
              {/* Bouton pour confirmer l'ajout */}
              <Bouton
                texte="Ajouter"
                type="primaire"
                typeHtml="button"
                action={confirmerAjout}
              />
              {/* Bouton pour annuler */}
              <Bouton
                texte="Annuler"
                type="secondaire"
                typeHtml="button"
                action={fermerModale}
              />
            </>
          }
        />
      )}
    </>
  );
}

export default Catalogue;