//use the parameters saved on local storage if they exist and if not use the search bar parameters
const savedParams = localStorage.getItem("savedParams");
const params = new URLSearchParams(
  (savedParams !== null && savedParams !== "null") ? savedParams : window.location.search
)

export const rows = getValidNumber("rows", 15);
export const cols = getValidNumber("cols", 15);
export const snakeArrSize = 500;
export const snakeColor = 'rgb(145, 255, 123)';
export const foodColor = 'rgb(255, 123, 123)';
export const gameContainerStyles = {
  width: 500,
  height: 500
}
export const cellStyles = {
  color: 'rgb(24, 24, 24)',
  border: '1px solid rgba(118, 250, 255, 0.44)'
}
export const gridBorderColor = 'rgb(255, 255, 255)';
export const gameloopInterval = 100;

//returns a parameter if it is a number, else returns fallback
function getValidNumber(paramName, fallback) {
  const value = params.get(paramName);
  const num = Number(value);
  return value !== null && !isNaN(num) ? num : fallback;
}

if (rows != 15 || cols != 15) {
  localStorage.setItem(
    "savedParams", 
    `?rows=${rows}&cols=${cols}`);
}