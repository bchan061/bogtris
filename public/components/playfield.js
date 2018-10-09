/**
 * A playfield for the game.
 */
class Playfield {
    /**
     * Constructs a playfield.
     */
    constructor(game, offset) {
        this.game = game
        this.stage = new PIXI.Container()
        this.board = new Board(this)
        this.tetrominoes = new Tetrominoes()
        this.randomGenerator = new RandomGenerator(this.tetrominoes)
        this.stage.addChild(this.randomGenerator.nextContainer)
        this.elapsed = 0
        this.width = 20 * GraphicsConstants.BLOCK_SIZE
        this.garbageToAdd = 0

        this.dropTimer = new Timer(Rules.DROP_TIMER, this.perpetualDropTetromino.bind(this))
        this.dropActive = true
        this.inactiveTimer = new CountdownTimer(Rules.INACTIVE_TIMER, this.onInactivity.bind(this))
        this.spinClear = 0
        this.rotations = 0
        this.score = 0
        this.back2Back = 0

        this.boardOffset = new PIXI.Point(18, 18)
        this.board.stage.position = this.boardOffset        
        this.stage.addChild(this.board.stage)

        this.gameOver = false
        this.holdTetromino = null
        this.blockHold = null

        this.stage.position = offset

        this.createHoldDisplay()
        this.createGameOverDisplay()
        this.createScore()
        this.createStatus()

        this.getNextTetromino()
    }

    /**
     * Creates all the containers and text for the hold display.
     * Then adds it to the stage.
     */
    createHoldDisplay() {
        this.holdContainer = new PIXI.Container()
        this.holdContainer.position.set(
            2 * GraphicsConstants.BLOCK_SIZE,
            3 * GraphicsConstants.BLOCK_SIZE
        )
        this.holdText = new PIXI.extras.BitmapText(
            "Hold",
            {
                font: Utilities.getRelativeToSmallestScreenDimension(0.05) + 'px Exo2Medium',
                fill: 'white',
            }
        )
        this.holdText.anchor.set(0.5, 0.5)
        this.holdText.position.set(
            3 * GraphicsConstants.BLOCK_SIZE,
            1.75 * GraphicsConstants.BLOCK_SIZE
        )

        this.stage.addChild(this.holdText)
        this.stage.addChild(this.holdContainer)
    }

    /**
     * Creates the game over text and shade.
     * Then adds it to the stage.
     */
    createGameOverDisplay() {
        this.gameOverText = new PIXI.extras.BitmapText(
            "Game over",
            {
                font: Utilities.getRelativeToSmallestScreenDimension(0.075) + 'px Exo2Medium',
                fill: 'white',
            }
        )
        this.gameOverText.anchor.set(0.5, 0.5)
        this.gameOverText.position.set(
            this.boardOffset.x + this.board.width * GraphicsConstants.BLOCK_SIZE / 2,
            this.boardOffset.y + this.board.height * GraphicsConstants.BLOCK_SIZE / 2
        )
        this.gameOverText.visible = false
        this.gameOverShade = new PIXI.Graphics()
        this.gameOverShade.beginFill(0xAAAAAA)
        this.gameOverShade.fillAlpha = 0.5
        this.gameOverShade.drawRect(
            this.boardOffset.x,
            this.boardOffset.y + (this.board.obstructTop) * GraphicsConstants.BLOCK_SIZE,
            this.board.width * GraphicsConstants.BLOCK_SIZE,
            (this.board.height - this.board.obstructTop) * GraphicsConstants.BLOCK_SIZE
        )
        this.gameOverShade.visible = false
        this.stage.addChild(this.gameOverShade)
        this.stage.addChild(this.gameOverText)
    }

    /**
     * Creates the score display.
     */
    createScore() {
        this.scoreText = new PIXI.extras.BitmapText(
            "000000000",
            {
                font: Utilities.getRelativeToSmallestScreenDimension(0.06) + 'px Exo2Medium',
                fill: Colors.GRAY
            }
        )
        this.scoreText.anchor.set(1, 0)
        this.scoreText.position.set(
            this.width - GraphicsConstants.BLOCK_SIZE,
            GraphicsConstants.BLOCK_SIZE / 2,
        )

        this.stage.addChild(this.scoreText)
    }

    /**
     * Creates the status display.
     */
    createStatus() {
        this.statusText = new PIXI.extras.BitmapText(
            "",
            {
                font: Utilities.getRelativeToSmallestScreenDimension(0.04) + 'px Exo2Medium',
                fill: 'white'
            }
        )
        this.statusText.anchor.set(0.5, 0)
        this.statusText.position.set(
            this.boardOffset.x + this.board.width * GraphicsConstants.BLOCK_SIZE / 2,
            this.boardOffset.y + (this.board.height) * GraphicsConstants.BLOCK_SIZE,
        )

        this.stage.addChild(this.statusText)
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
        let nextLocation = this.board.getSpawningLocation(this.currentTetromino)
        if (nextLocation == null) {
            this.setGameOver()
        } else {
            this.tetrominoLocation = nextLocation
        }
        this.inactiveTimer.reset()
        this.inactiveTimer.deactivate()
        this.rotations = 0
    }

    /**
     * Updates the score display.
     */
    updateScore() {
        let truncatedScore = this.score
        if (this.score > 0) {
            let digits = Math.log10(this.score)
            if (digits >= 10) {
                truncatedScore = "999999999+"
            } else {
                for (let i = 0; i < (9 - digits); i++) {
                    truncatedScore = "0" + truncatedScore
                }
            }
        } else {
            truncatedScore = "000000000"
        }
        
        this.scoreText.text = truncatedScore
    }

