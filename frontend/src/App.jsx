import { Routes, Route } from "react-router-dom";
import Bienvenue from "@pages/Bienvenue";
import Profil from "@pages/Profil";
import Inscription from "@pages/Inscription";
import ModificationProfil from "@pages/ModificationProfil";
import Catalogue from "@pages/Catalogue";
import Cellier from "@pages/Cellier";
import Bouteille from "@pages/Bouteille";
import SommaireCellier from "@pages/SommaireCellier";
import ListeAchat from "@pages/ListeAchat";
import RouteProtegee from "@components/components-partages/RouteProtegee/RouteProtegee";

function App() {
  return (
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
  );
}

export default App;
