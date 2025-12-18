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