import { rows, cols, cellStyles, gameContainerStyles } from "./config.js";

/* ---------------------- UI SCALING FUNCTIONS ---------------------- */

/**
 * Set the font size of the "GAME OVER" screen dynamically based on container width.
 */
function scaleEndscreenFont() {
  const endscreen = document.querySelector('.endscreen');
  endscreen.style.fontSize = `${gameContainerStyles.width / 14}px`;
}

/**
 * Scale the retry and settings button font size and attach click event listeners.
 */
function setupButtons() {
  const retryButton = document.getElementById('retry-button');
  retryButton.style.fontSize = `${gameContainerStyles.width / 28}px`;
  retryButton.addEventListener('click', () => {
    location.reload();
  });

  const settingsButton = document.getElementById('settings-button');
  settingsButton.style.fontSize = `${gameContainerStyles.width / 28}px`;
  settingsButton.addEventListener('click', () => {
    const settingsScreen = document.getElementsByClassName('settings-screen')[0];
    const isHidden = settingsScreen.style.display === "none" || settingsScreen.style.display === "";
    settingsScreen.style.display = isHidden ? "block" : "none";
  });
}

/**
 * Scale the font size of the SCORE and HIGHSCORE text.
 */
function scaleScoreFonts() {
  const score = document.getElementById('score');
  score.style.fontSize = `${gameContainerStyles.width / 16}px`;

  const highscore = document.getElementById('highscore');
  highscore.style.fontSize = `${gameContainerStyles.width / 16}px`;
}

/**
 * Initialize all UI element scaling and listeners.
 */
function initializeUI() {
  scaleEndscreenFont();
  setupButtons();
  scaleScoreFonts();
}

/* ---------------------- GRID CLASS ---------------------- */

export default class Grid {
  array = []; // 2D array of cell IDs (e.g., "0_0", "0_1", ...)

  constructor() {
    // Populate the 2D array with unique ID strings
    for (let i = 0; i < rows; i++) {
      this.array[i] = [];
      for (let j = 0; j < cols; j++) {
        this.array[i][j] = `${i}_${j}`;
      }
    }
  }

  /**
   * Create and style the game grid.
   */
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
        gridHTML += `<div id="${this.array[i][j]}" class="js-grid-cell"></div>`;
      }
    }
    container.innerHTML = gridHTML;

    // Apply styles to each grid cell
    const cells = document.querySelectorAll('.js-grid-cell');
    cells.forEach(cell => {
      Object.assign(cell.style, {
        backgroundColor: cellStyles.color,
        border: cellStyles.border
      });
    });
  }
}

/* ---------------------- RUN INITIALIZATION ---------------------- */
initializeUI();