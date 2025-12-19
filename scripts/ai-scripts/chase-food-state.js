import AIState from './ai-state.js'

export default class ChaseFoodState extends AIState {
    name = "CHASE_FOOD";
    
    enter(controller) {

    }

    update(controller) {
        const sensors = controller.sensors;

        if (!sensors.getFoodVisible()) {
            controller.requestState("WANDER");
            return;
        }
        else {
            controller.setDesiredDirection(sensors.getDirectionToFood());
        }


    }

    exit(controller) {

    }
}