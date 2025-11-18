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
