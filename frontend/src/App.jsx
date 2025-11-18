import { Routes, Route } from "react-router-dom";
import Bienvenue from "./pages/Bienvenue";
import Profil from "./pages/Profil";

function App() {
  return (
    <Routes>
      {<Route path="/" element={<Bienvenue />} />}
      <Route path="/profil" element={<Profil />} />
    </Routes>
  );
}

export default App;
