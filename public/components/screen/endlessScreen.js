class EndlessScreen extends Screen {
    constructor(application, game) {
        super(application, game)

        this.playfield = new Playfield(this, new PIXI.Point(0, 0))
        let input = new Input(this.playfield)
        this.playfield.setInput(input)
        this.game.inputDelegator.addInput(input)
        this.stage.addChild(this.playfield.stage)
    }

    /**
     * Sets the input delegator for the game.
     */
    setInputDelegator(inputDelegator) {
        this.inputDelegator = inputDelegator
    }

    sendGarbage(sender, amount) {
        /* Ignore garbage. */
    }

    /**
     * Updates the game.
     * @param {number} delta 
     * @param {number} elapsed 
     */
    update(delta, elapsed) {
        this.playfield.update(delta, elapsed)
        this.game.inputDelegator.update(delta, elapsed)
    }

    detach() {
        super.detach()
        this.stage.removeChild(this.playfield.stage)
        this.game.inputDelegator.removeInput(this.playfield.input)
    }
}