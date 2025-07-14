import { playermode, playerControls, gamemode, gameContainerStyles, numOfPlayers, gamemodeDescriptionMap } from "./config.js";
import { assignCellStyles } from "./utils.js";
import Grid from "./grid.js";
import { scaleFonts } from "./grid.js";

//this function is called early in every gameloop file
export function universalGameSetup() {
  //mobile/small screen devices
  if (window.innerWidth < 1000)
    hideDesktopElements();
  else
    hideMobileElements();

  if (playermode == 'SINGLEPLAYER') {
    hideMultiplayerElements();
  }
  else {
    hideSinglePlayerElements();
    disableButtons();
    assignGamemodeText();
    hideMobileElements();
  }

  //setup the game's grid
  const grid = new Grid(); //create grid  
  grid.setupGrid(); //render starting grid
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

function disableButtons() {
  //'disable' the selected playerCount button
  const playerCountButtonsContainer = document.getElementById('playercount-buttons-container');
  const playerCountButtons = playerCountButtonsContainer.querySelectorAll('button');
  playerCountButtons.forEach(button => {
    if (parseInt(button.textContent) === numOfPlayers) {
      button.classList.add('selected-button');
    }
  });

  //'disable' the selected gamemode button
  const buttonsDiv = document.getElementById(`${gamemode.toLowerCase()}-buttons-div`);
  const buttons = buttonsDiv.querySelectorAll('button');
  buttons.forEach(button => {
    button.classList.add('selected-button');
    //for the settings button, allow pointer events
    if (button.textContent == '⚙️')
      button.style.pointerEvents = 'auto';
  });
}
function hideMobileElements() {
  const toHide = document.querySelectorAll('.hidden-on-desktop');
    toHide.forEach(element => {
    element.style.display = 'none';
  });
}
function hideDesktopElements() {
  const toHide = document.querySelectorAll('.hidden-on-mobile');
    toHide.forEach(element => {
    element.style.display = 'none';
  });
}
function hideSinglePlayerElements() {
  const toHide = document.querySelectorAll('.hidden-on-multiplayer');
    toHide.forEach(element => {
    element.style.display = 'none';
  });
}
function hideMultiplayerElements() {
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
function assignGamemodeText() {
  const gamemodeTitle = document.getElementById('gamemode-title');
  gamemodeTitle.textContent = gamemode;
  gamemodeTitle.style.color = 'yellow';
  const gamemodeDescription = document.getElementById('gamemode-description');
  gamemodeDescription.textContent = gamemodeDescriptionMap.get(gamemode);  
}