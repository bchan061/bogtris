/**
 * The main game.
 */
class Game {
    constructor(application) {
        this.application = application
        this.board = new Board(this)
    }
    /**
     * Updates the game.
     * @param {number} delta the delta percentage
     */
    update(delta) {
        this.render()
    }

    /**
     * Renders.
     */
    render() {

    }
}