import { useState } from "react";

/**
 * Composant d'image optimisée qui utilise wsrv.nl pour redimensionner
 * les images externes (comme celles de la SAQ) à la volée.
 *
 * Économie potentielle : ~90% de bande passante pour les images SAQ
 * (de 737 KiB à ~50-80 KiB par image)
 */
const ImageOptimisee = ({
  src,
  alt,
  width,
  height,
  className = "",
  placeholderSrc = "/placeholder-bottle.png",
  onLoad,
  onError,
}) => {
  const [imageChargee, setImageChargee] = useState(false);
  const [erreur, setErreur] = useState(false);

  /**
   * Génère une URL optimisée via le service wsrv.nl
   * Documentation: https://wsrv.nl/docs/
   *
   * @param {string} imageUrl - URL de l'image originale
   * @param {number} targetWidth - Largeur cible en pixels
   * @param {number} targetHeight - Hauteur cible en pixels (optionnel)
   * @returns {string} - URL de l'image redimensionnée
   */
  const getOptimizedUrl = (imageUrl, targetWidth, targetHeight) => {
    // Si pas d'URL ou URL locale, retourner tel quel
    if (!imageUrl) {
      return imageUrl;
    }

    // Normaliser l'URL (ajouter https: si elle commence par //)
    let normalizedUrl = imageUrl;
    if (imageUrl.startsWith("//")) {
      normalizedUrl = `https:${imageUrl}`;
    }

    // Si ce n'est pas une URL externe, retourner tel quel
    if (!normalizedUrl.startsWith("http")) {
      return imageUrl;
    }

    // Construire l'URL wsrv.nl avec les paramètres d'optimisation
    const params = new URLSearchParams({
      url: normalizedUrl,
      w: targetWidth || 200, // Largeur par défaut
      fit: "contain", // Garder les proportions
      output: "webp", // Format moderne plus léger
      q: 80, // Qualité 80% (bon compromis taille/qualité)
    });

    // Ajouter la hauteur si spécifiée
    if (targetHeight) {
      params.set("h", targetHeight);
    }

    return `https://wsrv.nl/?${params.toString()}`;
  };

  /**
   * Génère un srcset pour les écrans haute résolution (Retina)
   */
  const getSrcSet = (imageUrl, baseWidth, baseHeight) => {
    if (!imageUrl) {
      return undefined;
    }

    // Normaliser l'URL
    let normalizedUrl = imageUrl;
    if (imageUrl.startsWith("//")) {
      normalizedUrl = `https:${imageUrl}`;
    }

    if (!normalizedUrl.startsWith("http")) {
      return undefined;
    }

    const sizes = [1, 2]; // 1x et 2x pour Retina
    return sizes
      .map((multiplier) => {
        const w = (baseWidth || 200) * multiplier;
        const h = baseHeight ? baseHeight * multiplier : undefined;
        const url = getOptimizedUrl(imageUrl, w, h);
        return `${url} ${multiplier}x`;
      })
      .join(", ");
  };

  const handleLoad = () => {
    setImageChargee(true);
    onLoad?.();
  };

  const handleError = () => {
    setErreur(true);
    setImageChargee(true);
    onError?.();
  };

  // Calculer les dimensions pour l'optimisation
  const targetWidth = width || 200;
  const targetHeight = height;

  // URL finale (optimisée ou placeholder en cas d'erreur)
  const imageSrc = erreur
    ? placeholderSrc
    : src
      ? getOptimizedUrl(src, targetWidth, targetHeight)
      : placeholderSrc;

  const srcSet =
    !erreur && src ? getSrcSet(src, targetWidth, targetHeight) : undefined;

  return (
    <div className="relative">
      {/* Skeleton de chargement */}
      {!imageChargee && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-32 bg-principal-100/30 rounded animate-pulse" />
        </div>
      )}
      <img
        src={imageSrc}
        srcSet={srcSet}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-200 ${
          imageChargee ? "opacity-100" : "opacity-0"
        } ${className}`}
        loading="lazy"
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default ImageOptimisee;
