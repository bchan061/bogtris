/**
 * Genetic AI input.
 * Stacks for Tetris.
 */
class AIInput extends Input {
    constructor(playfield) {
        super(playfield)
        this.actTimer = new Timer(0.0125, this.act.bind(this))
        this.active = true

        this.decidedX = 0
        this.decidedRotation = 0
        this.decided = false

        this.garbageMultiplier = 1
        this.holesMultiplier = 1
        this.relativeHeightMultiplier = 1
        this.heightsMultiplier = 1

        /* Hook the dropped tetromino event with the AIInput. */
        let dropFunction = this.onDrop.bind(this)
        let originalDrop = this.playfield.droppedTetromino.bind(this.playfield)
        let newFunction = function() {
            originalDrop()
            dropFunction()
        }
        this.playfield.droppedTetromino = newFunction
    }

    onDrop() {
        this.decided = false
    }

    heuristic(currentTetromino, position) {
        let newBoard = Utilities.clone2DArray(this.playfield.board.staticBoard)
        this.dropTetromino(currentTetromino, position, newBoard)
        let cleared = this.checkLineClears(newBoard)
        let relativeHeights = this.calculateRelativeHeights(newBoard)
        let heights = relativeHeights[1]
        relativeHeights = relativeHeights[0]

        return this.getGarbage(cleared) * this.garbageMultiplier
        + this.calculateHoles(newBoard) * this.holesMultiplier
        + relativeHeights * this.relativeHeightMultiplier
        + heights * this.heightsMultiplier
    }

    /**
     * Calculates the number of holes in the board.
     * @param {object} board an array of numbers listing blocks
     */
    calculateHoles(board) {
        let holes = 0
        for (let x = 0; x < board[0].length; x++) {
            let empty = 0
            for (let y = board.length - 1; y >= 0; y--) {
                let block = board[y][x]
                if (block == 0) {
                    empty += 1
                } else {
                    holes += empty
                    empty = 0
                }
            }
        }   

        return holes
    }

    calculateRelativeHeights(board) {
        let relativeHeights = 0
        let heights = 0
        for (let x = 0; x < board[0].length; x++) {
            let left = x - 1
            let right = x + 1
            if (left < 0) {
                left = x
            } if (right >= board[0].length) {
                right = x
            }

            let leftHeight = 0
            let height = 0
            let rightHeight = 0
            for (let y = 0; y < board.length; y++) {
                if (board[y][left] != 0 && leftHeight == 0) {
                    leftHeight = board.length - y
                }
                if (board[y][x] != 0 && height == 0) {
                    height = board.length - y
                    heights += height
                }
                if (board[y][right] != 0 && rightHeight == 0) {
                    rightHeight = board.length - y
                }

                if (leftHeight != 0 && height != 0 && rightHeight != 0) {
                    break
                }
            }
            
            relativeHeights += Math.abs(leftHeight - height) + Math.abs(rightHeight - height)
        }
        return [relativeHeights, heights]
    }

    /**
     * Returns the garbage from the lines cleared and other statistics.
     */
    getGarbage(cleared) {
        return Rules.computeGarbage(cleared, this.playfield.spinClear, this.playfield.combo, this.playfield.backToBack)
    }

    /**
     * Hard drops the tetromino onto a fake board.
     * @param {object} tetromino the tetromino to test
     * @param {object} location the location
     * @param {object} board an array of numbers listing blocks, to be modified
     */
    dropTetromino(tetromino, location, board) {
        let x = location.x
        let y = location.y
        while (!this.tetrominoCollides(tetromino, x, y + 1, board)) {
            y += 1
        }

        this.renderTetromino(tetromino, x, y, board)


    }

    checkLineClears(board) {
        let cleared = 0
        for (let y = 0; y < board.length; y++) {
            let fullRow = true
            for (let x = 0; x < board[0].length && fullRow; x++) {
                if (board[y][x] == 0) {
                    fullRow = false
                }
            }

            if (fullRow) {
                cleared += 1

                let blankRow = []
                for (let x = 0; x < board[0].length; x++) {
                    blankRow[x] = 0
                }

                /* Shift all the above rows down and add a blank row on top. */
                board.splice(y, 1)
                board.unshift(blankRow)
            }
        }

        return cleared
    }

