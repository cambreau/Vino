import { Routes, Route } from "react-router-dom";
import Bienvenue from "./pages/Bienvenue";
import Profil from "./pages/Profil";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import ModificationProfil from "./pages/ModificationProfil";
import Catalogue from "./pages/Catalogue";
import Celliers from "./pages/Cellier";
import Vin from "./pages/Vin";

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
      <Route path="/celliers" element={<Celliers />} />
      <Route path="/catalogue" element={<Catalogue />} />
      <Route path="/vin" element={<Vin />} />
    </Routes>
  );
}

export default App;
