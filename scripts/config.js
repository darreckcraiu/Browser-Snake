//get settings and certain other variables from localstorage
const settings = JSON.parse(localStorage.getItem("settings") || '{}');
export const playermode = localStorage.getItem('playermode') || 'SINGLEPLAYER'; //singleplayer is the default

//default settings values
const defaultRows = 12;
const defaultCols = 12;
const defaultWidth = 650;
const defaultHeight = 650;

export const rows = settings && Number(settings.rows) || defaultRows;
export const cols = settings && Number(settings.cols) || defaultCols;
export const snakeArrSize = 500;
export const snakeColor = 'rgb(145, 255, 123)';
export const foodColor = 'rgb(255, 123, 123)';
export const gameContainerStyles = {
  width: settings && Number(settings.width) || defaultWidth,
  height: settings && Number(settings.height) || defaultHeight
};
export const cellStyles = {
  color: 'rgb(24, 24, 24)',
  border: '1px solid rgba(118, 250, 255, 0.44)'
}
export const gridBorderColor = 'rgb(255, 255, 255)';
export const gameloopInterval = window.innerWidth > 1000 ? 120 : 150;

//save settings to local storage
localStorage.setItem('settings', JSON.stringify({
  rows: rows,
  cols: cols,
  width: gameContainerStyles.width,
  height: gameContainerStyles.height
}));