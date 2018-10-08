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

Sounds.init()

PIXI.loader
    .add("assets/block.svg")
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

function init() {
    document.getElementById("gameDiv").appendChild(app.view)

    let game = new Game(app)

    window.onkeydown = (keycode) => game.inputDelegator.onKeyDown(keycode.which)
    window.onkeyup = (keycode) => game.inputDelegator.onKeyUp(keycode.which)

    /* Test for mobile and add bindings if necessary. */
    if (/Mobi/.test(navigator.userAgent)) {
        assignVirtualKeyBindings(input)
    } else {
        let gamepad = document.getElementById("gamepad")
        gamepad.style = "display: none;"
    }

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

    let virtualGamepad = document.getElementById("gamepad")

    virtualGamepad.oncontextmenu = (event) => preventDefault(event)
}
