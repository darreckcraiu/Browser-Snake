export default class AISensors {
    update(snakeHead, applePosition) {
        this.snakeHead = snakeHead;
        this.applePosition = applePosition;
    }

    getFoodVisible() {
        const head = this.snakeHead;
        const apple = this.applePosition;

        return head.x === apple.x || head.y === apple.y;
    }

    getDirectionToFood() {
        const head = this.snakeHead;
        const apple = this.applePosition;

        if (head.x === apple.x) {
            return head.y >= apple.y ? "upDir" : "downDir";
        }

        if (head.y === apple.y) {
            return head.x >= apple.x ? "leftDir" : "rightDir";
        }

        return null;
    }
}