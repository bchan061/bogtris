const app = new PIXI.Application({
    width: 480,
    height: 480
})

PIXI.loader
    .add("assets/block.svg")
.load(init)

function init() {
    document.getElementById("gameDiv").appendChild(app.view)

    let game = new Game(app)

    app.ticker.add(
        (dt) => game.update(dt)
    )
}
