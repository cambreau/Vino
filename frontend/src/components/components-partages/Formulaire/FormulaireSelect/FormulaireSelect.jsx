// Utils
import { formatteStringSansAccentEtEspace } from "../../../../lib/utils";

function FormulaireSelect({
  nom,
  genre, //Une ou un
  estObligatoire, // Required ou non
  arrayOptions,
  value = "",
  onChange,
}) {
  return (
    <div>
      <label htmlFor={formatteStringSansAccentEtEspace(nom)}>{nom} :</label>
      <select
        id={formatteStringSansAccentEtEspace(nom)}
        name={formatteStringSansAccentEtEspace(nom)}
        {...(estObligatoire ? { required: true } : {})}
        value={value || ""}
        onChange={onChange}
      >
        <option value="" disabled hidden>
          -- Choisir {genre} {nom} --
        </option>
        {arrayOptions.map((option) => (
          <option key={option} value={formatteStringSansAccentEtEspace(option)}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FormulaireSelect;
