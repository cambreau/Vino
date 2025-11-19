import { Routes, Route } from "react-router-dom";
import Bienvenue from "./pages/Bienvenue";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Bienvenue />} />
      <Route path="/inscription" element={<Inscription />} />
      <Route path="/connexion" element={<Connexion />} />
    </Routes>
  );
}

export default App;
