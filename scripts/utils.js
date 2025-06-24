export function coordToString(coord) {
  return `${coord.y}_${coord.x}`;
}
export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}
//takes in a direction, the current direction of the snake, and the snake object
export function handleDirection(arrowDir, currentDir, snake) {
  if (arrowDir === 'upDir' && currentDir.y !== 1) {
      snake.nextDir = { x: 0, y: -1 };
    } else if (arrowDir === 'downDir' && currentDir.y !== -1) {
      snake.nextDir = { x: 0, y: 1 };
    } else if (arrowDir === 'leftDir' && currentDir.x !== 1) {
      snake.nextDir = { x: -1, y: 0 };
    } else if (arrowDir === 'rightDir' && currentDir.x !== -1) {
      snake.nextDir = { x: 1, y: 0 };
    }
}