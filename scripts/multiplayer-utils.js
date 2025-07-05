import { numOfPlayers, playerControls } from "./config.js";
import { assignCellStyles } from "./utils.js";
import { snakes } from "./gameloop-multiplayer.js";

export function generateControlsUI() {
  let controlsUIHTML = ``;
  //create the div html for each player
  for (let i = 0; i < playerControls.length; i++) {
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
    if (i < playerControls.length) {
      const playerRepDiv = document.getElementById(`player${i + 1}-rep-div`);
      assignCellStyles(playerRepDiv, snake.cellStyle);
    }
  });
}