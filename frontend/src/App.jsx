import { Routes, Route } from "react-router-dom";
import Bienvenue from "@pages/Bienvenue";
import Profil from "@pages/Profil";
import Connexion from "@pages/Connexion";
import Inscription from "@pages/Inscription";
import ModificationProfil from "@pages/ModificationProfil";
import Catalogue from "@pages/Catalogue";
import Cellier from "@pages/Cellier";
import Bouteille from "@pages/Bouteille";
import SommaireCellier from "@pages/SommaireCellier";
import ListeAchat from "@pages/ListeAchat";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Bienvenue />} />
      <Route path="/inscription" element={<Inscription />} />
      <Route path="/profil" element={<Profil />} />
      <Route path="/connexion" element={<Connexion />} />
      <Route
        path="/modifier-utilisateur/:id"
        element={<ModificationProfil />}
      />
      <Route path="/cellier/:idCellier" element={<Cellier />} />
      <Route path="/catalogue" element={<Catalogue />} />
      <Route path="/bouteilles/:id" element={<Bouteille />} />
      <Route path="/sommaire-cellier" element={<SommaireCellier />} />
      <Route path="/liste-achat" element={<ListeAchat />} />
    </Routes>
  );
}

export default App;
