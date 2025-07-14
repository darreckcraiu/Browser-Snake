console.log('multiplayer js file running...');
import { snakeArrSize, gameloopInterval, numOfPlayers, playerControls, playerColors, gameContainerStyles, rows, cols } from "./config.js";
import Grid from "./grid.js";
import Snake from "./snake.js";
import { coordsEqual, coordToString, handleDirection, randomCoord, inSet, hideMobileElements, hideSinglePlayerElements, drawApple, assignCellStyles, generateControlsUI, assignGamemodeText, generateScoresUI, updatePlayerScoreDiv, disableButtons } from "./utils.js";

//hide inappropriate elements from page
hideMobileElements();
hideSinglePlayerElements();

//disabled the selected buttons
disableButtons();

//title
assignGamemodeText();

const grid = new Grid(); //create grid

//render starting grid
grid.setupGrid();
//create snakes/players and add them to the snakes js array
let snakes = [];
for (let i = 0; i < numOfPlayers; i++)
  snakes[i] = new Snake;
//give unique IDs and colors to each snake
snakes.forEach((snake, i) => {
  snake.ID = i + 1; 
  snake.cellStyle.backgroundColor = playerColors[i] || 'white';
  snake.cellStyle.borderColor = playerColors[i] || 'white';
});

generateControlsUI(snakes);
generateScoresUI(snakes);

//use a js array like a queue to keep track of snakes that are dead
let deadSnakesQueue = [];
//set to keep track of occupied positions on the grid
let occupied = new Set();

//used throughout for different snakes
let snakePtr;
//used throughout for different coordinate pairs
let temp = {
  y: -1,
  x: -1
}
//used throughout for the food piece
let appleCoord = {
  y: -1,
  x: -1
}

//random start for each snake
snakes.forEach(snake => {
  do {
    temp = randomCoord();
  } while (occupied.has(coordToString(temp)));
  snake.setCoordinatesOfSegment(temp, snake.headIndex);
  snake.coordsSet.add(coordToString(temp));
  occupied.add(coordToString(temp));
});

//random start for the food
do {
  temp = randomCoord();
} while (occupied.has(coordToString(temp)));
appleCoord = temp;
occupied.add(coordToString(temp));

//print food
drawApple(appleCoord);

