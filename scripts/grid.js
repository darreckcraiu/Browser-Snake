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
 * Apply a shared font size to all buttons with the "button" class,
 * and attach individual event listeners to specific buttons.
 */
function setupButtons() {
  // Set font size for all buttons with class="button"
  const allButtons = document.getElementsByClassName('button');
  for (let i = 0; i < allButtons.length; i++) {
    allButtons[i].style.fontSize = `${gameContainerStyles.width / 28}px`;
  }

  // Individual behavior for retry button
  const retryButton = document.getElementById('retry-button');
  retryButton.addEventListener('click', () => {
    location.reload();
  });

  // Individual behavior for settings button
  const settingsButton = document.getElementById('settings-button');
  settingsButton.addEventListener('click', () => {
    const settingsScreen = document.querySelector('.settings-screen');
    settingsScreen.classList.toggle('hidden');
    console.log('clap');
    console.log('Toggled:', settingsScreen.classList.contains('hidden'));
  });

  // for RESET HIGHSCORE button
  const highscoreButton = document.getElementById('reset-highscore-button');
  highscoreButton.addEventListener('click', () => {
    localStorage.setItem('highscore', 1);
    location.reload();
  });

  // for Update Grid button
  const updateGridButton = document.querySelector('.update-grid-button');
  updateGridButton.addEventListener('click', () => {
    //get the values from the rows and cols sliders and change the grid based on them
    const rows = document.getElementById('rows-slider').value;
    const cols = document.getElementById('cols-slider').value;
    localStorage.setItem("savedParams", `?rows=${rows}&cols=${cols}`);
    location.reload();
  });  
}

function syncSliderWithTextbox(sliderId, textboxId) {
  const slider = document.getElementById(sliderId);
  const textbox = document.getElementById(textboxId);

  slider.addEventListener('input', () => {
    textbox.value = slider.value;
  })

  textbox.addEventListener('input', () => {
    const num = parseInt(textbox.value, 10); //treat the number as base 10
    if (!isNaN(num) && num >= slider.min && num <= slider.max) {
      slider.value = num;
    }
  })
}

function setDefaultSliderAndTextbox() {
  document.getElementById('rows-slider').value = rows;
  document.getElementById('rows-slider-textbox').value = rows;
  document.getElementById('cols-slider').value = cols;
  document.getElementById('cols-slider-textbox').value = cols;
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
  syncSliderWithTextbox('rows-slider', 'rows-slider-textbox');
  syncSliderWithTextbox('cols-slider', 'cols-slider-textbox');
  setDefaultSliderAndTextbox();
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