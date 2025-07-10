import { rows, cols, foodColor, playerControls, gamemode, gameContainerStyles, numOfPlayers, gamemodeDescriptionMap } from "./config.js";
import { scaleFonts } from "./grid.js";

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
function configurePlayerRepDivs(snakes) {
  const sizingNum = gameContainerStyles.width / 12; //for sizing that comes next

  //specific to each snake
  snakes.forEach((snake, i) => {
    if (i < playerControls.length) {
      const playerRepDiv = document.querySelector(`.player${i + 1}-rep-div`);
      assignCellStyles(playerRepDiv, snake.cellStyle);
      playerRepDiv.style.width = `${sizingNum}px`;
      playerRepDiv.style.height = `${sizingNum}px`;
    }
  });

  //general for all player rep divs
  const playerRepDivs = document.querySelectorAll('.player-rep-div');
  playerRepDivs.forEach(div => {
    div.style.display = 'flex';
    div.style.alignItems = 'center';      // vertical centering
    div.style.justifyContent = 'center';  // horizontal centering
  });
}
function centerControlKeyDivText() {
  const controlGrids = document.querySelectorAll('.controlkeys-grid');
  controlGrids.forEach(grid => {
    const controlDivs = grid.querySelectorAll('div');

    controlDivs.forEach(div => {
      div.style.display = 'flex';
      div.style.alignItems = 'center';      // vertical centering
      div.style.justifyContent = 'center';  // horizontal centering
    });
  });
}
//generates the html for the controls UI
export function generateControlsUI(snakes) {
  let controlsUIHTML = ``;
  //create the div html for each player
  let num = numOfPlayers;
  if (numOfPlayers > playerControls.length)
    num = playerControls.length;
  for (let i = 0; i < num; i++) {
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
      <div class="player-controls-container">
        <div class="player${i + 1}-rep-div player-rep-div"></div>
        <div style="pointer-events: none;">-</div>
        <div class="controlkeys-grid">
          <div class='title-text' style="grid-row: 1; grid-column: 2;">${up}</div>
          <div class='title-text' style="grid-row: 2; grid-column: 1;">${left}</div>
          <div class='title-text' style="grid-row: 2; grid-column: 2;">${down}</div>
          <div class='title-text' style="grid-row: 2; grid-column: 3;">${right}</div>
        </div>
      </div>
      `;
  }
  document.querySelector('.right-panel').innerHTML = controlsUIHTML;

  //assign styles and size to the player rep divs
  const sizingNum = gameContainerStyles.width / 12; //for sizing that comes next

  //assign the size of each grid cols and rows
  const playerControlsContainers = document.querySelectorAll('.player-controls-container');
  playerControlsContainers.forEach(container => {
    const controlKeysGrids = container.querySelectorAll('.controlkeys-grid');
      controlKeysGrids.forEach(grid => {
        grid.style.gridTemplateColumns = `repeat(3,${sizingNum}px)`;
        grid.style.gridTemplateRows = `repeat(2,${sizingNum}px)`;        
    });
  });

  configurePlayerRepDivs(snakes);
  centerControlKeyDivText();
  scaleFonts();
}
//generates the html for the controls UI
export function generateScoresUI(snakes) {
  let scoresUIHTML = ``;
  //create the div html for each player
  let num = numOfPlayers;
  if (numOfPlayers > playerControls.length)
    num = playerControls.length;
  for (let i = 0; i < num; i++) {
    scoresUIHTML+=
      `      
        <div class="player${i + 1}-rep-div player-rep-div subtitle-text">1</div>      
      `;
  }  
  const playerScoresDiv = document.getElementById('player-scores-div');
  playerScoresDiv.innerHTML = scoresUIHTML
  
  //assign styles and size to the player rep divs
  const sizingNum = gameContainerStyles.width / 12; //for sizing that comes next

  snakes.forEach((snake, i) => {
    if (i < playerControls.length) {
      const playerRepDiv = document.querySelector(`.player${i + 1}-rep-div`);
      assignCellStyles(playerRepDiv, snake.cellStyle);
      playerRepDiv.style.width = `${sizingNum}px`;
      playerRepDiv.style.height = `${sizingNum}px`;
    }
  });

  configurePlayerRepDivs(snakes);
  scaleFonts();
}
//changes background color and border color and radius
export function assignCellStyles(cell, styles) {
  cell.style.backgroundColor = styles.backgroundColor;
  cell.style.borderColor = styles.borderColor;
  cell.style.borderRadius = styles.borderRadius;
}
export function assignGamemodeText() {
  const gamemodeTitle = document.getElementById('gamemode-title');
  gamemodeTitle.textContent = gamemode;
  gamemodeTitle.style.color = 'yellow';
  const gamemodeDescription = document.getElementById('gamemode-description');
  gamemodeDescription.textContent = gamemodeDescriptionMap.get(gamemode);
  
}
export function updatePlayerScoreDiv(snakeID, score) {
  const playerScoresDiv = document.getElementById('player-scores-div');
  const playerDiv = playerScoresDiv.querySelector(`.player${snakeID}-rep-div`);
  playerDiv.textContent = score;
}
export function disableButtons() {
  //change the selected playerCount button
  const playerCountButtonsContainer = document.getElementById('playercount-buttons-container');
  const playerCountButtons = playerCountButtonsContainer.querySelectorAll('button');
  playerCountButtons.forEach(button => {
    if (parseInt(button.textContent) === numOfPlayers) {
      button.classList.add('selected-button');
    }
  });

  //change the selected gamemode button
  const gamemodeButtonsContainer = document.getElementById('gamemode-buttons-container');
  const gamemodeButtons = gamemodeButtonsContainer.querySelectorAll('.primary-gamemode-button');
  gamemodeButtons.forEach(button => {
    if (button.textContent === gamemode) {
      button.classList.add('selected-button');
    }
  });
}