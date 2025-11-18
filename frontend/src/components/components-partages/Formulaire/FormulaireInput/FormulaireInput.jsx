// Utils
import { formatteString, formatMajDebut } from "../../../../lib/utils";

function FormulaireInput({
  type,
  nom,
  genre, //Un ou une
  estObligatoire, //Required ou non
  onChange,
  value = "",
  pattern,
}) {
  const inputClassique = "";
  return (
    <div
      className="
      flex flex-col 
      gap-rythme-serre 
      font-font-body"
    >
      <label
        className="
        mb-rythme-serre
        text-taille-petit font-medium"
        htmlFor={formatteString(nom)}
      >
        {nom} :
      </label>
      <input
        className="
        max-w-[320px] px-(--rythme-serre) py-(--rythme-tres-serre) 
        text-taille-normal font-font-body
        border rounded-(--arrondi-base) shadow-sm focus:outline-none focus:ring-1 focus:ring-(--color-principal-200)"
        type={type}
        name={formatteString(nom)}
        id={formatteString(nom)}
        {...(estObligatoire ? { required: true } : {})}
        placeholder={`Entrez ${genre} ${nom.toLowerCase()}`}
        value={value}
        pattern={pattern}
        onChange={onChange}
      />
    </div>
  );
}

export default FormulaireInput;
