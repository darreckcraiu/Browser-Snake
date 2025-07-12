import { snakeColor, snakeArrSize, rows, cols, cellStyles } from "./config.js";
import { assignCellStyles, coordToString } from "./utils.js";

export default class Snake {
  //holds the coords of the head and tail. (circular array)
  //initialized to hold pairs of 0
  coordsArr = Array.from({ length: snakeArrSize }, () => ({ y: 0, x: 0 }));

  ID = -1; //to reference each snake uniquely
  dir = {y: 0, x: 0};
  nextDir = {y: 0, x: 0};
  headIndex = 0;
  tailIndex = 0;
  score = 1;
  alive = true;
  coordsSet = new Set(); //keep track of snake segment locations
  //the css styling of the snake segments (divs of the grid)
  cellStyle = {
    backgroundColor: snakeColor,
    borderColor: snakeColor,
    borderRadius: '0'
  };

  setCoordinatesOfSegment(coord, index) {
    this.coordsArr[index] = coord;
  }

  calculateNextHead() {
    const currentHead = this.getCurrentHead();
    return {
      y: ((currentHead.y + this.dir.y + rows) % rows),
      x: ((currentHead.x + this.dir.x + cols) % cols)
    }
  }

  getCurrentHead() {
    return this.coordsArr[this.headIndex];
  }

  getCurrentTail() {
    return this.coordsArr[this.tailIndex];
  }

  printHead() {
    const head = this.coordsArr[this.headIndex];
    const cell = document.getElementById(coordToString(head)); //behind the snake segment (border shows)
    const innerDiv = cell.querySelector('div'); //snake segment
    cell.style.borderColor = this.cellStyle.borderColor; //match border to snake's color

    assignCellStyles(innerDiv, this.cellStyle);
  }

  eraseTail() {
    //get the cell where tail is at and reset it visually
    const tail = this.coordsArr[this.tailIndex];
    const cell = document.getElementById(coordToString(tail)); //behind the snake segment (border shows)
    const innerDiv = cell.querySelector('div'); //snake segment
    cell.style.borderColor = cellStyles.borderColor; //reset borderColor to default
    assignCellStyles(innerDiv, cellStyles); //reset innerDiv to defaults
	}

  advanceTailIndex() {
    const coord = this.coordsArr[this.tailIndex];
		this.coordsSet.delete(coordToString(coord));
		this.tailIndex = (this.tailIndex + 1) % snakeArrSize;
	}

  reset() {
    this.coordsSet.clear();
    this.dir = {y: 0, x: 0};
    this.nextDir = {y: 0, x: 0};
    this.headIndex = 0;
    this.tailIndex = 0;
    this.score = 1;
    this.alive = true;
  }

  hasLength() {
    //if the tail index has passed ahead of the head index, there is no length. The first 2 positions after passing the head index are checked because in respawn gamemodes when 2 players kill each other on the same frame, checking only for the first position after the head spawn only one of the snakes and the other is never spawned in
    return this.tailIndex < ((this.headIndex + 1) % snakeArrSize)
    || this.tailIndex < ((this.headIndex + 2) % snakeArrSize);
  }

}