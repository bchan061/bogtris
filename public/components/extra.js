var timeoutID = null;

function addGarbage(amount) {
    if (game.screen.playfield !== null) {
        game.screen.playfield.garbageToAdd += amount
    }
}

function addGarbageTimeout(time) {
    if (timeoutID === null) {
        timeoutID = setInterval(() => { addGarbage(1) }, time * 1000)
    }
}

function clearGarbageTimeout() {
    clearInterval(timeoutID)
    timeoutID = null
}
