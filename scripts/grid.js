import { rows, cols, cellStyles, gameContainerStyles } from "./config.js";
import { initializeUI } from "./ui.js";

export default class Grid {
  array = [];

  constructor() {
    for (let i = 0; i < rows; i++) {
      this.array[i] = [];
      for (let j = 0; j < cols; j++) {
        this.array[i][j] = `${i}_${j}`;
      }
    }
  }

  setupGrid() {
  const container = document.querySelector('.game-grid');

  // Apply container styles
  Object.assign(container.style, {
    display: 'grid',
    width: `${gameContainerStyles.width}px`,
    height: `${gameContainerStyles.height}px`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gridTemplateColumns: `repeat(${cols}, 1fr)`
  });

  // Generate grid cell HTML
  let gridHTML = '';
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      gridHTML += `<div id="${this.array[i][j]}" class="js-grid-cell" style='display: flex'>
        <div style='width: 100%; height: 100%'></div>
      </div>`;
    }
  }
  container.innerHTML = gridHTML;

  // Apply styles to each grid cell
  const cells = document.querySelectorAll('.js-grid-cell');
  cells.forEach(cell => {
    Object.assign(cell.style, {
      backgroundColor: cellStyles.backgroundColor,
      border: cellStyles.border
    });
  });
}

}

initializeUI();