import { useState, useEffect, useCallback } from "react";
import MenuEnHaut from "../components/components-partages/MenuEnHaut/MenuEnHaut";
import MenuEnBas from "../components/components-partages/MenuEnBas/MenuEnBas";
import CarteBouteille from "../components/carte/CarteBouteille";
import Message from "../components/components-partages/Message/Message";
import BoiteModale from "../components/components-partages/BoiteModale/BoiteModale";

import Bouton from "../components/components-partages/Boutons/Bouton";
import BoutonQuantite from "../components/components-partages/Boutons/BoutonQuantite";
import FormulaireSelect from "../components/components-partages/Formulaire/FormulaireSelect/FormulaireSelect";

import { recupererBouteilles, ajouterBouteilleCellier, recupererTousCellier } from "../lib/requetes";
import authentificationStore from "../stores/authentificationStore";

function Catalogue() {
  const utilisateur = authentificationStore((state) => state.utilisateur);
  
  // Regrouper les états liés au catalogue
  const [catalogue, setCatalogue] = useState({
    bouteilles: [],
    chargement: true,
    celliers: [],
    cellierSelectionne: ""
  });
  
  // Regrouper les états liés à la modale
  const [modale, setModale] = useState({
    ouverte: false,
    bouteille: null,
    quantite: 1
  });
  
  // État pour les messages
  const [message, setMessage] = useState({ texte: "", type: "" });

  // EFFET UNIQUE: Charger toutes les données nécessaires
  useEffect(() => {
    const chargerDonnees = async () => {
      if (!utilisateur?.id) return;

      try {
        // Charger les bouteilles et celliers en parallèle
        const [dataBouteilles, dataCelliers] = await Promise.all([
          recupererBouteilles(),
          recupererTousCellier(utilisateur.id)
        ]);

        // Traiter les bouteilles
        const bouteillesData = dataBouteilles?.donnees || [];
        if (!dataBouteilles || !dataBouteilles.donnees) {
          setMessage({
            texte: "Impossible de charger le catalogue",
            type: "erreur"
          });
        }

        // Traiter les celliers
        const celliersData = dataCelliers?.donnees || dataCelliers;
        let cellierParDefaut = "";
        let messageInfo = { texte: "", type: "" };

        if (celliersData && Array.isArray(celliersData) && celliersData.length > 0) {
          cellierParDefaut = String(celliersData[0].id_cellier);
        } else {
          messageInfo = {
            texte: "Vous devez d'abord créer un cellier",
            type: "information"
          };
        }

        // Mettre à jour tous les états en une seule fois
        setCatalogue({
          bouteilles: bouteillesData,
          chargement: false,
          celliers: celliersData || [],
          cellierSelectionne: cellierParDefaut
        });

        if (messageInfo.texte) {
          setMessage(messageInfo);
        }

      } catch (erreur) {
        console.error("Erreur lors du chargement:", erreur);
        setCatalogue(prev => ({
          ...prev,
          chargement: false
        }));
        setMessage({
          texte: "Erreur lors du chargement des données",
          type: "erreur"
        });
      }
    };

    chargerDonnees();
  }, [utilisateur?.id]);

  // Ouvrir la modale
  const ouvrirModale = useCallback((bouteille) => {
    setModale({
      ouverte: true,
      bouteille,
      quantite: 1
    });
  }, []);

  // Fermer la modale
  const fermerModale = useCallback(() => {
    setModale({
      ouverte: false,
      bouteille: null,
      quantite: 1
    });
  }, []);

  // Modifier la quantité
  const modifierQuantite = useCallback((action) => {
    setModale(prev => ({
      ...prev,
      quantite: action === "augmenter" 
        ? prev.quantite + 1 
        : Math.max(1, prev.quantite - 1)
    }));
  }, []);

  // Changer le cellier sélectionné
  const changerCellier = useCallback((valeur) => {
    setCatalogue(prev => ({
      ...prev,
      cellierSelectionne: valeur
    }));
  }, []);

  // Confirmer l'ajout
  const confirmerAjout = useCallback(async () => {
    if (!catalogue.cellierSelectionne) {
      setMessage({
        texte: "Veuillez sélectionner un cellier",
        type: "erreur"
      });
      return;
    }

    try {
      const donnees = {
        id_bouteille: modale.bouteille.id,
        quantite: modale.quantite
      };

      const resultat = await ajouterBouteilleCellier(catalogue.cellierSelectionne, donnees);

      if (resultat.succes) {
        const cellierObj = catalogue.celliers.find(
          c => String(c.id_cellier) === String(catalogue.cellierSelectionne)
        );
        const cellierNom = cellierObj ? cellierObj.nom : "";

        setMessage({
          texte: `${modale.bouteille.nom} a été ajouté au cellier ${cellierNom}`,
          type: "succes"
        });
        fermerModale();
      } else {
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
  }, [catalogue.cellierSelectionne, catalogue.celliers, modale.bouteille, modale.quantite, fermerModale]);

  // Si l'utilisateur n'est pas connecté
  if (!utilisateur?.id) {
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

  return (
    <>
      <div className="h-screen font-body grid grid-rows-[auto_1fr_auto] overflow-hidden">
        <header>
          <MenuEnHaut />
        </header>
        
        <main className="font-body bg-fond overflow-y-auto">
          <section className="pt-(--rythme-espace) pb-(--rythme-base) px-(--rythme-serre)">
            
            {message.texte && (
              <div className="mb-4">
                <Message texte={message.texte} type={message.type} />
              </div>
            )}
            
            {catalogue.chargement ? (
              <Message texte="Chargement du catalogue..." type="information" />
            ) : (
              <>
                {catalogue.bouteilles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {catalogue.bouteilles.slice(0, 10).map((bouteille) => (
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

      {modale.ouverte && modale.bouteille && (
        <BoiteModale
          texte="Confirmation d'ajout"
          contenu={
            <div className="w-full">
              
              <p className="text-texte-principal font-bold text-center mb-(--rythme-base)">
                {modale.bouteille.nom}
              </p>

              <div className="mb-(--rythme-base)">
                <FormulaireSelect
                  nom="Cellier"
                  genre="un"
                  estObligatoire={true}
                  arrayOptions={catalogue.celliers.map(c => c.nom)}
                  value={catalogue.celliers.find(
                    c => String(c.id_cellier) === String(catalogue.cellierSelectionne)
                  )?.nom || ""}
                  onChange={(e) => {
                    const cellierSelectionne = catalogue.celliers.find(
                      c => c.nom === e.target.value
                    );
                    if (cellierSelectionne) {
                      changerCellier(String(cellierSelectionne.id_cellier));
                    }
                  }}
                  classCouleur="Clair"
                />
              </div>

              <div className="flex items-center justify-center gap-(--rythme-serre)">
                <span className="text-texte-secondaire">Quantité :</span>
                
                <div className="flex items-center gap-2">
                  <BoutonQuantite 
                    type="diminuer"
                    onClick={() => modifierQuantite("diminuer")}
                    disabled={modale.quantite <= 1}
                  />
                  
                  <span className="flex items-center justify-center min-w-8 px-2 
                                 text-texte-principal font-bold text-(length:--taille-normal)">
                    {modale.quantite}
                  </span>
                  
                  <BoutonQuantite 
                    type="augmenter"
                    onClick={() => modifierQuantite("augmenter")}
                  />
                </div>
              </div>
            </div>
          }
          bouton={
            <>
              <Bouton
                texte="Ajouter"
                type="primaire"
                typeHtml="button"
                action={confirmerAjout}
              />
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