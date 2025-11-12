import { BrowserRouter, Routes, Route } from "react-router-dom";
import Bienvenue from "./pages/Bienvenue";


function App() {
  return (
      <Routes>
        <Route path="/" element={<Bienvenue />} />
      </Routes>
  );
}

export default App;
