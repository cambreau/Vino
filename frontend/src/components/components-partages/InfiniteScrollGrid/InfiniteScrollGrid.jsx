import { useRef, useEffect, useCallback } from "react";

/**
 * Composant InfiniteScrollGrid optimisé pour afficher une grille avec chargement infini.
 *
 * Caractéristiques:
 * - Utilise IntersectionObserver pour détecter quand charger plus
 * - Debounce intégré pour éviter les chargements multiples rapides
 * - Compatible avec les grilles CSS responsives
 * - Optimisé avec des clés stables pour minimiser les re-renders
 * - Support du chargement en cours et des états vides
 */

const InfiniteScrollGrid = ({
  items,
  renderItem,
  onLoadMore,
  hasMore,
  isLoading,
  loadingComponent,
  emptyComponent,
  className,
  gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
  scrollContainerRef,
  debounceMs = 150,
}) => {
  const sentinelRef = useRef(null);
  const loadingRef = useRef(false);
  const debounceRef = useRef(null);

  // Callback stable pour charger plus avec debounce
  const handleLoadMore = useCallback(() => {
    if (loadingRef.current || !hasMore || isLoading) return;

    // Debounce pour éviter les appels multiples
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (loadingRef.current || !hasMore || isLoading) return;
      
      loadingRef.current = true;
      Promise.resolve(onLoadMore?.()).finally(() => {
        loadingRef.current = false;
      });
    }, debounceMs);
  }, [onLoadMore, hasMore, isLoading, debounceMs]);

  // Observer pour le chargement infini
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const scrollContainer = scrollContainerRef?.current;

    if (!sentinel || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && hasMore && !isLoading && !loadingRef.current) {
          handleLoadMore();
        }
      },
      {
        root: scrollContainer || null,
        rootMargin: "100px 0px", // Réduit de 300px à 100px pour éviter le chargement trop anticipé
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [hasMore, isLoading, handleLoadMore, scrollContainerRef]);

  // Cas liste vide
  if (items.length === 0 && !isLoading) {
    return emptyComponent || null;
  }

  return (
    <div className={className}>
      {/* Grille des éléments */}
      <div className={gridClassName}>
        {items.map((item, index) => renderItem(item, index))}
      </div>

      {/* Sentinel pour le chargement infini */}
      {hasMore && (
        <div ref={sentinelRef} className="h-4 w-full" aria-hidden="true" />
      )}

      {/* Indicateur de chargement */}
      {isLoading && (
        <div className="flex justify-center py-4">{loadingComponent}</div>
      )}
    </div>
  );
};

export default InfiniteScrollGrid;
