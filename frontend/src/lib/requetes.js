// Ce fichier regroupe toutes les fonctions permettant de communiquer avec le backend.

export const creerUtilisateur = async (datas, navigate) => {
  try {
    const reponse = await fetch(
      `${import.meta.env.VITE_BACKEND_UTILISATEUR_URL}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datas),
      }
    );

    if (reponse.ok) {
      navigate("/connexion?inscriptionSucces=true");
      return { succes: true };
    } else {
      // Gestion des erreurs HTTP (400, 500, etc.)
      const erreurData = await reponse.json().catch(() => ({}));
      console.error("Erreur HTTP:", reponse.status, erreurData);
      navigate("/inscription?echec=true");
      return { succes: false, erreur: erreurData };
    }
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur :", error);
    navigate("/inscription?echec=true");
    return { succes: false, erreur: error.message };
  }
};


// Fonction connexionUtilisateur
export const connexionUtilisateur = async (datas, navigate) => {
  try {
    const reponse = await fetch(
      `${import.meta.env.VITE_BACKEND_UTILISATEUR_URL}/connexion`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datas),
      }
    );

    if (reponse.ok) {
      const data = await reponse.json();
      
      // Stocker les informations de l'utilisateur dans localStorage
      localStorage.setItem('utilisateur', JSON.stringify(data.utilisateur));
      
      // Rediriger vers page profil
      navigate("/profil"); 
      
      return { succes: true, utilisateur: data.utilisateur };
    } else {
      // Gestion des erreurs HTTP (400, 401, 500, etc.)
      const erreurData = await reponse.json().catch(() => ({}));
      console.error("Erreur HTTP:", reponse.status, erreurData);
      
      return { 
        succes: false, 
        erreur: erreurData.message || "Erreur lors de la connexion" 
      };
    }
  } catch (error) {
    console.error("Erreur lors de la connexion de l'utilisateur :", error);
    return { 
      succes: false, 
      erreur: "Erreur de connexion au serveur" 
    };
  }
};
