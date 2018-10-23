class EndlessScreen extends Screen {
    constructor(application, game) {
        super(application, game)

        this.playfield = new Playfield(this, new PIXI.Point(0, 0))
        let input = new Input(this.playfield)
        this.game.inputDelegator.addInput(input)

        
    }

    update(delta, elapsed) {

    }
}