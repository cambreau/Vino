- Fonction flechees sauf cas particulier - commence par un verble - camelCase

# Conventions modernes pour une application Web React + Node + Tailwind + Vite

## 1. Stack et philosophie générale

- **Front-end** : React + Vite, JSX, React Router, Tailwind CSS.
- **Back-end** : Node.js + Express exposant une API REST/JSON.
- **Langage** : JavaScript moderne (ES2020+), `type="module"` côté Node.
- **Outillage** : npm, ESLint, Prettier, Git.

Objectifs principaux : code prévisible, structure stable, séparation claire des responsabilités.

---

## 2. Structure de dépôt recommandée

### 2.1. Monorepo simple front + API

```text
.
├── client/                 # Frontend React + Vite
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── routes/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── layouts/
│       ├── lib/
│       ├── styles/
│       ├── assets/
│       └── config/
└── server/                 # Backend Node + Express
    ├── package.json
    └── src/
        ├── index.js
        ├── app.js
        ├── config/
        ├── routes/
        ├── controllers/
        ├── services/
        ├── models/
        ├── middlewares/
        └── utils/
```

### 2.2. Règles de structure

- Langue utilisée pour coder : anglais.
- Commentaire en français.
- **Pas de logique métier dans `index.js` / `main.jsx`**.
- Un dossier par **feature** côté front (`features/auth`, `features/cart`, etc.).
- Un dossier par **ressource métier** côté back (`user`, `order`, etc.).

---

## 3. Conventions de nommage

### 3.1. Fichiers et dossiers

- Dossiers : `lowercase` (`components`, `userprofile`).
- Composants React : `PascalCase.jsx` (`UserCard.jsx`, `Navbar.jsx`).
- Hooks : `useSomething.js` dans `hooks/`.
- Utilitaires / Utils : `camelCase.js` (`formatDate.js`, `buildQueryString.js`).

### 3.2. Identifiants JavaScript

- Variables / Constantes / fonctions : `camelCase`.
- Classes : `PascalCase`.
- Constantes globales : `SCREAMING_SNAKE_CASE`.
- Hooks React : préfixe obligatoire `use` (`useAuth`, `useFetch`).
- Composants : `PascalCase` pour tout ce qui retourne du JSX.

### 3.3. Imports

Ordre standard dans chaque fichier :

1. Modules Node / Web standard.
2. Dépendances externes (`react`, `react-router-dom`, etc.).
3. Aliases internes (`@/components/...`, `@/features/...`).
4. Imports relatifs locaux (`./MyComponent`, `../utils/...`).

Garder un espace vide entre chaque groupe d’imports.

---

## 4. Frontend : conventions React + Vite

### 4.1. Entry point

`main.jsx` minimaliste :

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

Aucune logique métier dans `main.jsx`.

### 4.2. Composants

- Un composant par fichier.
- Nom du fichier = nom du composant (`UserCard.jsx`).
- Export par défaut unique.

```jsx
function UserCard({ user }) {
  return (
    <article className="flex items-center gap-4">
      <img
        src={user.avatarUrl}
        alt={user.name}
        className="h-12 w-12 rounded-full"
      />
      <div>
        <h2 className="text-sm font-semibold">{user.name}</h2>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>
    </article>
  );
}

export default UserCard;
```

#### Règles de base

- Composant **pur** autant que possible :
  > Favoriser les fonctions et composants **purs**, sans effets secondaires implicites.  
  > **Éviter les mutations** de données ou d’objets partagés.  
  > Une fonction pure est prévisible, testable et ne dépend que de ses entrées.

#### Exemples en JavaScript

##### Fonction pure

```js
function calculateTotal(price, quantity) {
  return price * quantity;
}
```

- Même résultat pour les mêmes entrées
- Ne modifie rien en dehors d’elle-même

---

##### Fonction impure

```js
let total = 0;

function addToTotal(price) {
  total += price; // ❌ effet de bord
}
```

- Modifie une variable externe
- Résultat dépend de l’état précédent

---

##### Mutation à éviter

```js
function updateUser(user, newName) {
  user.name = newName; // ❌ mutation directe
  return user;
}
```

- Modifie l’objet original
- Risque de bugs en React (re-rendu non déclenché)

---

##### Alternative immuable

```js
function updateUser(user, newName) {
  return { ...user, name: newName }; // ✅ copie avec modification
}
```

- Crée un nouvel objet
- Compatible avec les principes de React

