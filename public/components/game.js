/**
 * The main game.
 */
class Game {    
    constructor(application) {
        this.application = application
        this.board = new Board(this)
        this.tetrominoes = new Tetrominoes()
        this.randomGenerator = new RandomGenerator(this.tetrominoes)
        this.application.stage.addChild(this.randomGenerator.nextContainer)
        this.elapsed = 0

        this.dropTimer = new Timer(Rules.DROP_TIMER, this.perpetualDropTetromino.bind(this))
        this.dropActive = true
        this.inactiveTimer = new CountdownTimer(Rules.INACTIVE_TIMER, this.onInactivity.bind(this))
        this.spinClear = false
        this.rotations = 0

        this.holdContainer = new PIXI.Container()
        this.holdContainer.position.set(
            2 * GraphicsConstants.BLOCK_SIZE,
            2 * GraphicsConstants.BLOCK_SIZE
        )
        this.application.stage.addChild(this.holdContainer)
        this.holdTetromino = null
        this.blockHold = null

        this.getNextTetromino()
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
        this.inactiveTimer.reset()
        this.inactiveTimer.deactivate()
        this.rotations = 0
    }

    /**
     * Called on inactivity on the bottom of the board.
     * Automatically places the tetromino down.
     */
    onInactivity() {
        Sounds.forceDrop.play()
        this.board.placeTetromino(this.currentTetromino, this.tetrominoLocation.x, this.tetrominoLocation.y)
        this.droppedTetromino()
        this.getNextTetromino()
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
            this.inactiveTimer.deactivate()
            this.spinClear = false

            Sounds.move.play()

            return true
        }
    }

    /**
     * Tries to rotate the tetromino in that direction.
     * Returns if succeeded.
     * @param {boolean} clockwise whether to rotate the tetromino clockwise or not
     */
    tryRotate(clockwise) {
        if (this.currentTetromino.tryRotate(this.board, this.tetrominoLocation, clockwise)) {
            this.inactiveTimer.reset()
            if (this.currentTetromino == this.tetrominoes.tTetromino) {
                if (this.currentTetromino.checkTSpin(this.board, this.tetrominoLocation) >= 1) {
                    Sounds.spin.play()
                    this.spinClear = true
                } else {
                    Sounds.rotate.play()
                }
            } else {
                Sounds.rotate.play()
            }

            this.rotations += 1
            this.inactiveTimer.reset()
        }
    }

    /**
     * Soft drops the tetromino down.
     */
    softDropTetromino() {
        if (
            !this.board.tetrominoCollides(
                this.currentTetromino,
                this.tetrominoLocation.x,
                this.tetrominoLocation.y + 1
            )
        ) {
            this.tetrominoLocation.y += 1
            Sounds.drop.play()
            this.spinClear = false
        } else {
            this.inactiveTimer.activate()
            if (this.rotations >= Rules.MAX_ROTATIONS) {
                this.onInactivity()
            }
        }
    }

    /**
     * Drop the tetromino constantly.
     */
    perpetualDropTetromino() {
        if (
            this.board.tetrominoCollides(
                this.currentTetromino,
                this.tetrominoLocation.x,
                this.tetrominoLocation.y + 1
            )
        ) {
            this.inactiveTimer.activate()
            if (this.rotations >= Rules.MAX_ROTATIONS) {
                this.onInactivity()
            }
        } else {
            this.tetrominoLocation.y += 1
            this.spinClear = false
            Sounds.drop.play()
        }
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
            this.spinClear = false
        }
        Sounds.hardDrop.play()

        this.board.placeTetromino(this.currentTetromino, this.tetrominoLocation.x, this.tetrominoLocation.y)
        this.droppedTetromino()
        this.getNextTetromino()
    }

    /**
     * Called when dropping a tetromino.
     * Allows a piece to be held again, if not already.
     */
    droppedTetromino() {
        this.blockHold = false

        this.checkClear()
    }

    /**
     * Attempts to hold the current piece
     * Also brings out the previous held piece, if it exists.
     * Returns whether it is allowed or not.
     */
    hold() {
        if (!this.blockHold) {
            let previouslyHeldTetromino = this.holdTetromino

            if (this.holdContainer.children.length == 1) {
                previouslyHeldTetromino.releaseSprite(this.holdContainer.children[0])

                this.holdContainer.removeChildren()
            }

            this.holdTetromino = this.currentTetromino
            let sprite = this.holdTetromino.getSprite()
            if (sprite != null) {
                this.holdContainer.addChild(sprite)
            }

            if (previouslyHeldTetromino != null) {
                this.currentTetromino = previouslyHeldTetromino
                this.currentTetromino.reset()
                this.tetrominoLocation = this.tetrominoes.getSpawningLocation(
                    this.currentTetromino,
                    this.board
                )
            } else {
                this.getNextTetromino()
            }

            this.blockHold = true
            this.spinClear = false
            this.inactiveTimer.deactivate()
            this.inactiveTimer.reset()
            Sounds.hold.play()

            return true
        } else {
            return false
        }
    }

    /**
     * Checks if there is a full row in the board.
     * Plays sounds and deals garbage as a result.
     */
    checkClear() {
        let cleared = this.board.checkForClear()
        if (cleared > 0) {
            if (this.spinClear) {
                Sounds.clearSpin.play()
            } else if (cleared >= 4) {
                Sounds.tetris.play()
            } else {
                Sounds.clear.play()
            }
        }
    }

    /**
     * Updates the game.
     * @param {number} delta the delta percentage
     */
    update(delta, elapsed) {
        this.elapsed += elapsed

        if (this.dropActive) {
            this.dropTimer.update(elapsed)
        }

        this.inactiveTimer.update(elapsed)

        this.input.update(delta, elapsed)

        this.board.update()
        this.board.drawGhostPieces(this.currentTetromino, this.tetrominoLocation)
        this.board.renderTetromino(this.currentTetromino, this.tetrominoLocation)
    }
}