//game loop
let intervalId = 
setInterval(() => {
  console.log('loop counter');
  //respawn food if neccessary
  if (appleCoord.y === -1) {
    appleCoord = randomCoord();
    //verify new coord
    if (occupied.has(coordToString(appleCoord)))
      appleCoord.y = -1;
    if (appleCoord.y >= 0) {
      //print food
      drawApple(appleCoord);
    }
  }

  //VISUALLY erase tails of all alive or currently dying snakes
  snakes.forEach(snake => {
    if (snake.alive)
      snake.eraseTail();
    else if (snake.hasLength())
      snake.eraseTail();
  });

  //check for food being eaten
  snakes.forEach(snake => {
    //if the snake's head landed on the apple
    temp = snake.getCurrentHead();
    if (temp.y === appleCoord.y && temp.x === appleCoord.x) {
      appleCoord.y = -1;
      occupied.delete(coordToString(appleCoord));
      snake.score++;
      updatePlayerScoreDiv(snake.ID, snake.score);
    }
    else {
      //this is skipped for the snake that ate the apple
      //erase the tail from occupied and advance the tail index
      occupied.delete(coordToString(snake.getCurrentTail()));
      snake.advanceTailIndex();
    }
  });

  //calculate new heads and check if any snake just killed itself as a result
  snakes.forEach(snake => {
    if (snake.alive) {
      snake.dir = snake.nextDir; //update the snake's direction
      temp = snake.calculateNextHead();
      if (inSet(temp, snake.coordsSet)) {
        //if it hit itself
        snake.alive = false;
        deadSnakesQueue.push(snake);
      }
      else {
        //didn't hit itself
        occupied.add(coordToString(temp));
        snake.coordsSet.add(coordToString(temp)); //add new head to the snake's coords set
        snake.headIndex = (snake.headIndex + 1) % snakeArrSize; //advance head index
        snake.setCoordinatesOfSegment(temp, snake.headIndex); //update change in snake array
      }
    }
  });
  
  //check if any snakes killed each other and mark the dead ones
  //this loop will loop through the whole loop for each snake
  for (let i = 0; i < numOfPlayers; i++) {
    snakePtr = snakes[i];
    if (!snakePtr.alive)
      continue; //if snake is dead, continue the loop for the next snake

    for (let j = 0; j < numOfPlayers; j++) {
      if (i == j)
        continue; //continue this inner for loop to not compare the snake to itself
      //if the head of snakePtr makes contact with any part of snakes[j]
      if (snakes[j].alive && inSet(snakes[j].getCurrentHead(), snakePtr.coordsSet)) {
        snakes[j].alive = false;
        deadSnakesQueue.push(snakes[j]);
        //if their heads are what hit specifically. This extra check is to avoid a bug that lets one snake live anyway
        if (coordsEqual(snakePtr.getCurrentHead(), snakes[j].getCurrentHead())
          || coordsEqual(snakePtr.getCurrentHead(), snakes[j].coordsArr[snakes[j].headIndex - 1])) {
          snakePtr.alive = false;
          deadSnakesQueue.push(snakePtr);
        }
      }
    }
  }
  
  //print new heads for alive snakes
  snakes.forEach(snake => {
    if (snake.alive)
      snake.printHead();
  });
  
  //check for win (1 player left)
  if (numOfPlayers - deadSnakesQueue.length <= 1) {
    //stop main loop, show game over screen, and erase snake body piece by piece like an animation that accelerates as well
    clearInterval(intervalId); //stop the main game loop
    intervalId = null;

    let timeoutInterval = 150;
    //recursive function
    function eraseTailWithAcceleration() {
      // this if statement only runs if the tail hasn't caught up to the head yet
      snakes.forEach(snake => {
        if (!snake.alive && snake.hasLength()) {
          snake.eraseTail();
          snake.advanceTailIndex();

          // Accelerate
          timeoutInterval = Math.max(timeoutInterval * 0.9, 30);

          setTimeout(eraseTailWithAcceleration, timeoutInterval);
        }
      });
    }
    eraseTailWithAcceleration(); // Start it
    
    //get the winning snake
    let winnerSnake = -1;
    for (let i = 0; i < numOfPlayers; i++) {
      if (snakes[i].alive) {
        winnerSnake = snakes[i];
        break;
      }
    }

    //add in colored grid square of winner in endscreen
    if (winnerSnake !== -1) {
      const winnerDiv = document.getElementById('multiplayer-winner-div');
      winnerDiv.style.display = 'block';
      winnerDiv.style.width = `${gameContainerStyles.width / cols}px`;
      winnerDiv.style.height = `${gameContainerStyles.height / rows}px`;
      assignCellStyles(winnerDiv, winnerSnake.cellStyle);
    }
    else {
      //tie game
      const endText = document.getElementById('multiplayer-winner-text');
      endText.textContent = 'TIE GAME';
    }    

    //display endscreen
    const endscreen = document.querySelector('.endscreen');
    endscreen.style.display = 'flex';
  }
  
}, gameloopInterval);



//EVENT LISTENERS FOR KEY PRESSES
//key to stop game loop
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
    //tie game
    const endText = document.getElementById('multiplayer-winner-text');
    endText.textContent = 'TIE GAME';
    //display endscreen    
    const endscreen = document.querySelector('.endscreen');
    endscreen.style.display = 'flex';
    console.log('USER EXIT');
  }
});

// Event listener for player key presses
document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();

  playerControls.forEach((controls, index) => {
    const currentDir = snakes[index]?.dir; // Optional chaining in case snake doesn't exist
    if (!currentDir)  return; //like 'continue'

    if (key === controls.up.toLowerCase()) {
      handleDirection('upDir', currentDir, snakes[index]);
    } else if (key === controls.down.toLowerCase()) {
      handleDirection('downDir', currentDir, snakes[index]);
    } else if (key === controls.left.toLowerCase()) {
      handleDirection('leftDir', currentDir, snakes[index]);
    } else if (key === controls.right.toLowerCase()) {
      handleDirection('rightDir', currentDir, snakes[index]);
    }
  });
});