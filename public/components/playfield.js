/**
 * A playfield for the game.
 */

class Playfield {
    /**
     * Constructs a playfield.
     */
    constructor(screen, offset, options = {}) {
        this.screen = screen
        this.stage = new PIXI.Container()
        this.board = new Board(this)
        this.tetrominoes = new Tetrominoes()
        this.elapsed = 0
        this.width = 20 * GraphicsConstants.BLOCK_SIZE
        this.garbageToAdd = 0

        this.dropTimer = new Timer(Rules.DROP_TIMER, this.perpetualDropTetromino.bind(this))
        this.dropActive = true
        this.inactiveTimer = new CountedCountdownTimer(Rules.INACTIVE_TIMER, this.onInactivity.bind(this))
        this.entryDelayTimer = new CountdownTimer(Timings.ENTRY_DELAY, this.getNextTetromino.bind(this))
        this.spinClear = 0
        this.rotations = 0
        this.score = 0
        this.combo = 0
        this.back2Back = false
        this.canHold = true

        this.boardOffset = new PIXI.Point(18, 18)
        this.board.stage.position = this.boardOffset        
        this.stage.addChild(this.board.stage)

        this.gameOver = false
        this.holdTetromino = null
        this.blockHold = null
        this.instantDrop = false

        this.stage.position = offset

        this.createHoldDisplay()
        this.createGameOverDisplay()
        this.createScore()
        this.createStatus()

        this.randomGenerator = new RandomGenerator(this.tetrominoes)
        this.applyOptions(options)
        this.stage.addChild(this.randomGenerator.nextContainer)

        this.getNextTetromino()
    }

    applyOptions(options) {
        if (options.randomGenerator) {
            this.randomGenerator = new options.randomGenerator(this.tetrominoes)
        }
        if (options.noScore) {
            this.scoreText.visible = false
        }
        if (options.noHold) {
            this.holdContainer.visible = false
            this.holdText.visible = false
            this.canHold = false
        }
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
        this.entryDelayTimer.reset()
        this.entryDelayTimer.deactivate()
        this.currentTetromino = this.randomGenerator.popFromQueue()
        let nextLocation = this.board.getSpawningLocation(this.currentTetromino)
        if (nextLocation == null) {
            this.setGameOver()
        } else {
            this.tetrominoLocation = nextLocation
        }
        this.inactiveTimer.resetWithCounter()
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
    }

