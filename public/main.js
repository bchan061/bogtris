let windowWidth = window.innerWidth
let windowHeight = window.innerHeight

let width = GraphicsConstants.DEFAULT_SCREEN_WIDTH
let height = GraphicsConstants.DEFAULT_SCREEN_HEIGHT

if (windowWidth > windowHeight) {
    let scale = window.innerHeight / GraphicsConstants.DEFAULT_SCREEN_HEIGHT
    width = GraphicsConstants.DEFAULT_SCREEN_WIDTH * scale
    height = window.innerHeight
} else {
    let scale = window.innerWidth / GraphicsConstants.DEFAULT_SCREEN_WIDTH
    width = window.innerWidth
    height = GraphicsConstants.DEFAULT_SCREEN_HEIGHT * scale
}

GraphicsConstants.SCREEN_WIDTH = width
GraphicsConstants.SCREEN_HEIGHT = height

GraphicsConstants.updateBlockSize()

const app = new PIXI.Application({
    width: width,
    height: height
})

var game;

Sounds.init()

PIXI.loader
    .add("assets/block.svg")
    .add("assets/block2.svg")
    .add("assets/grid.svg")
    .add("assets/fonts/font.fnt")
.load(init)

function preventDefault(event, nextFunction) {
    event.preventDefault()
    event.stopPropagation()
    if (nextFunction != null) {
        nextFunction()
    }
    return false
}

function assignVirtualKey(element, inputDelegator, key) {
    element.onmousedown = (event) => preventDefault(event, inputDelegator.simulateKeyDown(key))
    element.ontouchstart = (event) => preventDefault(event, inputDelegator.simulateKeyDown(key))
    element.onmouseup = (event) => preventDefault(event, inputDelegator.simulateKeyUp(key))
    element.ontouchend = (event) => preventDefault(event, inputDelegator.simulateKeyUp(key))
    element.onmouseout = (event) => preventDefault(event, inputDelegator.simulateKeyUp(key))
}

function assignVirtualKeyBindings(inputDelegator) {
    let leftArrow = document.getElementById("leftArrow")
    let rightArrow = document.getElementById("rightArrow")
    let leftRotate = document.getElementById("leftRotate")
    let rightRotate = document.getElementById("rightRotate")
    let drop = document.getElementById("drop")
    let hardDrop = document.getElementById("hardDrop")

    assignVirtualKey(leftArrow, inputDelegator, "Left")
    assignVirtualKey(rightArrow, inputDelegator, "Right")
    assignVirtualKey(leftRotate, inputDelegator, "Rotate left")
    assignVirtualKey(rightRotate, inputDelegator, "Rotate right")
    assignVirtualKey(drop, inputDelegator, "Soft drop")
    assignVirtualKey(hardDrop, inputDelegator, "Hard drop")
    assignVirtualKey(hold, inputDelegator, "Hold")

    let virtualGamepad = document.getElementById("gamepad")

    virtualGamepad.oncontextmenu = (event) => preventDefault(event)
}

function init() {
    document.getElementById("gameDiv").appendChild(app.view)

    game = new Game(app)

    window.onkeydown = (keycode) => game.inputDelegator.onKeyDown(keycode.which)
    window.onkeyup = (keycode) => game.inputDelegator.onKeyUp(keycode.which)
    assignGamepads(game.inputDelegator)

    /* Test for mobile and add bindings if necessary. */
    if (/Mobi/.test(navigator.userAgent)) {
        assignVirtualKeyBindings(game.inputDelegator)
    } else {
        let gamepad = document.getElementById("gamepad")
        gamepad.style = "display: none;"
    }

    app.ticker.add(
        (dt) => game.update(dt, app.ticker.elapsedMS / 1000)
    )
}

function assignGamepads(inputDelegator) {
    window.addEventListener("gamepadconnected", function(e) {
        inputDelegator.addGamepad(e.gamepad)
        console.log("Gamepad " + e.gamepad.id + " connected")
    })
    window.addEventListener("gamepaddisconnected", function(e) {
        inputDelegator.removeGamepad(e.gamepad)
        console.log("Gamepad " + e.gamepad.id + " disconnected")
    })
}
