/**
 * The main game.
 */
class Game {
    constructor(application) {
        this.application = application
    }
    /**
     * Updates the game.
     * @param {number} delta the delta percentage
     */
    update(delta) {
        console.log("Updating [" + delta + "]")
    }
}