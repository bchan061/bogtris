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

function speedChange() {
    let selectSpeed = document.getElementById("speed")
    let playfield = game.screen.playfield
    if (playfield !== null) {
        playfield.instantDrop = false
        switch (selectSpeed.value) {
            case "fast":
                playfield.dropTimer.changeTickTime(Rules.DROP_TIMER_FAST)
                break;
            case "20g":
                playfield.instantDrop = true
                break;
            default:
                playfield.dropTimer.changeTickTime(Rules.DROP_TIMER_NORMAL)
                break;
        }
    }
}

function blockChange() {
    let selectSpeed = document.getElementById("block")
    let playfield = game.screen.playfield
    if (playfield !== null) {
        playfield.instantDrop = false
        switch (selectSpeed.value) {
            case "noborder":
                playfield.board.blockTexture = PIXI.loader.resources["assets/block2.svg"].texture
                break;
            default:
                playfield.board.blockTexture = PIXI.loader.resources["assets/block.svg"].texture
                break;
        }

        for (let y = 0; y < playfield.board.height; y++) {
            for (let x = 0; x < playfield.board.width; x++) {
                playfield.board.spriteBoard[y][x].sprite.setTexture(playfield.board.blockTexture)
            }
        }
    }
}

function clearGarbageTimeout() {
    clearInterval(timeoutID)
    timeoutID = null
}
