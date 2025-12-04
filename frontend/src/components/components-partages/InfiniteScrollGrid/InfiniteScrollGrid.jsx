import { useRef, useEffect, useCallback } from "react";

/**
 * Composant InfiniteScrollGrid optimisé pour afficher une grille avec chargement infini.
 *
 * Caractéristiques:
 * - Utilise IntersectionObserver pour détecter quand charger plus
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
}) => {
  const sentinelRef = useRef(null);
  const loadingRef = useRef(false);

  // Callback stable pour charger plus
  const handleLoadMore = useCallback(() => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;

    Promise.resolve(onLoadMore?.()).finally(() => {
      loadingRef.current = false;
    });
  }, [onLoadMore, hasMore]);

  // Observer pour le chargement infini
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const scrollContainer = scrollContainerRef?.current;

    if (!sentinel || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          handleLoadMore();
        }
      },
      {
        root: scrollContainer || null,
        rootMargin: "300px 0px",
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
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
        <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />
      )}

      {/* Indicateur de chargement */}
      {isLoading && (
        <div className="flex justify-center py-4">{loadingComponent}</div>
      )}
    </div>
  );
};

export default InfiniteScrollGrid;
