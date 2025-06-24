import { rows,cols, snakeArrSize, gameloopInterval, foodColor } from "./config.js";
import Grid from "./grid.js";
import Snake from "./snake.js";
import { coordToString, isTouchDevice } from "./utils.js";

const highscore = localStorage.getItem('highscore') !== null ?
localStorage.getItem('highscore') : 1;
document.getElementById('highscore').innerText = `HIGHSCORE: ${highscore}`;

const grid = new Grid(); //create grid

//render starting grid
grid.setupGrid();

const snake = new Snake(); //create snake

//used throughout for coordinate pairs
let temp = {
  y: -1,
  x: -1
}

//used throughout for the food piece
const appleCoord = {
  y: -1,
  x: -1
}

//random start for snake
temp.y = Math.floor(Math.random() * (rows));
temp.x = Math.floor(Math.random() * (cols));
snake.setCoordinatesOfSegment(temp, snake.headIndex);
snake.coordsSet.add(coordToString(temp));

//random start for food
do {
  appleCoord.y = Math.floor(Math.random() * (rows));
  appleCoord.x = Math.floor(Math.random() * (cols));
} while (snake.inSet(appleCoord))

//used throughout for getting divs
let cell;
//used for key press events
let hasMovedThisFrame = false;

//print food
cell = document.getElementById(coordToString(appleCoord));
cell.style.backgroundColor = foodColor;
cell.style.borderColor = foodColor;

//game loop
const intervalId = 
setInterval(() => {
  console.log('loop counter');
  hasMovedThisFrame = false;
  //respawn food if neccessary
  if (appleCoord.y === -1) {
    appleCoord.y = Math.floor(Math.random() * (rows));
    appleCoord.x = Math.floor(Math.random() * (cols));
    //verify new coord
    if (snake.inSet(appleCoord))
      appleCoord.y = -1;
    if (appleCoord.y >= 0) {
      //print food
      cell = document.getElementById(coordToString(appleCoord));
      cell.style.backgroundColor = foodColor;
      cell.style.borderColor = foodColor;
    }
  }

  //only erases from the grid visually
  snake.eraseTail();

  //check for food being eaten
  if (snake.coordsArr[snake.headIndex].y === appleCoord.y && snake.coordsArr[snake.headIndex].x === appleCoord.x) {
    appleCoord.y = -1;
    snake.score++;
    document.getElementById('score').innerText = `SCORE: ${snake.score}`;
    if (snake.score > highscore)
      document.getElementById('highscore').innerText = `HIGHSCORE: ${snake.score}`;
  }
  else {
    //this is skipped if the snake ate an apple
    snake.advanceTailIndex();
  }

  //calculate next head and whether it kills the snake or not
  snake.dir = snake.nextDir;
  temp = snake.calculateNextHead();
  if (snake.inSet(temp)) {
    snake.alive = false;
  }
  else {
    snake.coordsSet.add(coordToString(temp));
    snake.headIndex = (snake.headIndex + 1) % snakeArrSize; //advance head index
    snake.setCoordinatesOfSegment(temp, snake.headIndex); //update change in snake array
  }

  //print new head if snake is alive
  if (snake.alive)
    snake.printHead();
  else {
    //stop main loop, show game over screen, and erase snake body piece by piece like an animation that accelerates as well
    clearInterval(intervalId); //stop the main game loop

    let timeoutInterval = 150;
    //recursive function
    function eraseTailWithAcceleration() {
      // this if statement only runs if the tail hasn't caught up to the head yet
      if (snake.tailIndex !== (snake.headIndex + 1) % snakeArrSize) {
        snake.eraseTail();
        snake.advanceTailIndex();

        // Accelerate
        timeoutInterval = Math.max(timeoutInterval * 0.9, 30);

        setTimeout(eraseTailWithAcceleration, timeoutInterval);
      }
    }
    eraseTailWithAcceleration(); // Start it
    
    //display endscreen
    const endscreen = document.querySelector('.endscreen');
    endscreen.style.display = 'flex';
    console.log('DIED');
    if (snake.score > highscore)
      localStorage.setItem('highscore', `${snake.score}`);
  }
  
}, gameloopInterval);



//EVENT LISTENERS FOR KEY PRESSES
//key to stop game loop
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    clearInterval(intervalId);
    //display endscreen    
    const endscreen = document.querySelector('.endscreen');
    endscreen.style.display = 'flex';
    console.log('USER EXIT');
    if (snake.score > highscore)
      localStorage.setItem('highscore', `${snake.score}`);
  }
});

//Event listeners for either desktop or mobile
if (isTouchDevice()) {
  // Only add event listeners for mobile
  document.getElementById('up').addEventListener('click', () => {
    const currentDir = snake.dir;
    if (currentDir.y !== 1)
      snake.nextDir = { x: 0, y: -1 };
  });
  document.getElementById('down').addEventListener('click', () => {
    const currentDir = snake.dir;
    if (currentDir.y !== -1)
      snake.nextDir = { x: 0, y: 1 };
  });
  document.getElementById('left').addEventListener('click', () => {
    const currentDir = snake.dir;
    if (currentDir.x !== 1)
      snake.nextDir = { x: -1, y: 0 };
  });
  document.getElementById('right').addEventListener('click', () => {
    const currentDir = snake.dir;
    if (currentDir.x !== -1)
      snake.nextDir = { x: 1, y: 0 };
  });
}
else {
  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    const currentDir = snake.dir;

    if ((key === 'w' || event.key === 'ArrowUp') && currentDir.y !== 1) {
      snake.nextDir = { x: 0, y: -1 };
    } else if ((key === 's' || event.key === 'ArrowDown') && currentDir.y !== -1) {
      snake.nextDir = { x: 0, y: 1 };
    } else if ((key === 'a' || event.key === 'ArrowLeft') && currentDir.x !== 1) {
      snake.nextDir = { x: -1, y: 0 };
    } else if ((key === 'd' || event.key === 'ArrowRight') && currentDir.x !== -1) {
      snake.nextDir = { x: 1, y: 0 };
    }
  });
}