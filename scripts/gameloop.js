import { rows,cols, snakeArrSize, gameloopInterval, foodColor } from "./config.js";
import Grid from "./grid.js";
import Snake from "./snake.js";
import { coordToString, handleDirection } from "./utils.js";

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

//Handle special cases for mobile vs desktop
if (window.innerWidth < 1000) {
  //hide for mobile
  const toHide = document.querySelectorAll('.hidden-on-mobile');
  toHide.forEach(element => {
    element.style.display = 'none';
  });

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
        handleDirection("rightDir", snake.dir, snake);
        lastDirectionTime = now;
      } else if (dx < -20 && now - lastDirectionTime > directionCooldown) {
        handleDirection("leftDir", snake.dir, snake);
        lastDirectionTime = now;
      }
    } else {
      if (dy > 20 && now - lastDirectionTime > directionCooldown) {
        handleDirection("downDir", snake.dir, snake);
        lastDirectionTime = now;
      } else if (dy < -20 && now - lastDirectionTime > directionCooldown) {
        handleDirection("upDir", snake.dir, snake);
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
        handleDirection('rightDir', snake.dir, snake);
      } else if (deltaX < -30) {
        handleDirection('leftDir', snake.dir, snake);
      }
    } else {
      if (deltaY > 30) {
        handleDirection('downDir', snake.dir, snake);
      } else if (deltaY < -30) {
        handleDirection('upDir', snake.dir, snake);
      }
    }
  }, false);
  
}
else {
  //hide for desktop
  const toHide = document.querySelectorAll('.hidden-on-desktop');
  toHide.forEach(element => {
    element.style.display = 'none';
  });

  //Event listener for wasd and arrow keys
  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    const currentDir = snake.dir;

    if ((key === 'w' || event.key === 'ArrowUp')) {
      handleDirection('upDir', currentDir, snake);
    } else if (key === 's' || event.key === 'ArrowDown') {
      handleDirection('downDir', currentDir, snake);
    } else if (key === 'a' || event.key === 'ArrowLeft') {
      handleDirection('leftDir', currentDir, snake);
    } else if (key === 'd' || event.key === 'ArrowRight') {
      handleDirection('rightDir', currentDir, snake);
    }
  });
}