    /**
     * Sets the game over state.
     */
    setGameOver() {
        this.gameOver = true
        this.gameOverShade.visible = true
        this.gameOverText.visible = true
        this.input.active = false
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
            this.spinClear = 0

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
                this.spinClear = false

                let spinResult = this.currentTetromino.checkTSpin(this.board, this.tetrominoLocation)
                if (spinResult >= 1) {
                    Sounds.spin.play()
                    this.spinClear = spinResult
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
            this.score += 1
            Sounds.drop.play()
            this.spinClear = 0
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
            this.spinClear = 0
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
            this.score += Scoring.HARD_DROP
            this.spinClear = 0
        }
        Sounds.hardDrop.play()

        this.board.placeTetromino(this.currentTetromino, this.tetrominoLocation.x, this.tetrominoLocation.y)
        this.droppedTetromino()
        this.getNextTetromino()
    }

    /**
     * Called when dropping a tetromino.
     * Allows a piece to be held again, if not already.
     * Also adds garbage and checks for any line clears.
     */
    droppedTetromino() {
        this.blockHold = false
        this.checkClear()

        if (this.garbageToAdd > 0) {
            this.board.createGarbage(this.garbageToAdd)

            Sounds.garbage.play()

            this.garbageToAdd = 0
        }
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
                /* Center the sprite container to the hold text. */
                this.holdContainer.addChild(sprite)

                let hSize = this.holdTetromino.shape[0].length
                this.holdContainer.position.x = 3 * GraphicsConstants.BLOCK_SIZE -
                    (hSize * GraphicsConstants.BLOCK_SIZE) / 2
            }

            if (previouslyHeldTetromino != null) {
                this.currentTetromino = previouslyHeldTetromino
                this.currentTetromino.reset()
                this.tetrominoLocation = this.board.getSpawningLocation(
                    this.currentTetromino
                )
            } else {
                this.getNextTetromino()
            }

            this.blockHold = true
            this.spinClear = 0
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
        this.score += Scoring.getScoreDelta(cleared, this.spinClear, this.combo, this.back2Back)
        this.offsetGarbage(Rules.computeGarbage(cleared, this.spinClear, this.combo, this.back2Back))
        if (cleared > 0) {
            this.combo += 1
            
            if (this.spinClear >= TTetromino.MINI_T_SPIN) {
                if (this.back2Back > 0) {
                    Sounds.backToBack.play()
                } else {
                    Sounds.clearSpin.play()
                }

                if (this.spinClear == TTetromino.MINI_T_SPIN) {
                    this.updateStatus("Mini T-Spin " + Utilities.numberToCount(cleared), true)
                } else {
                    this.updateStatus("T-Spin " + Utilities.numberToCount(cleared), true)
                }
                this.back2Back = Rules.BACK_TO_BACK
            } else if (cleared >= 4) {
                if (this.back2Back > 0) {
                    Sounds.backToBack.play()
                } else {
                    Sounds.tetris.play()
                }
                this.updateStatus("Tetris", true)
                this.back2Back = Rules.BACK_TO_BACK
            } else {
                Sounds.clear.play()
                if (cleared > 0) {
                    this.updateStatus(Utilities.numberToCount(cleared), false)
                }
                this.back2Back -= 1
            }

            if (this.board.checkForPerfectClear()) {
                Sounds.perfectClear.play()
                this.updateStatus("PC " + Utilities.numberToCount(cleared), false)
                this.score += Scoring.PERFECT_CLEAR
                this.offsetGarbage(Rules.PERFECT_CLEAR_GARBAGE)
            }
        } else {
            this.back2Back -= 1
            this.combo = 0
            if (this.spinClear == TTetromino.MINI_T_SPIN) {
                this.updateStatus("Mini T-Spin", false)
            } else if (this.spinClear == TTetromino.T_SPIN) {
                this.updateStatus("T-Spin", false)
            }
        }
    }

    /**
     * Offsets the number of garbage to be dealt to this player.
     * If the amount is larger, sends the garbage out.
     * @param {number} amount the amount of garbage
     */
    offsetGarbage(amount) {
        this.garbageToAdd -= amount
        if (this.garbageToAdd < 0) {
            let amountToSend = -this.garbageToAdd
            this.game.sendGarbage(this, amountToSend)

            this.garbageToAdd = 0
        }
    }

    /**
     * Updates the status message at the bottom right
     * @param {string} message the message
     * @param {boolean} b2bClear if the clear is eligible for back-to-back
     */
    updateStatus(message, b2bClear) {
        let statusMessage = message
        if (b2bClear && this.back2Back > 0) {
            statusMessage = "B2B " + statusMessage
        }
        if (this.combo > 1) {
            statusMessage += " (" + this.combo + " Combo)"
        }
        this.statusText.text = statusMessage
    }

    /**
     * Updates the game.
     * @param {number} delta the delta percentage
     */
    update(delta, elapsed) {
        if (!this.gameOver) {
            this.elapsed += elapsed

            if (this.dropActive) {
                this.dropTimer.update(elapsed)
            }

            this.inactiveTimer.update(elapsed)

            this.board.update()
            this.board.drawGhostPieces(this.currentTetromino, this.tetrominoLocation)
            this.board.renderTetromino(this.currentTetromino, this.tetrominoLocation)

            this.updateScore()
        }
    }
}