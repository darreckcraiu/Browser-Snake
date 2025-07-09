//get settings and certain other variables from localstorage
const settings = JSON.parse(localStorage.getItem("settings") || '{}');
export const playermode = localStorage.getItem('playermode') || 'SINGLEPLAYER'; //singleplayer is the default

//default grid settings values
const defaultRows = 12;
const defaultCols = 12;
const defaultWidth = 700;
const defaultHeight = 700;

export const rows = settings && Number(settings.rows) || defaultRows;
export const cols = settings && Number(settings.cols) || defaultCols;
export const snakeArrSize = 500;
export const snakeColor = 'rgb(145, 255, 123)';
export const foodColor = 'rgb(255, 73, 73)';
export const gameContainerStyles = {
  width: settings && Number(settings.width) || defaultWidth,
  height: settings && Number(settings.height) || defaultHeight
};
export const cellStyles = {
  border: '1px solid rgba(118, 250, 255, 0.44)', //for use in grid.js
  backgroundColor: 'rgb(24, 24, 24)',
  borderColor: 'rgba(118, 250, 255, 0.44)',
  borderRadius: '0'
}
export const gridBorderColor = 'rgb(255, 255, 255)';
export const gameloopInterval = window.innerWidth > 1000 ? 100 : 150;

//save settings to local storage
localStorage.setItem('settings', JSON.stringify({
  rows: rows,
  cols: cols,
  width: gameContainerStyles.width,
  height: gameContainerStyles.height
}));



//FOR MULTIPLAYER

//default multiplayer settings
const defaultNumOfPlayers = 4;
const defaultGamemode = 'LENGTH BATTLE';
const defaultLengthBattleScoreToWin = 10;

export const lengthBattleScoreToWin = localStorage.getItem('lengthBattleScoreToWin') || defaultLengthBattleScoreToWin;
export const gamemode = localStorage.getItem('gamemode') || defaultGamemode;
export const numOfPlayers = parseInt(localStorage.getItem('numOfPlayers')) || defaultNumOfPlayers;
export const playerControls = [
  { up: 'w', down: 's', left: 'a', right: 'd' }, // Player 0 (WASD)
  { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' }, // Player 1 (arrowkeys)
  { up: 'i', down: 'k', left: 'j', right: 'l' }, // Player 2 (IJKL)
  { up: 't', down: 'g', left: 'f', right: 'h' } // Player 3 (TFGH)
];
export const playerColors = [
  'rgb(145, 255, 123)',
  'rgb(0, 174, 255)',
  'rgb(255, 252, 46)',
  'rgb(75, 0, 196)'
]
export const gamemodeDescriptionMap = new Map([
  ['LENGTH BATTLE', `First snake to reach ${lengthBattleScoreToWin} score wins!`],
  ['DEATHMATCH', 'Last snake standing wins!']
]); 