- Nommer chaque prop de manière explicite et cohérente avec la logique du composant. Pas de « prop bag » ambigu (`props` brut).
  // ❌ À éviter
  function MonComposant(props) {
  const { title, ...rest } = props;
  return <Header {...rest} />;
  }

  // ✅ Préféré
  function MonComposant({ pageTitle, onBackClick }) {
  return <Header title={pageTitle} onBack={onBackClick} />;
  }

- Préférer la composition à la logique conditionnelle gigantesque.

### 4.3. Hooks custom

- Un hook = un comportement réutilisable.
- Nom : `useXxx` clair et explicite.

```jsx
import { useEffect, useState } from "react";

export function useFetch(url, options) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function run() {
      try {
        setLoading(true);
        const res = await fetch(url, options);
        if (!res.ok) throw new Error("Request failed");
        const json = await res.json();
        if (isMounted) setData(json);
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    run();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error };
}
```

### 4.4. Routing

- Utiliser `react-router-dom` avec un fichier central de routes.

```jsx
// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage.jsx";
import NotFoundPage from "@/pages/NotFoundPage.jsx";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
```

`App.jsx` doit rester un shell qui compose le layout et les routes.

---

## 5. Tailwind CSS : conventions

### 5.1. Configuration de base

- Utiliser `tailwind.config.js` pour définir un **design system** :

  - Palette `primary`, `secondary`, `accent`, `muted`, etc.
  - Breakpoints standard (`sm`, `md`, `lg`, `xl`, `2xl`).
  - Espacement
  - Titre
  - Lien
  - Bouton
  - Utiliser des tokens sémantiques plutôt que des couleurs brutes (`bg-primary`, `text-muted-foreground`).

### 5.2. Organisation des classes

Ordre recommandé dans les classes Tailwind pour la lisibilité :

1. Layout (`flex`, `grid`, `block`, `hidden`).
2. Positionnement (`relative`, `absolute`, `top-...`).
3. Box model (`w-`, `h-`, `p-`, `m-`, `gap-`).
4. Typographie (`text-`, `font-`, `leading-`).
5. Couleurs (`bg-`, `text-`, `border-`).
6. Effets (`shadow-`, `ring-`, `transition`, `duration-`).

Exemple :

```jsx
<button className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90">
  Valider
</button>
```

### 5.3. Factoring de styles

- Pour les patterns récurrents, créer des **UI primitives** plutôt que des classes à rallonge copiées.

```jsx
// src/components/ui/Button.jsx
import clsx from "clsx";

const base =
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

const variants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline:
    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
};

export function Button({ variant = "default", className, ...props }) {
  return (
    <button className={clsx(base, variants[variant], className)} {...props} />
  );
}
```

### 5.4. Fichiers CSS globaux

- `src/styles/index.css` : import Tailwind + reset + styles globaux limités.
- Éviter de mélanger Tailwind et CSS custom pour le même composant sauf si nécessaire.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark light;
}
```

---

## 6. Backend Node + Express : conventions

### 6.1. Entry point

`src/index.js` doit uniquement démarrer le serveur :

```js
import { createServer } from "http";
import app from "./app.js";

const PORT = process.env.PORT || 4000;

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`API ready on port ${PORT}`);
});
```

`src/app.js` contient la configuration Express :

```js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import apiRouter from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", apiRouter);

export default app;
```

### 6.2. Structure REST

- Routes groupées par ressource : `/api/users`, `/api/orders`, etc.
- Versioning via prefix si nécessaire : `/api/v1/...`.
- Noms de routes en **pluriel**.

```js
// src/routes/user.routes.js
import { Router } from "express";
import * as userController from "../controllers/user.controller.js";

const router = Router();

