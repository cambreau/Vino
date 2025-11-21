import { Routes, Route } from "react-router-dom";
import Bienvenue from "./pages/Bienvenue";
import Profil from "./pages/Profil";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import ModificationProfil from "./pages/ModificationProfil";

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
    </Routes>
  );
}

export default App;
