import { BrowserRouter, Routes, Route } from "react-router-dom";
import Bienvenue from "./pages/Bienvenue";
import Inscription from "./pages/Inscription";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Bienvenue />} />
      <Route path="/inscription" element={<Inscription />} />
    </Routes>
  );
}

export default App;
