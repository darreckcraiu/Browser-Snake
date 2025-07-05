import { rows, cols, foodColor, cellStyles, numOfPlayers, playerControls } from "./config.js";
import { snakes } from "./gameloop-multiplayer.js";

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
export function hideMobileElements() {
  const toHide = document.querySelectorAll('.hidden-on-desktop');
    toHide.forEach(element => {
    element.style.display = 'none';
  });
}
export function hideDesktopElements() {
  const toHide = document.querySelectorAll('.hidden-on-mobile');
    toHide.forEach(element => {
    element.style.display = 'none';
  });
}
export function hideSinglePlayerElements() {
  const toHide = document.querySelectorAll('.hidden-on-multiplayer');
    toHide.forEach(element => {
    element.style.display = 'none';
  });
}
export function hideMultiplayerElements() {
  const toHide = document.querySelectorAll('.hidden-on-singleplayer');
    toHide.forEach(element => {
    element.style.display = 'none';
  });
}
export function generateControlsUI() {
  let controlsUIHTML = ``;
  //create the div html for each player
  for (let i = 0; i < numOfPlayers; i++) {
    let up, down, left, right;
    if (playerControls[i].up.toUpperCase() === 'ARROWUP') {
      up = '&#8593;';
      down = '&#8595;';
      left = '&#8592;';
      right = '&#8594;';
    }
    else {
      up = playerControls[i].up.toUpperCase();
      down = playerControls[i].down.toUpperCase();
      left = playerControls[i].left.toUpperCase();
      right = playerControls[i].right.toUpperCase();
    }
    controlsUIHTML+=
      `
      <div id="player-controls-container">
        <div id="player${i + 1}-rep-div"></div>
        <div>-</div>
        <div class="controlkeys-grid">
          <div style="grid-row: 1; grid-column: 2;">${up}</div>
          <div style="grid-row: 2; grid-column: 1;">${left}</div>
          <div style="grid-row: 2; grid-column: 2;">${down}</div>
          <div style="grid-row: 2; grid-column: 3;">${right}</div>
        </div>
      </div>
      `;
  }
  document.querySelector('.right-panel').innerHTML = controlsUIHTML;

  //assign style to the player rep divs
  snakes.forEach((snake, i) => {
    const playerRepDiv = document.getElementById(`player${i + 1}-rep-div`);
    assignCellStyles(playerRepDiv, snake.cellStyle);
  });
}
//changes background color and border color and radius
export function assignCellStyles(cell, styles) {
  cell.style.backgroundColor = styles.backgroundColor;
  cell.style.borderColor = styles.borderColor;
  cell.style.borderRadius = styles.borderRadius;
}