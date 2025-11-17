// Utils
import { formatteString } from "../../../../lib/utils";

function FormulaireTextarea({
  nom,
  genre, //Un ou Une
  estObligatoire, // Required ou non
  defaultValue = null,
}) {
  return (
    <div className="FormulaireTextarea">
      <label htmlFor={formatteString(nom)}>{nom} :</label>
      <textarea
        id={formatteString(nom)}
        name={formatteString(nom)}
        rows={4}
        minLength={10}
        placeholder={`Entrez ${genre} ${nom.toLowerCase()}`}
        {...(estObligatoire ? { required: true } : {})}
        {...(defaultValue ? { value: defaultValue } : "")}
      ></textarea>
    </div>
  );
}

export default FormulaireTextarea;
