import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import RouteProtegee from "@components/components-partages/RouteProtegee/RouteProtegee";

// Lazy loading des pages pour réduire le bundle initial
const Bienvenue = lazy(() => import("@pages/Bienvenue"));
const Profil = lazy(() => import("@pages/Profil"));
const Inscription = lazy(() => import("@pages/Inscription"));
const ModificationProfil = lazy(() => import("@pages/ModificationProfil"));
const Catalogue = lazy(() => import("@pages/Catalogue"));
const Cellier = lazy(() => import("@pages/Cellier"));
const Bouteille = lazy(() => import("@pages/Bouteille"));
const SommaireCellier = lazy(() => import("@pages/SommaireCellier"));
const ListeAchat = lazy(() => import("@pages/ListeAchat"));

function App() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Chargement...</div>}>
      <Routes>
        <Route path="/" element={<Bienvenue />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/profil" element={<Profil />} />
        <Route
          path="/modifier-utilisateur/:id"
          element={
            <RouteProtegee type="utilisateur">
              <ModificationProfil />
            </RouteProtegee>
          }
        />
        <Route
          path="/cellier/:idCellier"
          element={
            <RouteProtegee type="cellier">
              <Cellier />
            </RouteProtegee>
          }
        />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/bouteilles/:id" element={<Bouteille />} />
        <Route path="/sommaire-cellier" element={<SommaireCellier />} />
        <Route path="/liste-achat" element={<ListeAchat />} />
      </Routes>
    </Suspense>
  );
}

export default App;
