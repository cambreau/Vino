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
  classColor = "Dark", //Dark ou Clair
}) {
  const nomFormat = formatteString(nom);
  const labelClair = "text-white";
  const labelDark = "text-color-texte-secondaire";
  const inputClair =
    "bg-color-fond text-color-texte-secondaire placeholder-(--color-texte-secondaire)";
  const inputDark = "bg-[#475467] text-color-fond placeholder-(--color-fond)";

  return (
    <div
      className="
      flex flex-col 
      gap-rythme-serre 
      font-font-body"
    >
      <label
        className={`
        mb-rythme-serre
        text-taille-petit font-medium
        ${classColor === "Dark" ? labelClair : labelDark} 
      `}
        htmlFor={nom}
      >
        {formatMajDebut(nomFormat)} :
      </label>
      <input
        className={`
          max-w-[320px] px-(--rythme-serre) py-(--rythme-tres-serre) 
          text-taille-normal font-font-body
           ${classColor === "Dark" ? inputDark : inputClair} 
          border rounded-(--arrondi-base) shadow-sm focus:outline-none focus:border-(--color-principal-200)`}
        type={type}
        name={nom}
        id={nom}
        {...(estObligatoire ? { required: true } : {})}
        placeholder={`Entrez ${genre} ${nomFormat}`}
        value={value}
        pattern={pattern}
        onChange={onChange}
      />
    </div>
  );
}

export default FormulaireInput;
