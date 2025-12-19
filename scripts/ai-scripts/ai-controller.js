import WanderState from './wander-state.js';
import ChaseFoodState from './chase-food-state.js';

//Methods prefixed with _ are internal helpers
export default class AIController {
        constructor(sensors, config) {
        this.sensors = sensors;      // read-only world observations
        this.config = config;        // difficulty / tuning parameters

        this.states = {};
        this.pendingState = null;

        this.desiredDirection = null; // output for this tick

        this._initStates();
        this._setInitialState();
    }

    update() {
        this.pendingState = null;
        this.desiredDirection = null;

        this.currentState.update(this);

        if (this.pendingState) {
            this.transitionTo(this.pendingState);
        }
    }

    getDesiredDirection() {
        return this.desiredDirection;
    }

    requestState(stateName) {
        this.pendingState = stateName;
    }

    transitionTo(stateName) {
        this.currentState.exit(this);
        this.currentState = this.states[stateName];
        this.currentState.enter(this);
    }

    _initStates() {
        this.states = {
            WANDER: new WanderState(),
            CHASE_FOOD: new ChaseFoodState()
        };
    }

    _setInitialState() {
        this.currentState = this.states.WANDER;
        this.currentState.enter(this);
    }

    setDesiredDirection(direction) {
        this.desiredDirection = direction;
    }

    getCurrentStateName() {
        return this.currentState.name;
    }

}