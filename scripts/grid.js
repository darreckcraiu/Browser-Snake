import { rows, cols, cellStyles, gameContainerStyles, playermode, foodColor } from "./config.js";

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
    const playermodeButton = document.getElementById('playermode-button');

    // Toggle visibility of settings screen
    settingsScreen.classList.toggle('hidden');

    // Toggle button text
    settingsButton.textContent = settingsButton.textContent === 'Settings' ? 'BACK' : 'Settings';

    // Toggle visibility of multiplayer button
    playermodeButton.classList.toggle('hidden');
  });

  // for RESET HIGHSCORE button
  const highscoreButton = document.getElementById('reset-highscore-button');
  highscoreButton.addEventListener('click', () => {
    localStorage.setItem('highscore', 1);
    location.reload();
  });

  // for Update Grid button
  const applyChangesButton = document.querySelector('.apply-changes-button');
  applyChangesButton.addEventListener('click', () => {
    //get the values from the rows and cols sliders and change the grid based on them
    const rows = Number(document.getElementById('rows-slider').value);
    const cols = Number(document.getElementById('cols-slider').value);
    const width = Number(document.getElementById('UI-width-slider').value);
    const height = Number(document.getElementById('UI-height-slider').value);
    localStorage.setItem('settings', JSON.stringify({
      rows: rows,
      cols: cols,
      width: width,
      height: height
    }));
    location.reload();
  });

  // for Reset Grid button
  const resetToDefaultButton = document.querySelector('.reset-to-default-button');
  resetToDefaultButton.addEventListener('click', () => {
    localStorage.removeItem('settings');
    location.reload();
  });

  // for playermode button
  const playermodeButton = document.getElementById('playermode-button');
  if (playermode === 'SINGLEPLAYER')
    playermodeButton.textContent = 'PLAY MULTIPLAYER';
  else
    playermodeButton.textContent = 'PLAY SINGLEPLAYER';
  playermodeButton.addEventListener('click', () => {
    if (playermodeButton.textContent === 'PLAY SINGLEPLAYER')
      localStorage.setItem('playermode', 'SINGLEPLAYER');
    else
      localStorage.setItem('playermode', 'MULTIPLAYER');
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
  document.getElementById('UI-width-slider').value = gameContainerStyles.width;
  document.getElementById('UI-width-slider-textbox').value = gameContainerStyles.width;
  document.getElementById('UI-height-slider').value = gameContainerStyles.height;
  document.getElementById('UI-height-slider-textbox').value = gameContainerStyles.height;
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
  syncSliderWithTextbox('UI-width-slider', 'UI-width-slider-textbox');
  syncSliderWithTextbox('UI-height-slider', 'UI-height-slider-textbox');
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
        backgroundColor: cellStyles.color,
        border: cellStyles.border
      });
    });
  }
}

/* ---------------------- RUN INITIALIZATION ---------------------- */
initializeUI();