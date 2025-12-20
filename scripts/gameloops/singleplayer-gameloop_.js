import { rows,cols, snakeArrSize, gameloopInterval } from "../config.js";
import Snake from "../snake.js";
import { coordToString, handleDirection, randomCoord, inSet, drawApple } from "../utils.js";
import { universalGameSetup } from "../gameplaySetup.js";
import { numOfBots } from "../config.js";
import { snakeColor } from "../config.js";

const highscore = localStorage.getItem('highscore') !== null ?
localStorage.getItem('highscore') : 1;
document.getElementById('highscore').innerText = `HIGHSCORE: ${highscore}`;

universalGameSetup(); //run in each gameloop js file
instantiateSingleplayerControls();

//front of js array is filled with players while the rest with bots
let snakes = [];
for (let i = 0; i < numOfBots + 1; i++)
  snakes[i] = new Snake;

const playerSnake = snakes[0];

//give unique IDs and colors to each snake
snakes.forEach((snake, i) => {
  snake.cellStyle.backgroundColor = 'white';
  snake.cellStyle.borderColor = 'white';
});

playerSnake.cellStyle.backgroundColor = snakeColor;
playerSnake.cellStyle.borderColor = snakeColor;

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
  snakes.forEach((snake, i) => {
    //if the snake's head landed on the apple
    temp = snake.getCurrentHead();
    if (temp.y === appleCoord.y && temp.x === appleCoord.x) {
      appleCoord.y = -1;
      occupied.delete(coordToString(appleCoord));
      if (i === 0) {
        playerSnake.score++;
        document.getElementById('score').innerText = `SCORE: ${playerSnake.score}`;
        if (playerSnake.score > highscore)
          document.getElementById('highscore').innerText = `HIGHSCORE: ${playerSnake.score}`;
      }
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
  for (let i = 0; i < snakes.length; i++) {
    snakePtr = snakes[i];
    if (!snakePtr.alive)
      continue; //if snake is dead, continue the loop for the next snake

    for (let j = 0; j < snakes.length; j++) {
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
  
  if (!playerSnake.alive) {
      //stop main loop, show game over screen, and erase snake body piece by piece like an animation that accelerates as well
    clearInterval(intervalId); //stop the main game loop

    let timeoutInterval = 150;
    //recursive function
    function eraseTailWithAcceleration() {
      // this if statement only runs if the tail hasn't caught up to the head yet
      if (playerSnake.hasLength()) {
        playerSnake.eraseTail();
        playerSnake.advanceTailIndex();

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
    if (playerSnake.score > highscore)
      localStorage.setItem('highscore', `${playerSnake.score}`);
  }  
  
}, gameloopInterval);



//EVENT LISTENERS FOR KEY PRESSES

//esc key to stop game loop
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    clearInterval(intervalId);
    //display endscreen    
    const endscreen = document.querySelector('.endscreen');
    endscreen.style.display = 'flex';
    console.log('USER EXIT');
    if (playerSnake.score > highscore)
      localStorage.setItem('highscore', `${playerSnake.score}`);
  }
});

function instantiateSingleplayerControls() {
  //Handle special cases for mobile vs desktop
  if (window.innerWidth < 1000) {

    //Event listeners for joystick
    const base = document.getElementById("joystick-base");
    const knob = document.getElementById("joystick-knob");

    function getCenterCoords() {
      const rect = base.getBoundingClientRect();
      return {
        x: rect.width / 2,
        y: rect.height / 2
      };
    }

    let lastDirectionTime = 0;
    const directionCooldown = 20; // milliseconds
    
    knob.addEventListener("touchstart", e => e.preventDefault(), { passive: false });

    knob.addEventListener("touchmove", (e) => {
      e.preventDefault();

      const touch = e.touches[0];
      const baseRect = base.getBoundingClientRect();
      const touchX = touch.clientX - baseRect.left;
      const touchY = touch.clientY - baseRect.top;

      const center = getCenterCoords();
      const dx = touchX - center.x;
      const dy = touchY - center.y;

      const angle = Math.atan2(dy, dx);
      const distance = Math.min(Math.hypot(dx, dy), baseRect.width / 3);

      const offsetX = Math.cos(angle) * distance;
      const offsetY = Math.sin(angle) * distance;

      knob.style.left = `${center.x + offsetX}px`;
      knob.style.top = `${center.y + offsetY}px`;

      // Direction handling
      const now = Date.now();

      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 20 && now - lastDirectionTime > directionCooldown) {
          handleDirection("rightDir", playerSnake.dir, playerSnake);
          lastDirectionTime = now;
        } else if (dx < -20 && now - lastDirectionTime > directionCooldown) {
          handleDirection("leftDir", playerSnake.dir, playerSnake);
          lastDirectionTime = now;
        }
      } else {
        if (dy > 20 && now - lastDirectionTime > directionCooldown) {
          handleDirection("downDir", playerSnake.dir, playerSnake);
          lastDirectionTime = now;
        } else if (dy < -20 && now - lastDirectionTime > directionCooldown) {
          handleDirection("upDir", playerSnake.dir, playerSnake);
          lastDirectionTime = now;
        }
      }
    });

    knob.addEventListener("touchend", () => {
      // Return to center using CSS centering method
      knob.style.left = "50%";
      knob.style.top = "50%";
    });

    //Event listeners for swipe controls
    let touchStartX = 0;
    let touchStartY = 0; 

    document.addEventListener('touchstart', function (e) {
      const touch = e.changedTouches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    }, false);

    document.addEventListener('touchend', function (e) {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 30) {
          handleDirection('rightDir', playerSnake.dir, playerSnake);
        } else if (deltaX < -30) {
          handleDirection('leftDir', playerSnake.dir, playerSnake);
        }
      } else {
        if (deltaY > 30) {
          handleDirection('downDir', playerSnake.dir, playerSnake);
        } else if (deltaY < -30) {
          handleDirection('upDir', playerSnake.dir, playerSnake);
        }
      }
    }, false);
    
  }
  else {
    //Event listener for wasd and arrow keys
    document.addEventListener('keydown', (event) => {
      const key = event.key.toLowerCase();
      const currentDir = playerSnake.dir;

      if ((key === 'w' || event.key === 'ArrowUp')) {
        handleDirection('upDir', currentDir, playerSnake);
      } else if (key === 's' || event.key === 'ArrowDown') {
        handleDirection('downDir', currentDir, playerSnake);
      } else if (key === 'a' || event.key === 'ArrowLeft') {
        handleDirection('leftDir', currentDir, playerSnake);
      } else if (key === 'd' || event.key === 'ArrowRight') {
        handleDirection('rightDir', currentDir, playerSnake);
      }
    });
  }  
}