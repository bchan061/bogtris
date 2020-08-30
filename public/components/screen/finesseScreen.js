class FinesseScreen extends Screen {
    static option = "all"

    attach() {
        super.attach()
        let options = {
            randomGenerator: FinesseRandomGenerator,
            noScore: true,
            noHold: true
        }
        this.playfield = new Playfield(this, new PIXI.Point(0, 0), options)
        let input = new Input(this.playfield)
        this.playfield.setInput(input)
        this.game.inputDelegator.addInput(input)
        this.stage.addChild(this.playfield.stage)

        this.setupFinesses()
    }

    detach() {
        super.detach()
        this.stage.removeChild(this.playfield.stage)
        this.game.inputDelegator.removeInput(this.playfield.input)
    }

    setInputDelegator(inputDelegator) {
        this.inputDelegator = inputDelegator
    }

    sendGarbage(sender, amount) {
        /* Ignore garbage. */
    }

    /**
     * Updates the game.
     * @param {number} delta 
     * @param {number} elapsed 
     */
    update(delta, elapsed) {
        this.playfield.update(delta, elapsed)
        this.game.inputDelegator.update(delta, elapsed)

        let orientation = this.currentFinesse.orientations[0]
        let correctedX = this.currentFinesse.x - this.currentTetrominoForTests.getLeftmostX(orientation)
        let point = { x: correctedX, y: 0 }
        this.playfield.board.drawGhostPieces(this.currentTetrominoForTests, point, {
            color: Colors.PINK,
            rotation: orientation,
            opacity: 0.8
        })
    }

    setupFinesses() {
        this.currentMoves = []
        this.finessesToTest = []

        this.addFinesseDisplay()

        this.finesses = new Finesses(this.playfield.tetrominoes)
        this.overrideNormalFunctions(this.playfield)
        switch (FinesseScreen.option) {
            case 'o':
                this.tetrominoesToTest = [this.playfield.tetrominoes.oTetromino]
                break;
            case 'i':
                this.tetrominoesToTest = [this.playfield.tetrominoes.iTetromino]
                break;
            case 's':
                this.tetrominoesToTest = [this.playfield.tetrominoes.sTetromino]
                break;
            case 'z':
                this.tetrominoesToTest = [this.playfield.tetrominoes.zTetromino]
                break;
            case 'l':
                this.tetrominoesToTest = [this.playfield.tetrominoes.lTetromino]
                break;
            case 'j':
                this.tetrominoesToTest = [this.playfield.tetrominoes.jTetromino]
                break;
            case 't':
                this.tetrominoesToTest = [this.playfield.tetrominoes.tTetromino]
                break;
            case 'all':
            default:
                this.tetrominoesToTest = Utilities.shuffleArray([...this.playfield.tetrominoes.tetrominoArray])
                break;
        }

        this.getNextFinesse()
    }

    getNextFinesse() {
        if (this.finessesToTest.length === 0) {
            // Shift out tetromino
            let doneTetromino = this.tetrominoesToTest.shift()
            this.tetrominoesToTest.push(doneTetromino)

            this.setupRandomGenerator(this.currentTetrominoForTests)
            this.addFinesseTestsFor(this.currentTetrominoForTests)
            this.updateFinessePiece()
            this.updateFinesseDisplay()

            Sounds.perfectClear.play()
        }

        this.currentFinesse = this.finessesToTest.shift()
        return this.currentFinesse
    }

    get currentTetrominoForTests() {
        return this.tetrominoesToTest[0]
    }

    addFinesseTestsFor(tetromino) {
        let finessesSet = this.finesses.getAllFinesses(tetromino)
        let finessesArray = Utilities.shuffleArray([...finessesSet])
        this.finessesToTest.push(...finessesArray)
    }

    detach() {
        super.detach()
        this.stage.removeChild(this.finesseDisplay)
        this.stage.removeChild(this.playfield.stage)
        this.game.inputDelegator.removeInput(this.playfield.input)
    }

    setupRandomGenerator(tetromino) {
        this.playfield.randomGenerator.tetromino = tetromino
        this.playfield.randomGenerator.clearQueueAndBag()
        this.playfield.randomGenerator.fillQueueWithBag()
        this.playfield.getNextTetromino()
    }

    addFinesseDisplay() {
        this.finesseDisplay = new PIXI.Container()

        this.finesseText = new PIXI.extras.BitmapText(
            "",
            {
                font: Utilities.getRelativeToSmallestScreenDimension(0.04) + 'px Exo2Medium',
                fill: 'white'
            }
        )
        this.finesseText.anchor.set(0, 0)
        this.finesseText.position.set(
            this.playfield.boardOffset.x,
            this.playfield.boardOffset.y + (this.playfield.board.height + 0.5) * GraphicsConstants.BLOCK_SIZE,
        )

        this.currentContainer = new PIXI.Container()
        this.currentContainer.position.set(
            2 * GraphicsConstants.BLOCK_SIZE,
            3 * GraphicsConstants.BLOCK_SIZE
        )
        this.currentContainer.alpha = 0.75

        this.currentTetrominoText = new PIXI.extras.BitmapText(
            "Left: 0",
            {
                font: Utilities.getRelativeToSmallestScreenDimension(0.05) + 'px Exo2Medium',
                fill: 'white',
            }
        )
        this.currentTetrominoText.anchor.set(0.5, 0.5)
        this.currentTetrominoText.position.set(
            3 * GraphicsConstants.BLOCK_SIZE,
            1.75 * GraphicsConstants.BLOCK_SIZE
        )

        this.finesseDisplay.addChild(this.finesseText)
        this.finesseDisplay.addChild(this.currentTetrominoText)
        this.finesseDisplay.addChild(this.currentContainer)
        this.stage.addChild(this.finesseDisplay)
    }

    updateFinesseDisplay() {
        this.currentTetrominoText.text = `Left: ${this.finessesToTest.length}`
    }

    updateFinessePiece() {
        if (this.currentContainer.children.length == 1) {
            this.currentTetrominoForTests.releaseSprite(this.currentContainer.children[0])
            this.currentContainer.removeChildren()
        }

        let sprite = this.currentTetrominoForTests.getSprite()
        if (sprite != null) {
            /* Center the sprite container to the hold text. */
            this.currentContainer.addChild(sprite)

            let hSize = this.currentTetrominoForTests.shape[0].length
            this.currentContainer.position.x = 3 * GraphicsConstants.BLOCK_SIZE -
                (hSize * GraphicsConstants.BLOCK_SIZE) / 2
        }
    }

    onPlace(tetromino, x, y) {
        let steps = this.currentFinesse.steps
        let moves = this.processMoves()

        x += tetromino.getLeftmostX()
        if (x === this.currentFinesse.x && this.checkSteps(steps, moves, this.currentFinesse.strict)) {
            this.onCorrect()
        } else {
            this.onIncorrect(steps)
        }

        this.currentMoves = []
    }

    onCorrect() {
        Sounds.clear.play()
        this.finesseText.text = ""
        this.updateFinesseDisplay()
        this.getNextFinesse()
    }

    onIncorrect(steps) {
        Sounds.forceDrop.play()
        let correctSteps = [...steps]
        correctSteps.push("Drop")
        this.finesseText.text = correctSteps.join(" -> ")
    }

    checkSteps(correctSteps, playerSteps, strict = true) {
        if (!strict) {
            return Utilities.containSameElements(correctSteps, playerSteps)
        } else {
            if (correctSteps.length !== playerSteps.length) {
                return false
            }
            for (let i = 0; i < correctSteps.length; i++) {
                if (correctSteps[i] !== playerSteps[i]) {
                    return false
                }
            }
        }
        return true
    }

    processMoves() {
        if (this.currentMoves.length > 20) {
            // Guaranteed to be incorrect
            return this.currentMoves
        }
        

        let moves = [...this.currentMoves]
        let currentRotation = undefined
        let startRotation = 0
        for (let i = 0; i < moves.length; i++) {
            let currentMove = moves[i]
            if (!currentRotation) {
                if (currentMove === FinesseStep.ROTATE_CLOCKWISE || currentMove === FinesseStep.ROTATE_COUNTERCLOCKWISE) {
                    currentRotation = currentMove
                    startRotation = i
                }
            } else {
                if (currentMove === currentRotation) {
                    moves[startRotation] = FinesseStep.ROTATE_TWICE
                    moves.splice(i, 1)

                    currentRotation = undefined
                    startRotation = 0
                    i -= 1
                }
            }
        }
        let currentDAS = undefined
        let startDAS = 0
        let rotations = []
        for (let i = 0; i < moves.length; i++) {
            let currentMove = moves[i]
            if (!currentDAS) {
                if (currentMove === FinesseStep.DAS_LEFT || currentMove === FinesseStep.DAS_RIGHT) {
                    currentDAS = currentMove
                    startDAS = i
                    while (startDAS > 0) {
                        let atStartDAS = moves[startDAS]
                        if (currentDAS === FinesseStep.DAS_LEFT) {
                            if (atStartDAS === FinesseStep.LEFT || atStartDAS === FinesseStep.DAS_LEFT) {
                                startDAS -= 1
                            } else if (atStartDAS === FinesseStep.RIGHT || atStartDAS === FinesseStep.DAS_RIGHT) {
                                break
                            } else {
                                rotations.push(atStartDAS)
                                moves.splice(startDAS, 1)
                                startDAS -= 1
                            }
                        } else {
                            if (atStartDAS === FinesseStep.RIGHT || atStartDAS === FinesseStep.DAS_RIGHT) {
                                startDAS -= 1
                            } else if (atStartDAS === FinesseStep.RIGHT || atStartDAS === FinesseStep.DAS_RIGHT) {
                                break
                            } else {
                                rotations.push(atStartDAS)
                                moves.splice(startDAS, 1)
                                startDAS -= 1
                            }
                        }
                    }
                }
            } else if (currentMove !== currentDAS) {
                if (currentMove === FinesseStep.ROTATE_CLOCKWISE || currentMove === FinesseStep.ROTATE_COUNTERCLOCKWISE || currentMove === FinesseStep.ROTATE_TWICE) {
                    rotations.push(currentMove)
                    moves.splice(i, 1)
                    i -= 1
                    continue
                }
                let priorMoves = moves.slice(0, startDAS)
                priorMoves.push(currentDAS)
                let afterMoves = moves.slice(i)
                afterMoves = afterMoves.map((move) => {
                    if (move === FinesseStep.DAS_LEFT) {
                        return FinesseStep.LEFT
                    } else if (move === FinesseStep.DAS_RIGHT) {
                        return FinesseStep.RIGHT
                    }
                    return move
                })
                priorMoves.push(...rotations)
                priorMoves.push(...afterMoves)
                return priorMoves
            }
        }

        if (currentDAS) {
            let priorMoves = moves.slice(0, startDAS)
            priorMoves.push(currentDAS)
            priorMoves.push(...rotations)
            return priorMoves
        }

        return moves
    }

    onMove(x, y, arr) {
        if (x !== 0) {
            if (x < 0) {
                if (arr) {
                    this.currentMoves.push(FinesseStep.DAS_LEFT)
                } else {
                    this.currentMoves.push(FinesseStep.LEFT)
                }
            } else {
                if (arr) {
                    this.currentMoves.push(FinesseStep.DAS_RIGHT)
                } else {
                    this.currentMoves.push(FinesseStep.RIGHT)
                }
            }
        }
    }

    onRotate(clockwise) {
        if (clockwise) {
            this.currentMoves.push(FinesseStep.ROTATE_CLOCKWISE)
        } else {
            this.currentMoves.push(FinesseStep.ROTATE_COUNTERCLOCKWISE)
        }
    }

    /**
     * Modifies existing playfield functions to enable finesse training.
     * @param {object} playfield the playfield to modify
     */
    overrideNormalFunctions(playfield) {
        this.playfield.board.setStaticBlock = (block, x, y) => {}
        this.playfield.addGarbage = (amount) => {}
        this.playfield.softDropTetromino = () => {}
        this.playfield.dropTimer = new Timer(Rules.DROP_TIMER, () => {})
        this.playfield.board.placeTetromino = this.onPlace.bind(this)

        let onMove = this.onMove.bind(this)
        let tryMove = this.playfield.tryMove.bind(this.playfield)
        this.playfield.tryMove = (x, y, arr) => {
            if (tryMove(x, y, arr)) {
                onMove(x, y, arr)
            }
        }
        let onRotate = this.onRotate.bind(this)
        let tryRotate = this.playfield.tryRotate.bind(this.playfield)
        this.playfield.tryRotate = (clockwise) => {
            if (tryRotate(clockwise)) {
                onRotate(clockwise)
            }
        }
    }
}