const app = new PIXI.Application({
    width: 480,
    height: 480
})

Sounds.init()

PIXI.loader
    .add("assets/block.svg")
    .add("assets/grid.svg")
.load(init)

function preventDefault(event, nextFunction) {
    event.preventDefault()
    event.stopPropagation()
    if (nextFunction != null) {
        nextFunction()
    }
    return false
}

function init() {
    document.getElementById("gameDiv").appendChild(app.view)

    let game = new Game(app)
    let input = new Input(game)

    game.setInput(input)

    window.onkeydown = (keycode) => input.onKeyDown(keycode.which)
    window.onkeyup = (keycode) => input.onKeyUp(keycode.which)

    assignVirtualKeyBindings(input)

    app.ticker.add(
        (dt) => game.update(dt, app.ticker.elapsedMS / 1000)
    )
}

function assignVirtualKey(element, input, key) {
    element.onmousedown = (event) => preventDefault(event, input.simulateKeyDown(key))
    element.ontouchstart = (event) => preventDefault(event, input.simulateKeyDown(key))
    element.onmouseup = (event) => preventDefault(event, input.simulateKeyUp(key))
    element.ontouchend = (event) => preventDefault(event, input.simulateKeyUp(key))
    element.onmouseout = (event) => preventDefault(event, input.simulateKeyUp(key))
}

function assignVirtualKeyBindings(input) {
    let leftArrow = document.getElementById("leftArrow")
    let rightArrow = document.getElementById("rightArrow")
    let leftRotate = document.getElementById("leftRotate")
    let rightRotate = document.getElementById("rightRotate")
    let drop = document.getElementById("drop")
    let hardDrop = document.getElementById("hardDrop")

    assignVirtualKey(leftArrow, input, "Left")
    assignVirtualKey(rightArrow, input, "Right")
    assignVirtualKey(leftRotate, input, "Rotate left")
    assignVirtualKey(rightRotate, input, "Rotate right")
    assignVirtualKey(drop, input, "Soft drop")
    assignVirtualKey(hardDrop, input, "Hard drop")
    assignVirtualKey(hold, input, "Hold")

    let gamepad = document.getElementById("gamepad")

    gamepad.oncontextmenu = (event) => preventDefault(event)
}
