// Utils
import { formatteStringSansAccentEtEspace } from "../../../../lib/utils";

function FormulaireInput({
  type,
  nom,
  genre, //Un ou une
  estObligatoire, //Required ou non
  onChange,
  value = "",
}) {
  return (
    <div>
      <label htmlFor={formatteStringSansAccentEtEspace(nom)}>{nom} :</label>
      <input
        type={type}
        name={formatteStringSansAccentEtEspace(nom)}
        id={formatteStringSansAccentEtEspace(nom)}
        {...(estObligatoire ? { required: true } : {})}
        placeholder={`Entrez ${genre} ${nom.toLowerCase()}`}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default FormulaireInput;
