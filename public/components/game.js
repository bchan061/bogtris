/**
 * The main game.
 */
class Game {
    constructor(application) {
        this.application = application
        this.board = new Board(this)
    }

    setInput(input) {
        this.input = input
    }

    /**
     * Updates the game.
     * @param {number} delta the delta percentage
     */
    update(delta) {
        this.render()
        console.log(this.input.keys["Hold"].isPressed())
    }

    /**
     * Renders.
     */
    render() {

    }
}