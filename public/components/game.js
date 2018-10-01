/**
 * The main game.
 */
class Game {    
    constructor(application) {
        this.application = application
        this.board = new Board(this)
        this.tetrominoes = new Tetrominoes()
        this.randomGenerator = new RandomGenerator(this.tetrominoes)
        this.elapsed = 0

        this.getNextTetromino()

        this.tetrominoes.lTetromino.logBox()
        this.tetrominoes.lTetromino.rotateRight()
        this.tetrominoes.lTetromino.logBox()
        this.tetrominoes.lTetromino.rotateRight()
        this.tetrominoes.lTetromino.logBox()
        this.tetrominoes.lTetromino.rotateRight()
        this.tetrominoes.lTetromino.logBox()
        this.tetrominoes.lTetromino.rotateRight()
        this.tetrominoes.lTetromino.logBox()
    }

    /**
     * Sets the game's input.
     * @param {object} input the Input object
     */
    setInput(input) {
        this.input = input
    }

    /**
     * Gets the next tetromino in the queue
     */
    getNextTetromino() {
        this.currentTetromino = this.randomGenerator.popFromQueue()
        this.tetrominoLocation = this.tetrominoes.getSpawningLocation(this.currentTetromino, this.board)
    }

    /**
     * Tries to move the tetromino in that direction.
     * Returns if succeeded.
     * @param {number} x the relative x displacement
     * @param {number} y the relative y displacement
     */
    tryMove(x, y) {
        if (
            this.board.tetrominoCollides(
                this.currentTetromino,
                this.tetrominoLocation.x + x,
                this.tetrominoLocation.y + y
            )
        ) {
            return false
        } else {
            this.tetrominoLocation.x += x
            this.tetrominoLocation.y += y
            return true
        }
    }

    /**
     * Tries to rotate the tetromino in that direction.
     * Returns if succeeded.
     * @param {boolean} clockwise whether to rotate the tetromino clockwise or not
     */
    tryRotate(clockwise) {
        /*
          Thankfully, the game is synchronous, so we can just rotate the tetromino
          and rotate it back if it won't work.
        */

        if (clockwise) {
            this.currentTetromino.rotateRight()
        } else {
            this.currentTetromino.rotateLeft()
        }

        if (
            this.board.tetrominoCollides(
                this.currentTetromino,
                this.tetrominoLocation.x,
                this.tetrominoLocation.y
            )
        ) {
            if (clockwise) {
                this.currentTetromino.rotateLeft()
            } else {
                this.currentTetromino.rotateRight()
            }

            return false
        }

        return true
    }

    /**
     * Soft drops the tetromino down.
     */
    softDropTetromino() {

    }

    /**
     * Hard drops the tetromino down.
     */
    hardDropTetromino() {
        while (
            !this.board.tetrominoCollides(
                this.currentTetromino,
                this.tetrominoLocation.x,
                this.tetrominoLocation.y + 1
            )
        ) {
            this.tetrominoLocation.y += 1
        }

        this.board.placeTetromino(this.currentTetromino, this.tetrominoLocation.x, this.tetrominoLocation.y)
        this.getNextTetromino()
    }

    /**
     * Attempts to hold the current piece.
     * Returns whether it is allowed or not.
     */
    hold() {
        // TODO: implement hold
        this.getNextTetromino()
    }

    /**
     * Updates the game.
     * @param {number} delta the delta percentage
     */
    update(delta, elapsed) {
        this.elapsed += elapsed / 1000;

        if (this.elapsed >= 0.25) {
            this.elapsed -= 0.25

            if (
                this.board.tetrominoCollides(
                    this.currentTetromino,
                    this.tetrominoLocation.x,
                    this.tetrominoLocation.y + 1
                )
            ) {
                this.board.placeTetromino(this.currentTetromino, this.tetrominoLocation.x, this.tetrominoLocation.y)
                this.getNextTetromino()
            } else {
                this.tetrominoLocation.y += 1
            }
        }

        this.input.update(delta, elapsed)

        this.board.update()
        this.board.renderTetromino(this.currentTetromino, this.tetrominoLocation)

        this.render()
    }

    /**
     * Renders.
     */
    render() {

    }
}