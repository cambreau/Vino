// Utils
import { formatteString } from "../../../../lib/utils";

function FormulaireSelect({
  nom,
  genre, //Une ou un
  estObligatoire, // Required ou non
  arrayOptions,
  value = "",
  onChange,
  classCouleur = "Dark", //Dark ou Clair
}) {
  const labelClair = "text-(--color-fond)";
  const labelDark = "text-color-texte-secondaire";
  const selectClair =
    "text-(--color-texte) placeholder-(--color-texte-secondaire) placeholder:text-(length:--taille-petit) placeholder:font-display bg-(--color-fond)";
  const selectDark =
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
        ${classCouleur === "Dark" ? labelClair : labelDark} 
      `}
        htmlFor={formatteString(nom)}
      >
        {nom} :
      </label>
      <select
        className={`
          max-w-[320px] px-(--rythme-serre) py-(--rythme-tres-serre) 
          text-(length:--taille-normal) font-font-body
           ${classCouleur === "Dark" ? selectDark : selectClair} 
          border border-(--color-texte-secondaire) rounded-(--arrondi-base) shadow-sm focus:outline-none focus:border-(--color-principal-200)`}
        id={formatteString(nom)}
        name={formatteString(nom)}
        {...(estObligatoire ? { required: true } : {})}
        value={value || ""}
        onChange={onChange}
      >
        <option value="" disabled hidden>
          -- Choisir {genre} {nom} --
        </option>
        {arrayOptions.map((option) => (
          <option key={option} value={formatteString(option)}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FormulaireSelect;