router.get("/", userController.listUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
```

### 6.3. Contrôleurs, services, modèles

- **Controller** : reçoit la requête, appelle le service, renvoie la réponse HTTP.
- **Service** : logique métier et orchestration.
- **Model** : accès aux données (SQL, ORM, etc.).

```js
// controller
export async function listUsers(req, res, next) {
  try {
    const users = await userService.listUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
}
```

### 6.4. Gestion des erreurs

Middleware d’erreur global :

```js
// src/middlewares/error-handler.js
export function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || "Internal server error";

  res.status(status).json({
    error: {
      message,
      status,
    },
  });
}
```

Toujours `next(err)` dans les contrôleurs en cas d’erreur.

---

## 7. Communication front / back

### 7.1. Client HTTP

Créer un client centralisé :

```js
// src/lib/apiClient.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const error = new Error(errorBody?.error?.message || "Request failed");
    error.status = res.status;
    throw error;
  }

  return res.json();
}
```

### 7.2. Règles d’API

- Réponses JSON systématiques.
- Format homogène pour les erreurs (`{ error: { message, status } }`).
- Ne jamais exposer d’informations sensibles (stack, SQL, path système) dans les messages d’erreur.

---

## 8. Gestion de la configuration et des secrets

### 8.1. Fichiers `.env`

- **Back** : `.env`, `.env.local`, etc. jamais commités.
- **Front** : variables exposées via préfixe `VITE_`.

Exemples :

```bash
# server/.env
NODE_ENV=development
PORT=4000
DATABASE_URL=mysql://user:pass@localhost:3306/app_db
JWT_SECRET=change-me

# client/.env
VITE_API_URL=http://localhost:4000/api
```

### 8.2. Accès aux variables

- Côté back : `process.env.VARIABLE`.
- Côté front : `import.meta.env.VITE_VARIABLE`.

---

## 9. Qualité : ESLint, Prettier, formatage

### 9.1. ESLint

Installer un preset React moderne (par ex. `eslint-config-react-app` ou équivalent) et l’adapter.

Principes :

- Interdire `any` implicite si TypeScript (optionnel).
- Pas de variables non utilisées.
- Hooks : respecter les règles (`react-hooks/rules-of-hooks`, `react-hooks/exhaustive-deps`).

### 9.2. Prettier

- Un seul formateur de code dans le projet.
- Préférer l’exécution via script npm : `npm run format`.

Exemple de scripts :

```json
{
  "scripts": {
    "lint": "eslint src --ext .js,.jsx",
    "format": "prettier --write ."
  }
}
```

---

## 10. Tests

### 10.1. Frontend

- Utiliser Vitest + React Testing Library.
- Convention de fichiers : `ComponentName.test.jsx` à côté du composant ou dans `__tests__/`.

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### 10.2. Backend

- Jest ou Vitest.
- Tester les services et la logique métier en priorité.
- Tests d’intégration sur les routes critiques.

---

## 11. Performance et accessibilité

### 11.1. Performance

- `React.lazy` + `Suspense` pour le code-splitting des pages.
- Mémoïsation ciblée (`useMemo`, `useCallback`) uniquement quand nécessaire.
- Éviter de recréer des fonctions dans le JSX quand elles seront passées profondément.

### 11.2. Accessibilité

- Utiliser des balises sémantiques (`header`, `main`, `nav`, `footer`).
- Toujours fournir `alt` sur les images.
- Respecter l’ordre des titres (`h1`, `h2`, etc.).
- Ne pas se baser uniquement sur la couleur pour transmettre l’information.

---

## 12. Scripts npm usuels

### 12.1. Client

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .js,.jsx",
    "test": "vitest",
    "format": "prettier --write ."
  }
}
```

### 12.2. Server

```json
{
  "scripts": {
    "dev": "NODE_ENV=development nodemon src/index.js",
    "start": "NODE_ENV=production node src/index.js",
    "lint": "eslint src --ext .js",
    "test": "vitest",
    "format": "prettier --write ."
  }
}
```

---

## 13. Git et conventions de commit

- Unité de commit = une fonctionnalité ou un changement cohérent.
- Messages de commit courts et explicites :

  - Option 1 : phrases simples, en français ou en anglais, à l’impératif.
  - Option 2 : **Conventional Commits** (`feat:`, `fix:`, `chore:`, etc.).

Exemples :

```text
feat: add user authentication flow
fix: correct cart total calculation
chore: configure eslint and prettier
refactor: extract api client
```

---

## 14. Checklist de démarrage pour un nouveau projet

1. Initialiser Git, `.gitignore` propre pour Node + Vite.
2. Créer `client` + `server` avec `npm init` et Vite (`npm create vite@latest`).
3. Installer Tailwind et le configurer (`tailwind.config.js`, `postcss.config.js`).
4. Installer ESLint + Prettier + configurations de base.
5. Mettre en place la structure de dossiers standard.
6. Créer une route API simple (`GET /health`) côté back.
7. Connecter le front à cette route avec un `useFetch` ou équivalent.
8. Ajouter un test minimal front + back.
9. Configurer les scripts npm (`dev`, `build`, `start`, `lint`, `test`, `format`).
10. Documenter dans un `README.md` la stack, les scripts et les variables d’environnement.
