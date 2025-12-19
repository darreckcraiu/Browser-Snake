export default class AIState {
  name = "AI_STATE";
  
  enter(controller) {} //set up and first step logic when entering this state 
  update(controller) {} //any logic that happens during the state
  exit(controller) {} //clean up logic for things like variables that should be reset when transitioning to a new state
}