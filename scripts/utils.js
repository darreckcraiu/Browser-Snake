export function coordToString(coord) {
  return `${coord.y}_${coord.x}`;
}
export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}