import { getRandomArbitrary } from '../utils.js';
import AIState from './ai-state.js'

export default class WanderState extends AIState {
    name = "WANDER";
    
    enter(controller) {
        const randomNum = getRandomArbitrary(0,2);
        if (randomNum === 0) {
            controller.setDesiredDirection("rightDir");
        }
        else {
            controller.setDesiredDirection("upDir");
        }
    }

    update(controller) {
        const sensors = controller.sensors;

        if (sensors.getFoodVisible()) {
            controller.requestState("CHASE_FOOD");
            //controller.setDesiredDirection(sensors.getDirectionToFood());
            return;
        }
        else {
            const randomNum = getRandomArbitrary(0,2);
            if (randomNum === 0) {
                controller.setDesiredDirection("rightDir");
            }
            else {
                controller.setDesiredDirection("upDir");
            }
        }

    }

    exit(controller) {}
}