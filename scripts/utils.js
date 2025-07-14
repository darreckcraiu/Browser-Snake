import { rows, cols, foodColor } from "./config.js";

export function coordToString(coord) {
  return `${coord.y}_${coord.x}`;
}
//returns a random coordinate that is valid with the rows and cols
export function randomCoord() {
  return {
    y: Math.floor(Math.random() * (rows)),
    x: Math.floor(Math.random() * (cols))
  }
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
export function drawApple(coord) {
  const cell = document.getElementById(coordToString(coord));
  const innerDiv = cell.querySelector('div');
  innerDiv.style.backgroundColor = foodColor;
  innerDiv.style.borderColor = foodColor;
  innerDiv.style.borderRadius = '50%';
}
export function inSet(coord, set) {
  coord = coordToString(coord);
  return set.has(coord);
}
export function coordsEqual(coord1, coord2) {
  return (coord1.y === coord2.y && coord1.x === coord2.x);
}
//changes background color and border color and radius
export function assignCellStyles(cell, styles) {
  cell.style.backgroundColor = styles.backgroundColor;
  cell.style.borderColor = styles.borderColor;
  cell.style.borderRadius = styles.borderRadius;
}
export function updatePlayerScoreDiv(snakeID, score) {
  const playerScoresDiv = document.getElementById('player-scores-div');
  const playerDiv = playerScoresDiv.querySelector(`.player${snakeID}-rep-div`);
  playerDiv.textContent = score;
}