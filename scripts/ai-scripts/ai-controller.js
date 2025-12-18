import WanderState from './wander-state.js';
import ChaseFoodState from './chase-food-state.js';

export default class AIController {
  constructor(sensors, config) {
    this.sensors = sensors;      // read-only world observations
    this.config = config;        // difficulty / tuning parameters

    this.states = {};
    this.currentState = null;
    this.pendingState = null;

    this.desiredDirection = null; // output for this tick

    this._initStates();
    this._setInitialState();
  }

  update() {}
  getDesiredDirection() {
    return this.desiredDirection;
  }

  requestState(stateName) {}

  transitionTo(stateName) {}
  _initStates() {}
  _setInitialState() {}

  setDesiredDirection(direction) {
    this.desiredDirection = direction;
  }

  getCurrentStateName() {
    return this.currentState;
  }
}


function headAndAppleShareCol(snakeHeadCoords, appleCoords) {
    return (snakeHeadCoords.x === appleCoords.x);
}

function headAndAppleShareRow(snakeHeadCoords, appleCoords) {
    return (snakeHeadCoords.y === appleCoords.y);
}

function directionToApple(snakeHeadCoords, appleCoords) {
    if (headAndAppleShareCol(snakeHeadCoords, appleCoords)) {
        if (snakeHeadCoords.y >= appleCoords.y) {
            return "up";
        }
        else {
            return "down";
        }
    }
    else if (headAndAppleShareRow(snakeHeadCoords, appleCoords)) {
        if (snakeHeadCoords.x >= appleCoords.x) {
            return "left";
        }
        else {
            return "right";
        }     
    }
    else {
        return null;
    }
}