    /**
     * Tries to move the tetromino in that direction.
     * Returns if succeeded.
     * @param {number} x the relative x displacement
     * @param {number} y the relative y displacement
     * @param {boolean} arr whether ARR was used to move the piece or not
     */
    tryMove(x, y, arr = false) {
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
            this.inactiveTimer.reset()
            if (y != 0) {
                this.dropTimer.reset()
            }
            this.spinClear = 0

            if (this.shouldForcefullyLock) {
                this.onInactivity()
            } else {
                Sounds.move.play()
            }

            return true
        }
    }

    /**
     * Tries to rotate the tetromino in that direction.
     * Returns if succeeded.
     * @param {boolean} clockwise whether to rotate the tetromino clockwise or not
     */
    tryRotate(clockwise) {
        if (!Rules.IRS_ENABLED && this.entryDelayTimer.active) {
            return
        }
        let result = this.currentTetromino.tryRotate(this.board, this.tetrominoLocation, clockwise)
        if (result != -1) {
            if (this.currentTetromino == this.tetrominoes.tTetromino) {
                this.spinClear = false

                let spinResult = this.currentTetromino.checkTSpin(this.board, this.tetrominoLocation, result)
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
            // this.dropTimer.reset()
            return true
        } else {
            return false
        }
    }

    /**
     * Soft drops the tetromino down.
     */
    softDropTetromino() {
        if (this.entryDelayTimer.active) {
            return
        }
        if (!this.onTop) {
            this.tetrominoLocation.y += 1
            this.score += Scoring.SOFT_DROP
            Sounds.drop.play()
            this.spinClear = 0
        } else {
            this.inactiveTimer.activate()
            if (this.shouldForcefullyLock) {
                this.onInactivity()
            }
        }
    }


    get shouldForcefullyLock() {
        return this.inactiveTimer.counter >= Rules.MAX_RESET && this.onTop
    }

    /**
     * Drop the tetromino constantly.
     */
    perpetualDropTetromino() {
        if (this.onTop) {
            this.inactiveTimer.activate()
            if (this.shouldForcefullyLock) {
                this.onInactivity()
            }
        } else {
            this.tetrominoLocation.y += 1
            this.inactiveTimer.reset()
            this.spinClear = 0
        }
    }

    /**
     * Returns whether the tetromino is on top of terrain.
     */
    get onTop() {
        return this.board.tetrominoCollides(
            this.currentTetromino,
            this.tetrominoLocation.x,
            this.tetrominoLocation.y + 1
        )
    }

    /**
     * Plants the tetromino down to the lowest available point.
     */
    plantTetromino() {
        while (!this.onTop) {
            this.tetrominoLocation.y += 1
            this.score += Scoring.HARD_DROP
            this.spinClear = 0
        }
    }

    /**
     * Hard drops the tetromino down.
     */
    hardDropTetromino() {
        if (this.entryDelayTimer.active) {
            return
        }
        this.plantTetromino()
        Sounds.hardDrop.play()

        this.board.placeTetromino(this.currentTetromino, this.tetrominoLocation.x, this.tetrominoLocation.y)
        this.droppedTetromino()
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
            this.addGarbage(this.garbageToAdd)
            this.garbageToAdd = 0
        }
        this.entryDelayTimer.activate()
    }

    /**
     * Sends the amount of garbage to the board.
     */
    addGarbage(amount) {
        this.board.createGarbage(amount)
        this.board.update()
        Sounds.garbage.play()
    }

    /**
     * Attempts to hold the current piece
     * Also brings out the previous held piece, if it exists.
     * Returns whether it is allowed or not.
     */
    hold() {
        if (!Rules.IHS_ENABLED && this.entryDelayTimer.active) {
            return
        }
        if (!this.blockHold && this.canHold) {
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
                let spawningLocation = this.board.getSpawningLocation(
                    this.currentTetromino
                )

                if (spawningLocation == null) {
                    this.setGameOver()
                } else {
                    this.tetrominoLocation = spawningLocation
                }
            } else {
                this.getNextTetromino()
            }

            this.blockHold = true
            this.spinClear = 0
            this.rotations = 0
            this.inactiveTimer.deactivate()
            this.inactiveTimer.resetWithCounter()
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
        let wasBackToBack = this.back2Back
        this.score += Scoring.getScoreDelta(cleared, this.spinClear, this.combo, this.back2Back)
        if (cleared > 0) {
            this.combo += 1
            
            if (this.spinClear >= TTetromino.MINI_T_SPIN) {
                if (this.back2Back) {
                    Sounds.backToBack.play()
                } else {
                    Sounds.clearSpin.play()
                }

                if (this.spinClear == TTetromino.MINI_T_SPIN) {
                    this.updateStatus("Mini T-Spin " + Utilities.numberToCount(cleared), true)
                } else {
                    this.updateStatus("T-Spin " + Utilities.numberToCount(cleared), true)
                }
                this.back2Back = true
            } else if (cleared >= 4) {
                if (this.back2Back) {
                    Sounds.backToBack.play()
                } else {
                    Sounds.tetris.play()
                }
                this.updateStatus("Tetris", true)
                this.back2Back = true
            } else {
                Sounds.clear.play()
                this.back2Back = false
                if (cleared > 0) {
                    this.updateStatus(Utilities.numberToCount(cleared), false)
                }
            }

            if (this.board.checkForPerfectClear()) {
                Sounds.perfectClear.play()
                this.updateStatus("PC " + Utilities.numberToCount(cleared), false)
                this.score += Scoring.PERFECT_CLEAR
                this.offsetGarbage(Rules.PERFECT_CLEAR_GARBAGE)
            } else {
                this.offsetGarbage(Rules.computeGarbage(cleared, this.spinClear, this.combo, this.back2Back && wasBackToBack))
            }
        } else {
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
            this.screen.sendGarbage(this, amountToSend)

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

            if (this.instantDrop) {
                this.plantTetromino()
            }

            if (this.dropActive && !this.entryDelayTimer.active) {
                this.dropTimer.update(elapsed)
            }

            this.inactiveTimer.update(elapsed)
            this.entryDelayTimer.update(elapsed)

            this.board.update()
            this.board.drawGhostPieces(this.currentTetromino, this.tetrominoLocation)
            this.board.renderTetromino(this.currentTetromino, this.tetrominoLocation)

            this.updateScore()
        }
    }
}