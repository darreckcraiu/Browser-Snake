import { snakeColor, snakeArrSize, rows, cols, cellStyles } from "./config.js";
import { coordToString } from "./utils.js";

export default class Snake {
  //holds the coords of the head and tail. (circular array)
  //initialized to hold pairs of 0
  coordsArr = Array.from({ length: snakeArrSize }, () => ({ y: 0, x: 0 }));

  dir = {y: 0, x: 0};
  nextDir = {y: 0, x: 0};
  headIndex = 0;
  tailIndex = 0;
  score = 1;
  alive = true;
  coordsSet = new Set(); //keep track of snake segment locations

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

  printHead() {
    const head = this.coordsArr[this.headIndex];
    const cell = document.getElementById(coordToString(head));
    cell.style.backgroundColor = snakeColor;
    cell.style.borderColor = snakeColor;
  }

  eraseTail() {
    //get the cell where tail is at and reset it visually
    const tail = this.coordsArr[this.tailIndex];
    const cell = document.getElementById(coordToString(tail));
    cell.style.backgroundColor = cellStyles.color;
    cell.style.border = cellStyles.border;
	}

  advanceTailIndex() {
    const coord = this.coordsArr[this.tailIndex];
		this.coordsSet.delete(coordToString(coord));
		this.tailIndex = (this.tailIndex + 1) % snakeArrSize;
	}

  inSet(coord) {
    coord = coordToString(coord);
    return this.coordsSet.has(coord);
  }

}