    /**
     * Decides where to place and rotate the tetromino.
     */
    decideLocationAndRotation() {
        let maxRotation = 0
        let maxX = 0
        let maxHeuristic = Number.NEGATIVE_INFINITY
        let currentTetromino = this.playfield.currentTetromino
        let location = {
            x: 0,
            y: this.playfield.tetrominoLocation.y
        }
        for (let rotation = 0; rotation < 4; rotation++) {
            currentTetromino.currentShapeIndex = rotation
            for (let x = 0; x < this.playfield.board.width; x++) {
                location.x = x

                if (
                    this.tetrominoCollides(currentTetromino, location.x, location.y, this.playfield.board.staticBoard)
                ) {
                    continue
                }

                let heuristic = this.heuristic(currentTetromino, location)
                if (heuristic > maxHeuristic) {
                    maxHeuristic = heuristic
                    maxX = x
                    maxRotation = rotation
                }
            }
        }

        this.decidedX = maxX
        this.decidedRotation = maxRotation
        this.decided = true

        currentTetromino.reset()
    }

    /**
     * Checks if the tetromino intersects at a location.
     * @param {*} tetromino the tetromino to test
     * @param {*} x
     * @param {*} y
     * @param {*} board 
     */
    tetrominoCollides(tetromino, x, y, board) {
        for (let ty = 0; ty < tetromino.getHeight(); ty++) {
            for (let tx = 0; tx < tetromino.getWidth(); tx++) {
                let block = tetromino.getRotationBox()[ty][tx]

                if (block == 0) {
                    continue
                }

                let offsetX = x + tx
                let offsetY = y + ty

                if (
                    offsetX < 0 ||
                    offsetY < 0 ||
                    offsetX >= board[0].length ||
                    offsetY >= board.length
                ) {
                    return true
                }

                if (board[offsetY][offsetX] != 0) {
                    return true
                }
            }
        }

        return false
    }

    /**
     * Renders the tetromino onto a board.
     * @param {object} tetromino the tetromino
     * @param {object} x the x-coordinate of the tetromino
     * @param {object} y the y-coordinate of the tetromino
     * @param {object} board the board
     */
    renderTetromino(tetromino, x, y, board) {
        for (let tY = 0; tY < tetromino.getHeight(); tY++) {
            for (let tX = 0; tX < tetromino.getWidth(); tX++) {
                let value = tetromino.getRotationBox()[tY][tX]

                if (value == 1) {
                    let offsetX = tX + x
                    let offsetY = tY + y

                    board[offsetY][offsetX] = tetromino.color
                }
            }  
        }
    }

    logBoard(board) {
        for (let y = 0; y < board.length; y++) {
            let row = "[" + y + "] "
            for (let x = 0; x < board[0].length; x++) {
                if (board[y][x] == 0) {
                    row += 0
                } else {
                    row += 1
                }
            }
            console.log(row)
        }
    }

    act() {
        if (this.active) {
            if (this.decided) {
                let currentTetromino = this.playfield.currentTetromino
                let position = this.playfield.tetrominoLocation
        
                let finished = true
                if (
                    currentTetromino != this.playfield.tetrominoes.oTetromino &&
                    this.decidedRotation != currentTetromino.currentShapeIndex
                ) {
                    this.playfield.tryRotate(true)
                    finished = false
                }
                if (this.decidedX != position.x) {
                    let displacement = Math.sign(this.decidedX - position.x)
                    this.playfield.tryMove(displacement, 0)
                    finished = false
                }
                if (finished) {
                    this.playfield.hardDropTetromino()
                }
            } else {
                this.decideLocationAndRotation()
            }
        }
    }

    update(delta, elapsed) {
        if (this.active) {
            this.actTimer.update(elapsed)
        }
    }
}
