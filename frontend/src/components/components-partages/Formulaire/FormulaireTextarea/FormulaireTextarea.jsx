// Utils
import { formatString } from "../../../../lib/utils";

function FormulaireTextarea({
  nom,
  genre, //Un ou Une
  estObligatoire, // Required ou non
  defaultValue = null,
}) {
  return (
    <div className="FormulaireTextarea">
      <label htmlFor={formatString(nom)}>{nom} :</label>
      <textarea
        id={formatString(nom)}
        name={formatString(nom)}
        rows={4}
        minLength={10}
        className="placeholder:text-(length:--taille-petit) placeholder:font-display"
        placeholder={`Entrez ${genre} ${nom.toLowerCase()}`}
        {...(estObligatoire ? { required: true } : {})}
        {...(defaultValue ? { value: defaultValue } : "")}
      ></textarea>
    </div>
  );
}

export default FormulaireTextarea;
