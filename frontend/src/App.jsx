import { Routes, Route } from "react-router-dom";
import Bienvenue from "./pages/Bienvenue";
import Profil from "./pages/Profil";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import ModificationProfil from "./pages/ModificationProfil";
import Catalogue from "./pages/Catalogue";
import Cellier from "./pages/Cellier";
import SommaireCellier from "./pages/SommaireCellier";

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
      <Route path="/sommaire-cellier" element={<SommaireCellier />} />
    </Routes>
  );
}

export default App;
