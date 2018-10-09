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
        

        this.aiGenetic = new AIGenetic(this)
    }

    /**
     * Adds a playfield into the game.
     */
    addPlayfield(playfield) {
        this.playfields.push(playfield)
        this.application.stage.addChild(playfield.stage)
    }

    /**
     * Removes a playfield from the game.
     * @param {*} playfield the playfield to remove
     */
    removePlayfield(playfield) {
        for (let i = 0; i < this.playfields.length; i++) {
            let potentialPlayfield = this.playfields[i]
            if (potentialPlayfield == playfield) {
                this.playfields.splice(i, 1)
                this.application.stage.removeChild(potentialPlayfield.stage)
            }
        }
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
                playfield.garbageToAdd += amount
            }
        }

        this.aiGenetic.acceptGarbage(amount)
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

        this.aiGenetic.update(delta, elapsed)
    }
}