import { Link, useNavigate } from "react-router-dom";
import MenuEnBas from "../components/components-partages/MenuEnBas/MenuEnBas";
import Icon from "../components/components-partages/Icon/Icon";

function Profil() {
  const navigate = useNavigate();
  return (
    <div>
      <header>
        <Icon name="fermer" typeMenu="haut" />
        <Icon name="deconnection" typeMenu="haut" />
      </header>
      <main></main>
      <footer>
        <MenuEnBas />
      </footer>
    </div>
  );
}

export default Profil;
