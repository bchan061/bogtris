const app = new PIXI.Application({
    width: 480,
    height: 480
})

Sounds.init()

PIXI.loader
    .add("assets/block.svg")
    .add("assets/grid.svg")
.load(init)

function init() {
    document.getElementById("gameDiv").appendChild(app.view)

    let game = new Game(app)
    let input = new Input(game)

    game.setInput(input)

    window.onkeydown = (keycode) => input.onKeyDown(keycode.which)
    window.onkeyup = (keycode) => input.onKeyUp(keycode.which)

    app.ticker.add(
        (dt) => game.update(dt, app.ticker.elapsedMS / 1000)
    )
}
