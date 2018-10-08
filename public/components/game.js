/**
 * The main game.
 */
class Game {
    constructor(application) {
        this.playfields = []
        this.application = application
        this.inputDelegator = new InputDelegator(this)

        let playfieldOne = new Playfield(this, new PIXI.Point(0, 0))
        let inputOne = new Input(playfieldOne)
        this.inputDelegator.addInput(inputOne)
        playfieldOne.setInput(inputOne)
        this.addPlayfield(playfieldOne)

        let playfieldTwo = new Playfield(this, new PIXI.Point(GraphicsConstants.SCREEN_WIDTH - 20 * GraphicsConstants.BLOCK_SIZE, 0))
        let inputTwo = new AIInput(playfieldTwo)
        this.inputDelegator.addInput(inputTwo)
        playfieldTwo.setInput(inputTwo)
        this.addPlayfield(playfieldTwo)
    }

    /**
     * Adds a playfield into the game.
     */
    addPlayfield(playfield) {
        this.playfields.push(playfield)
        this.application.stage.addChild(playfield.stage)
    }

    /**
     * Sends garbage to all boards besides the sender.
     * @param {object} sender the sender
     * @param {number} amount the amount of garbage
     */
    sendGarbage(sender, amount) {
        for (let i = 0; i < this.playfields.length; i++) {
            let playfield = this.playfields[i]
            if (playfield != sender) {
                playfield.board.createGarbage(amount)
            }
        }
    }

    /**
     * Sets the input delegator for the game.
     */
    setInputDelegator(inputDelegator) {
        this.inputDelegator = inputDelegator
    }

    /**
     * Updates the game.
     * @param {number} delta 
     * @param {number} elapsed 
     */
    update(delta, elapsed) {
        for (let i = 0; i < this.playfields.length; i++) {
            this.playfields[i].update(delta, elapsed)
        }
        this.inputDelegator.update(delta, elapsed)
    }
}