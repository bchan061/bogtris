const app = new PIXI.Application({
    width: 320,
    height: 480
})

document.body.appendChild(app.view)

let game = new Game(app)

app.ticker.add(
    (dt) => game.update(dt)
)
