import { rows, cols, cellStyles,  gridBorderColor, gameContainerStyles } from "./config.js";

//scale font of GAMEOVER
const endscreen = document.querySelector('.endscreen');
endscreen.style.fontSize = `${gameContainerStyles.width / 14}px`;

//scale font of Play Again
const retryButton = document.getElementById('retry-button');
retryButton.style.fontSize = `${gameContainerStyles.width / 28}px`;
retryButton.addEventListener('click', () => {
  location.reload();
});

//scale font of SCORE
const score = document.getElementById('score');
score.style.fontSize = `${gameContainerStyles.width / 16}px`;

//scale font of HIGHSCORE
const highscoreText = document.getElementById('highscore');
highscoreText.style.fontSize = `${gameContainerStyles.width / 16}px`;

export default class Grid {
  array = []; // will be a 2D array of IDs like "0_0", "0_1", etc. 

  constructor() {
    for (let i = 0; i < rows; i++) {
      this.array[i] = [];
      for (let j = 0; j < cols; j++) {
        this.array[i][j] = `${i}_${j}`;
      }
    }
  }

  setupGrid() {
    const temp = document.querySelector('.game-grid');
  
    // Apply grid container styles
    Object.assign(temp.style, {
      display: 'grid',
      width: `${gameContainerStyles.width}px`,
      height: `${gameContainerStyles.height}px`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      //border: '1px solid rgb(0, 0, 0)'
    });
    
    // Create cells
    let gridHTML = '';
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        gridHTML += 
        `
        <div id="${this.array[i][j]}" class="js-grid-cell"></div>    
        `;
      }
    }
    temp.innerHTML = gridHTML;

    // Apply styles to each cell
    const cells = document.querySelectorAll('.js-grid-cell');
    cells.forEach(cell => {
      Object.assign(cell.style, {
        backgroundColor: cellStyles.color,
        border: cellStyles.border
      });
    });
  }
}