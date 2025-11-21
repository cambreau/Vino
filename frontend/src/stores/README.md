## Documentation sur le store :

https://zustand.docs.pmnd.rs/getting-started/introduction
https://zustand.docs.pmnd.rs/middlewares/persist#persist

## Concept

Un store permet de partager des données entre plusieurs composants React.
Au lieu de passer des props partout, on met les données dans un store et tous les composants peuvent y accéder.

### Comment creer un store

```javascript
const useUserStore = create((set) => ({
  nom: "",
  setNom: (nouveauNom) => set({ nom: nouveauNom }),
}));
```

1. `create()` permet d'initialiser le store
2. `set` est la fonction de modification du store
3. On retourne un objet avec les données et les fonctions pour les modifier

### Comment utiliser un store dans un composant

```javascript
import useUserStore from "./stores/useUserStore";

function MonComposant() {
  // Récupérer les données du store
  const nom = useUserStore((state) => state.nom);

  //Modifier le store en deux methodes:
  // 1.
  const setNom = useUserStore((state) => state.setNom);
  const changerNom = () => {
    setNom("Nouveau nom");
  };
  // 2.
  getState().setNom("Nouveau nom");

  // Utiliser les données
  return <div>{nom}</div>;
}
```

### Le middleware persist

Le middleware `persist` sauvegarde automatiquement le store dans le localStorage du navigateur.

```javascript
const useUserStore = create(
  persist(
    (set) => ({ ... }),
    {
      name: "user-storage", // Nom de la clé dans localStorage
    }
  )
);
```

**Avantage :** Les données restent sauvegardées même après fermeture du navigateur.

### Store d'authentification

Le store `authentificationStore.js` gère :

- L'utilisateur connecté
- L'état de connexion
- Les actions : connexion() et deconnexion()

**Utilisation :**

```javascript
import authentificationStore from "./stores/authentificationStore";

// Récupérer l'utilisateur
const utilisateur = authentificationStore((state) => state.utilisateur);
const estConnecte = authentificationStore((state) => state.estConnecte);

// Se connecter
authentificationStore.getState().connexion(utilisateurData);

// Se déconnecter
authentificationStore.getState().deconnexion();
```
