import { useState, useId, useEffect, useCallback } from "react";
import Bouton from "@components/components-partages/Boutons/Bouton";
import { formatString } from "@lib/utils";
import {
  FaFilter,
  FaExchangeAlt,
  FaWarehouse,
  FaChevronDown,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { GiGrapes } from "react-icons/gi";
import { BiWorld } from "react-icons/bi";
import { MdOutlineCalendarMonth } from "react-icons/md";

/**
 * Composant de filtres optimisé pour le catalogue.
 * Les options de filtres sont récupérées côté serveur.
 * Compatible avec le catalogueStore.
 */
function FiltresCatalogue({
  filtresActuels = {},
  rechercheActuelle = "",
  onFiltrer,
  onRecherche,
  onTri,
  onSupprimerFiltre,
  onReinitialiserFiltres,
  titreFiltrer = "Filtrer",
  titreTri = "Tri",
  texteBouton = "Chercher",
  className = "",
}) {
  const [estOuvert, setEstOuvert] = useState(false);
  const [modeRecherche, setModeRecherche] = useState(Boolean(rechercheActuelle));
  const [criteres, setCriteres] = useState({
    type: "",
    pays: "",
    region: "",
    annee: "",
    ...filtresActuels,
  });
  const [texteRecherche, setTexteRecherche] = useState(rechercheActuelle);
  const [optionsFiltre, setOptionsFiltre] = useState({
    types: [],
    pays: [],
    regions: [],
    annees: [],
  });
  const [chargementOptions, setChargementOptions] = useState(false);

  const formulaireId = useId();

  // Charger les options de filtres depuis l'API
  useEffect(() => {
    const chargerOptions = async () => {
      setChargementOptions(true);
      try {
        const reponse = await fetch(
          `${import.meta.env.VITE_BACKEND_BOUTEILLES_URL}/options-filtres`
        );
        if (reponse.ok) {
          const data = await reponse.json();
          setOptionsFiltre({
            types: data.types || [],
            pays: data.pays || [],
            regions: data.regions || [],
            annees: data.annees || [],
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement des options:", error);
        // Fallback: utiliser des options statiques communes
        setOptionsFiltre({
          types: ["Rouge", "Blanc", "Rosé"],
          pays: [],
          regions: [],
          annees: [],
        });
      } finally {
        setChargementOptions(false);
      }
    };

    chargerOptions();
  }, []);

  // Synchroniser avec les filtres actuels
  useEffect(() => {
    setCriteres((prev) => ({
      ...prev,
      ...filtresActuels,
    }));
  }, [filtresActuels]);

  useEffect(() => {
    setTexteRecherche(rechercheActuelle);
    setModeRecherche(Boolean(rechercheActuelle));
  }, [rechercheActuelle]);

  // Ouvrir le panneau si des filtres sont actifs
  useEffect(() => {
    const aDesValeurs = Object.values(filtresActuels).some(
      (v) => v !== undefined && v !== null && v !== ""
    );
    if (aDesValeurs) {
      setEstOuvert(true);
    }
  }, [filtresActuels]);

  const aDesFiltresActifs =
    Object.values(criteres).some((v) => Boolean(v)) || Boolean(texteRecherche);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCriteres((prev) => {
      const nouveauxCriteres = { ...prev, [name]: value };
      if (name === "pays" && value !== prev.pays) {
        nouveauxCriteres.region = "";
      }
      return nouveauxCriteres;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (modeRecherche) {
      onRecherche?.(texteRecherche);
    } else {
      onFiltrer?.(criteres);
    }
  };

  const handleSupprimerFiltre = (cle) => {
    setCriteres((prev) => {
      const nouveauxCriteres = { ...prev, [cle]: "" };
      if (cle === "pays") {
        nouveauxCriteres.region = "";
      }
      return nouveauxCriteres;
    });
    onSupprimerFiltre?.(cle);
  };

  const handleReinitialiser = () => {
    setCriteres({
      type: "",
      pays: "",
      region: "",
      annee: "",
    });
    setTexteRecherche("");
    setModeRecherche(false);
    onReinitialiserFiltres?.();
  };

  const handleBasculerRecherche = () => {
    setModeRecherche(true);
  };

  const handleBasculerFiltres = () => {
    setModeRecherche(false);
    setTexteRecherche("");
  };

  const champSelects = [
    {
      id: "type",
      label: "Type",
      icone: <GiGrapes className="text-principal-200" />,
      options: optionsFiltre.types,
    },
    {
      id: "pays",
      label: "Pays",
      icone: <BiWorld className="text-principal-200" />,
      options: optionsFiltre.pays,
    },
    {
      id: "region",
      label: "Région",
      icone: <FaWarehouse className="text-principal-200" />,
      options: optionsFiltre.regions,
    },
  ];

  // Mode recherche
  if (modeRecherche) {
    return (
      <section
        className={`w-full max-w-[380px] bg-fond-secondaire border border-principal-100 rounded-(--arrondi-tres-grand) p-(--rythme-base) shadow-md flex flex-col gap-(--rythme-base) ${className}`}
      >
        <header className="flex items-center justify-between text-(length:--taille-petit) font-semibold text-principal-200 uppercase">
          <span className="flex items-center gap-2">
            <FaSearch />
            <span>Recherche</span>
          </span>
          <button
            type="button"
            onClick={handleBasculerFiltres}
            className="flex items-center gap-2 px-4 text-principal-200 hover:text-principal-300 transition-colors"
            aria-label="Retour aux filtres"
          >
            <FaFilter />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-(--rythme-base)">
          <div className="relative">
            <input
              type="text"
              value={texteRecherche}
              onChange={(e) => setTexteRecherche(e.target.value)}
              placeholder="Rechercher un vin..."
              className="w-full rounded-(--arrondi-grand) border border-principal-100 px-(--rythme-base) py-(--rythme-serre) pr-10 text-(length:--taille-normal) text-texte-secondaire focus:outline-none focus:border-principal-200"
            />
            {texteRecherche && (
              <button
                type="button"
                onClick={() => setTexteRecherche("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-principal-200 hover:text-erreur"
                aria-label="Effacer la recherche"
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div className="flex gap-(--rythme-serre)">
            <Bouton texte="Rechercher" typeHtml="submit" taille="moyen" />
            {aDesFiltresActifs && (
              <Bouton
                texte="Réinitialiser"
                typeHtml="button"
                taille="moyen"
                type="secondaire"
                action={handleReinitialiser}
              />
            )}
          </div>
        </form>
      </section>
    );
  }

  // Mode filtres
  return (
    <section
      className={`w-full max-w-[380px] bg-fond-secondaire border border-principal-100 rounded-(--arrondi-tres-grand) p-(--rythme-base) shadow-md flex flex-col gap-(--rythme-base) ${className}`}
      data-ouvert={estOuvert}
    >
      <header className="flex items-center justify-between text-(length:--taille-petit) font-semibold text-principal-200 uppercase">
        <button
          type="button"
          onClick={() => setEstOuvert((o) => !o)}
          className="flex flex-1 items-center justify-between gap-2 pr-4 text-left"
          aria-expanded={estOuvert}
          aria-controls={formulaireId}
        >
          <span className="flex items-center gap-2">
            <FaFilter />
            <span>{titreFiltrer}</span>
          </span>
          <FaChevronDown
            className={`transition-transform duration-200 ${
              estOuvert ? "rotate-180" : ""
            }`}
          />
        </button>
        <div className="h-6 w-px bg-principal-100" aria-hidden="true" />
        <button
          type="button"
          onClick={handleBasculerRecherche}
          className="flex items-center gap-2 px-4 text-principal-200 hover:text-principal-300 transition-colors"
          aria-label="Rechercher"
        >
          <FaSearch />
        </button>
      </header>

      {estOuvert && (
        <form
          id={formulaireId}
          className="flex flex-col gap-(--rythme-base)"
          onSubmit={handleSubmit}
        >
          {onTri && (
            <button
              type="button"
              onClick={onTri}
              className="flex items-center gap-2 text-(length:--taille-petit) text-principal-200 hover:text-principal-300 transition-colors"
            >
              <FaExchangeAlt />
              <span>{titreTri}</span>
            </button>
          )}

          {champSelects.map((champ) => (
            <div key={champ.id} className="flex flex-col gap-(--rythme-tres-serre)">
              <label
                htmlFor={champ.id}
                className="flex items-center gap-2 text-(length:--taille-petit) text-texte-secondaire"
              >
                {champ.icone}
                <span>{champ.label} :</span>
              </label>
              <div className="relative">
                <select
                  id={champ.id}
                  name={champ.id}
                  value={criteres[champ.id]}
                  onChange={handleChange}
                  disabled={chargementOptions}
                  className="w-full rounded-(--arrondi-grand) border border-principal-100 px-(--rythme-base) py-(--rythme-tres-serre) pr-10 text-(length:--taille-normal) text-texte-secondaire focus:outline-none focus:border-principal-200 disabled:opacity-50"
                >
                  <option value="">
                    {chargementOptions ? "Chargement..." : "Choisissez"}
                  </option>
                  {(champ.options ?? []).map((option) => (
                    <option key={`${champ.id}-${formatString(option)}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {criteres[champ.id] && (
                  <button
                    type="button"
                    onClick={() => handleSupprimerFiltre(champ.id)}
                    className="absolute right-8 top-1/2 -translate-y-1/2 p-1 text-principal-200 hover:text-erreur transition-colors"
                    aria-label={`Supprimer le filtre ${champ.label}`}
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-(--rythme-tres-serre)">
            <label
              htmlFor="annee"
              className="flex items-center gap-2 text-(length:--taille-petit) text-texte-secondaire"
            >
              <MdOutlineCalendarMonth className="text-principal-200" />
              <span>Année :</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="annee"
                name="annee"
                min="1900"
                max="2100"
                list="liste-annees"
                value={criteres.annee}
                onChange={handleChange}
                placeholder="Choisissez"
                className="w-full rounded-(--arrondi-grand) border border-principal-100 px-(--rythme-base) py-(--rythme-tres-serre) pr-10 text-(length:--taille-normal) text-texte-secondaire focus:outline-none focus:border-principal-200"
              />
              {criteres.annee && (
                <button
                  type="button"
                  onClick={() => handleSupprimerFiltre("annee")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-principal-200 hover:text-erreur transition-colors"
                  aria-label="Supprimer le filtre année"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              )}
            </div>
            <datalist id="liste-annees">
              {(optionsFiltre.annees ?? []).map((option) => (
                <option key={`annee-${option}`} value={option} />
              ))}
            </datalist>
          </div>

          <div className="flex flex-col gap-(--rythme-tres-serre)">
            <div className="flex gap-(--rythme-serre)">
              <Bouton texte={texteBouton} typeHtml="submit" taille="moyen" />
              {aDesFiltresActifs && (
                <Bouton
                  texte="Réinitialiser"
                  typeHtml="button"
                  taille="moyen"
                  type="secondaire"
                  action={handleReinitialiser}
                />
              )}
            </div>
          </div>
        </form>
      )}
    </section>
  );
}

export default FiltresCatalogue;
