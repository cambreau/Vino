// Utils
import { formatteString, formatMajDebut } from "../../../../lib/utils";

function FormulaireInput({
  type,
  nom,
  genre, //Un ou une
  estObligatoire, //Required ou non
  onChange,
  onBlur,
  value = "",
  classCouleur = "Dark", //Dark ou Clair
}) {
  const nomFormat = formatteString(nom);
  const labelClair = "text-white";
  const labelDark = "text-color-texte-secondaire";
  const inputClair =
    "bg-(--color-fond) text-(--color-texte) placeholder-(--color-texte-secondaire) placeholder:text-(length:--taille-petit) placeholder:font-display";
  const inputDark =
    "bg-[#475467] text-(--color-fond) placeholder-(--color-fond) placeholder:text-(length:--taille-petit) placeholder:font-display";

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
        text-(length:--taille-petit) font-medium
        ${classCouleur === "Dark" ? labelClair : labelDark} 
      `}
        htmlFor={nom}
      >
        {formatMajDebut(nomFormat)} :
      </label>
      <input
        className={`
          max-w-[320px] px-(--rythme-serre) py-(--rythme-tres-serre) 
          text-(length:--taille-normal) font-font-body
           ${classCouleur === "Dark" ? inputDark : inputClair} 
          border border-(--color-texte-secondaire) rounded-(--arrondi-base) shadow-sm focus:outline-none focus:border-(--color-principal-200)`}
        type={type}
        name={nom}
        id={nom}
        {...(estObligatoire ? { required: true } : {})}
        placeholder={`Entrez ${genre} ${nomFormat}`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
}

export default FormulaireInput;
