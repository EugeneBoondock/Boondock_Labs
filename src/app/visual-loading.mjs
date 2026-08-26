/**
 * @param {boolean} isNearViewport
 * @param {boolean} prefersReducedMotion
 */
export function shouldMountAnimatedVisual(
  isNearViewport,
  prefersReducedMotion,
) {
  return isNearViewport && !prefersReducedMotion;
}

/**
 * Once a costly visual enters its loading range, keep it mounted so returning
 * to the section never starts the iframe from a cold state again.
 * @param {boolean} wasMounted
 * @param {boolean} isNearViewport
 */
export function retainVisualAfterFirstEntry(wasMounted, isNearViewport) {
  return wasMounted || isNearViewport;
}
