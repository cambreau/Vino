// Utils
import { formatString, formatMajDebut } from "@lib/utils";

function FormulaireTextarea({
  nom,
  genre, //Un ou Une
  estObligatoire, // Required ou non
  defaultValue = null,
  value = null,
  onChange = null,
  classCouleur = "Dark", //Dark ou Clair
  classCouleurLabel = "Dark", //Dark ou Clair
}) {
  const nomFormat = formatString(nom);
  const labelClair = "text-(--color-fond)";
  const labelDark = "text-color-texte-secondaire";
  const textareaClair =
    "text-(--color-texte) placeholder-(--color-texte-secondaire) placeholder:text-(length:--taille-petit) placeholder:font-display bg-(--color-fond)";
  const textareaDark =
    "text-(--color-fond) placeholder-(--color-fond) placeholder:text-(length:--taille-petit) placeholder:font-display bg-[#475467]";

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
        ${classCouleurLabel === "Dark" ? labelDark : labelClair}
      `}
        htmlFor={formatString(nom)}
      >
        {formatMajDebut(nomFormat)} :
      </label>
      <textarea
        id={formatString(nom)}
        name={formatString(nom)}
        rows={4}
        minLength={10}
        className={`
          w-full px-(--rythme-serre) py-(--rythme-tres-serre)
          text-(length:--taille-normal) font-font-body
          ${classCouleur === "Dark" ? textareaDark : textareaClair}
          border border-texte-secondaire rounded-(--arrondi-base) shadow-sm 
          focus:outline-none focus:border-principal-200
          resize-y
        `}
        placeholder={`Entrez ${genre} ${nomFormat}`}
        {...(estObligatoire ? { required: true } : {})}
        {...(value !== null ? { value } : defaultValue ? { defaultValue } : {})}
        {...(onChange ? { onChange } : {})}
      ></textarea>
    </div>
  );
}

export default FormulaireTextarea;
