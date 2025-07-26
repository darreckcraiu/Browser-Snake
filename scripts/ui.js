// Import configuration values for layout and gameplay
import { rows, cols, gameContainerStyles, playermode, lengthBattleScoreToWin } from "./config.js";

// Initialize and configure all UI-related functionality
export function initializeUI() {
  scaleEndscreenFont();
  setupButtons();
  scaleFonts();
  setupSliders();
  setDefaultSliderAndTextbox();
}

// Scales the "GAME OVER" font based on container width
function scaleEndscreenFont() {
  document.querySelector('.endscreen').style.fontSize = `${gameContainerStyles.width / 14}px`;
}

// Scales fonts for all elements with the title or subtitle classes
export function scaleFonts() {
  document.querySelectorAll('.title-text').forEach(text => {
    text.style.fontSize = `${gameContainerStyles.width / 16}px`;
  });
  document.querySelectorAll('.subtitle-text').forEach(text => {
    text.style.fontSize = `${gameContainerStyles.width / 26}px`;
  });
}

// Assigns behavior to all interactive buttons in the UI
function setupButtons() {
  [...document.getElementsByClassName('button')].forEach(btn => {
    btn.style.fontSize = `${gameContainerStyles.width / 28}px`;
  });

  document.getElementById('retry-button').addEventListener('click', () => location.reload());

  document.getElementById('reset-highscore-button').addEventListener('click', () => {
    localStorage.setItem('highscore', 1);
    location.reload();
  });

  document.querySelector('.apply-changes-button').addEventListener('click', () => {
    const isGeneral = !document.querySelector('.general-settings-div').classList.contains('hidden');
    if (isGeneral) {
      localStorage.setItem('settings', JSON.stringify({
        //+ converts the string to a number 
        rows: +document.getElementById('rows-slider').value,
        cols: +document.getElementById('cols-slider').value,
        width: +document.getElementById('UI-width-slider').value,
        height: +document.getElementById('UI-height-slider').value
      }));
    } else {
      localStorage.setItem('lengthBattleScoreToWin', +document.getElementById('lengthbattle-score-slider').value);
    }
    location.reload();
  });

  document.querySelector('.reset-to-default-button').addEventListener('click', () => {
    const key = document.querySelector('.general-settings-div').classList.contains('hidden')
      ? 'lengthBattleScoreToWin' : 'settings';
    localStorage.removeItem(key);
    location.reload();
  });

  const playermodeButton = document.getElementById('playermode-button');
  playermodeButton.textContent = playermode === 'SINGLEPLAYER' ? 'PLAY MULTIPLAYER' : 'PLAY SINGLEPLAYER';
  playermodeButton.addEventListener('click', () => {
    localStorage.setItem('playermode', playermodeButton.textContent.includes('SINGLE') ? 'SINGLEPLAYER' : 'MULTIPLAYER');
    location.reload();
  });

  document.querySelectorAll('#playercount-buttons-container .button').forEach(button => {
    button.addEventListener('click', () => {
      localStorage.setItem('numOfPlayers', +button.textContent);
      location.reload();
    });
  });

  document.querySelectorAll('#gamemode-buttons-container .primary-gamemode-button').forEach(button => {
    button.addEventListener('click', () => {
      localStorage.setItem('gamemode', button.textContent);
      location.reload();
    });
  });

  const generalSettingsButton = document.getElementById('settings-button');
  
  // Handle all settings buttons in a generic way
  document.querySelectorAll('.settings-button').forEach(button => {
    button.addEventListener('click', () => {
      toggleSettingsScreenVisibility(generalSettingsButton);
      const targetClass = button.dataset.target;
      toggleVisibleSettings([targetClass, 'universal-settings-buttons-div']);
    });
  });
}

// Sets up synchronization between sliders and textboxes for settings inputs
function setupSliders() {
  syncSliderWithTextbox('rows-slider', 'rows-slider-textbox');
  syncSliderWithTextbox('cols-slider', 'cols-slider-textbox');
  syncSliderWithTextbox('UI-width-slider', 'UI-width-slider-textbox');
  syncSliderWithTextbox('UI-height-slider', 'UI-height-slider-textbox');
  syncSliderWithTextbox('lengthbattle-score-slider','lengthbattle-score-slider-textbox');
}

// Keeps a slider and its textbox in sync
function syncSliderWithTextbox(sliderId, textboxId) {
  const slider = document.getElementById(sliderId);
  const textbox = document.getElementById(textboxId);
  slider.addEventListener('input', () => textbox.value = slider.value);
  textbox.addEventListener('input', () => {
    const val = +textbox.value;
    if (!isNaN(val) && val >= +slider.min && val <= +slider.max) {
      slider.value = val;
    }
  });
}

// Assigns default values to all sliders and their corresponding textboxes
function setDefaultSliderAndTextbox() {
  document.getElementById('rows-slider').value = rows;
  document.getElementById('rows-slider-textbox').value = rows;
  document.getElementById('cols-slider').value = cols;
  document.getElementById('cols-slider-textbox').value = cols;
  document.getElementById('UI-width-slider').value = gameContainerStyles.width;
  document.getElementById('UI-width-slider-textbox').value = gameContainerStyles.width;
  document.getElementById('UI-height-slider').value = gameContainerStyles.height;
  document.getElementById('UI-height-slider-textbox').value = gameContainerStyles.height;
  document.getElementById('lengthbattle-score-slider').value = lengthBattleScoreToWin;
  document.getElementById('lengthbattle-score-slider-textbox').value = lengthBattleScoreToWin;
}

// Toggles visibility of the settings screen and updates the button text
function toggleSettingsScreenVisibility(generalSettingsButton) {
  const settingsScreen = document.querySelector('.settings-screen');
  settingsScreen.classList.toggle('hidden');
  console.log('toggle')
  if (settingsScreen.classList.contains('hidden')) {
    generalSettingsButton.textContent = 'SETTINGS';
    document.getElementById('playermode-button').classList.toggle('hidden', false);
  }
  else {
    generalSettingsButton.textContent = 'BACK';
    document.getElementById('playermode-button').classList.toggle('hidden', true);
  }
}

// Show only settings sections that match the given allowed class names
function toggleVisibleSettings(allowedClasses) {
  const settingsScreen = document.querySelector('.settings-screen');
  const divs = settingsScreen.querySelectorAll(':scope > div');
  divs.forEach(div => {
    const shouldShow = allowedClasses.some(cls => div.classList.contains(cls));
    div.classList.toggle('hidden', !shouldShow);
  });
}