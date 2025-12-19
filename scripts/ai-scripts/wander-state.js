import AIState from './ai-state.js'

export default class WanderState extends AIState {
    name = "WANDER";
    
    enter(controller) {}

    update(controller) {
        const sensors = controller.sensors;

        if (sensors.getFoodVisible()) {
            controller.requestState("CHASE_FOOD");
            controller.setDesiredDirection(sensors.getDirectionToFood());
            return;
        }
        else {
            controller.setDesiredDirection("right");
        }

    }

    exit(controller) {}
}