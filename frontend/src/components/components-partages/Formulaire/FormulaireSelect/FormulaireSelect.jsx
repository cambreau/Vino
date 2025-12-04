// Utils
import { formatString } from "@lib/utils";

function FormulaireSelect({
  nom,
  genre, //Une ou un
  estObligatoire, // Required ou non
  arrayOptions,
  value = "",
  onChange,
  classCouleur = "Dark", //Dark ou Clair
  fullWidth = false,
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
        htmlFor={formatString(nom)}
      >
        {nom} :
      </label>
      <select
        className={`
          ${
            fullWidth ? "max-w-full" : "max-w-[320px]"
          }  px-(--rythme-serre) py-(--rythme-tres-serre)
          text-(length:--taille-normal) font-font-body
           ${classCouleur === "Dark" ? selectDark : selectClair}
          border border-texte-secondaire rounded-(--arrondi-base) shadow-sm focus:outline-none focus:border-principal-200`}
        id={formatString(nom)}
        name={formatString(nom)}
        {...(estObligatoire ? { required: true } : {})}
        value={value || ""}
        onChange={onChange}
      >
        <option value="" disabled hidden>
          -- Choisir {genre} {nom} --
        </option>
        {arrayOptions.map((option) => {
          // Support pour les objets {valeur, texte} ou les strings simples
          const valeur =
            typeof option === "object" ? option.valeur : formatString(option);
          const texte = typeof option === "object" ? option.texte : option;
          return (
            <option key={valeur} value={valeur}>
              {texte}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default FormulaireSelect;
