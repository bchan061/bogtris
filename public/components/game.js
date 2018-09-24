/**
 * The main game.
 */
class Game {
    constructor(application) {
        this.application = application
        this.board = new Board(this)
        this.tetrominoes = new Tetrominoes()
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
    }

    /**
     * Renders.
     */
    render() {
        this.board.update()
    }
}