/**
 * The board.
 */
class Board {
    /**
     * Initializes the board.
     * @param {object} playfield a reference to the playfield
     * @param {number} width the width of the board
     * @param {number} height the height of the board
     */
    constructor(playfield, width = 10, height = 25) {
        this.width = width
        this.height = height
        this.playfield = playfield
        this.blockSize = GraphicsConstants.BLOCK_SIZE
        this.obstructTop = GraphicsConstants.OBSTRUCT_TOP
        this.stage = new PIXI.Container()
        this.spriteBoard = new Array(this.height)
        this.staticBoard = new Array(this.height)
        this.blockTexture = PIXI.loader.resources["assets/block.svg"].texture
        this.grid = new PIXI.Sprite(PIXI.loader.resources["assets/grid.svg"].texture)
        this.grid.alpha = 0.5
        this.grid.position.set(0, (this.obstructTop * this.blockSize))
        this.grid.scale.set((this.width * this.blockSize) / this.grid.texture.width)

        this.initBoard()
    }

    /**
     * Creates the arrays for the active and static block values.
     */
    initBoard() {
        this.stage.addChild(this.grid)

        for (let y = 0; y < this.height; y++) {
            let spriteRow = new Array(this.width)
            let staticRow = new Array(this.width)
            for (let x = 0; x < this.width; x++) {
                let block = new Block(this)
                block.set(x, y)

                this.stage.addChild(block.sprite)

                spriteRow[x] = block
                staticRow[x] = 0
            }

            this.spriteBoard[y] = spriteRow
            this.staticBoard[y] = staticRow
        }
    }

    /**
     * Returns the sprite associated at the location, if it exists.
     * @param {number} x the x-coordinate of the block
     * @param {number} y the y-coordinate of the block
     */
    getSpriteBlock(x, y) {
        if (!this.isValid(x, y)) {
            return null
        }

        return this.spriteBoard[y][x]
    }

    /**
     * Returns the block associated at the location, if it exists.
     * @param {number} x the x-coordinate of the block
     * @param {number} y the y-coordinate of the block
     */
    getStaticBlock(x, y) {
        if (!this.isValid(x, y)) {
            return null
        }

        return this.staticBoard[y][x]
    }

    /**
     * Returns the spawning location for the tetromino, if it exists
     * @param {object} tetromino the tetromino to spawn
     */
    getSpawningLocation(tetromino) {
        let width = tetromino.getWidth()
        let x = Math.floor(this.width / 2 - width / 2)
        let top = this.obstructTop - 1 - tetromino.getOffsetFromBottom()

        if (this.tetrominoCollides(tetromino, x, top)) {
            return null
        } else {
            return {
                x: x,
                y: top
            }
        }
    }

    /**
     * Sets the block to the appropriate color, if it exists.
     * @param {number} block the color value of the block
     * @param {number} x the x-coordinate of the block
     * @param {number} y the y-coordinate of the block
     */
    setStaticBlock(block, x, y) {
        if (this.isValid(x, y)) {
            this.staticBoard[y][x] = block
        }
    }

    /**
     * Returns whether the block in the static area is empty or not.
     * In this case, the color black (0, or 0x000000)
     * @param {number} x the x-coordinate of the block
     * @param {number} y the y-coordinate of the block
     */
    isStaticEmptyFromLocation(x, y) {
        return this.isStaticEmptyFromBlock(this.getStaticBlock(x, y))
    }

    /**
     * Returns whether the block in the static area is empty or not.
     * In this case, the color black (0, or 0x000000)
     * @param {number} block the static block
     */
    isStaticEmptyFromBlock(block) {
        return block == 0
    }

    /**
     * Returns whether the location is a valid block position or not.
     * @param {number} x the x-coordinate of the block
     * @param {number} y the y-coordinate of the block
     */
    isValid(x, y) {
        if (
            x < 0 ||
            y < 0 ||
            x >= this.width ||
            y >= this.height
        ) {
            return false
        }

        return true
    }

    /**
     * Returns whether the "block" at the location will collide with another existing "block".
     * This includes the edges of the board.
     * @param {number} x the x-coordinate of the block
     * @param {number} y the y-coordinate of the block
     */
    willCollide(x, y) {
        let boardBlock = this.getStaticBlock(x, y)
        if (boardBlock == null) {
            return true
        }
        return !this.isStaticEmptyFromBlock(boardBlock)
    }

    /**
     * Renders the tetromino onto the sprites.
     * @param {object} tetromino the tetromino
     * @param {object} location the offset of the tetromino
     */
    renderTetromino(tetromino, location) {
        for (let tY = 0; tY < tetromino.getHeight(); tY++) {
            for (let tX = 0; tX < tetromino.getWidth(); tX++) {
                let value = tetromino.getRotationBox()[tY][tX]

                if (value == 1) {
                    let x = tX + location.x
                    let y = tY + location.y
                    let block = this.getSpriteBlock(x, y)

                    if (block != null) {
                        block.setActive(true)
                        block.setColor(tetromino.color)
                        block.setOpacity(1)
                    }
                }
            }  
        }
    }

    /**
     * Check if the tetromino at the location collides with a block.
     * @param {*} tetromino the tetromino
     * @param {number} x the x-coordinate of the tetromino
     * @param {number} y the y-coordinate of the tetromino
     */
    tetrominoCollides(tetromino, x, y) {
        for (let tY = 0; tY < tetromino.getHeight(); tY++) {
            for (let tX = 0; tX < tetromino.getWidth(); tX++) {
                let value = tetromino.getRotationBox()[tY][tX]

                if (value === 1) {
                    let blockX = tX + x
                    let blockY = tY + y
                    
                    if (this.willCollide(blockX, blockY)) {
                        return true
                    }
                }
            }
        }

        return false
    }

    /**
     * Places the tetromino down onto the location.
     * @param {object} tetromino the tetromino to place
     * @param {number} x the x-coordinate of the tetromino
     * @param {number} y the y-coordinate of the tetromino
     */
    placeTetromino(tetromino, x, y) {
        for (let tY = 0; tY < tetromino.getHeight(); tY++) {
            for (let tX = 0; tX < tetromino.getWidth(); tX++) {
                let value = tetromino.getRotationBox()[tY][tX]

                if (value == 1) {
                    let blockX = tX + x
                    let blockY = tY + y
                    
                    this.setStaticBlock(tetromino.color, blockX, blockY)
                }
            }
        }
    }

    /**
     * Draws the ghost pieces underneath the tetromino.
     * @param {object} tetromino the tetromino to draw
     * @param {object} location the location of the tetromino
     */
    drawGhostPieces(tetromino, location, options = {}) {
        let x = location.x
        let y = location.y

        let rotation = tetromino.currentShapeIndex

        if (options.rotation !== undefined) {
            tetromino.currentShapeIndex = options.rotation
        }

        /* First: find the offset needed until the Tetromino offsets something */
        let offset = 0
        while (!this.tetrominoCollides(tetromino, x, y + offset)) {
            offset += 1
        }

        /**
         * There is no ghost pieces: return
         */
        if (offset <= 1) {
            return false
        }

        offset -= 1

        /* Then draw the tetromino pieces onto the sprite board, with opacity */
        for (let tY = 0; tY < tetromino.getHeight(); tY++) {
            for (let tX = 0; tX < tetromino.getWidth(); tX++) {
                let value = tetromino.getRotationBox()[tY][tX]

                if (value == 1) {
                    let blockX = tX + x
                    let blockY = tY + y + offset
                    
                    let spriteBlock = this.getSpriteBlock(blockX, blockY)
                    if (spriteBlock != null) {
                        spriteBlock.setColor(options.color ? options.color : tetromino.color)
                        spriteBlock.setActive(true)
                        spriteBlock.setOpacity(options.opacity ? options.opacity : 0.5)
                    }
                }
            }
        }

        if (options.rotation !== undefined) {
            // Reset back to original rotation
            tetromino.currentShapeIndex = rotation
        }

        return true
    }

    /**
     * Check for line clears.
     * Returns the number of lines cleared.
     */
    checkForClear() {
        let cleared = 0
        for (let y = 0; y < this.height; y++) {
            let row = this.staticBoard[y]
            let fullRow = true
            for (let x = 0; x < this.width && fullRow; x++) {
                if (this.isStaticEmptyFromLocation(x, y)) {
                    fullRow = false
                }
            }

            if (fullRow) {
                cleared += 1

                /* Blank out the current row. */
                for (let x = 0; x < this.width; x++) {
                    this.staticBoard[y][x] = 0
                }

                /* Shift all the above rows down and add a blank row on top. */
                this.staticBoard.splice(y, 1)
                this.staticBoard.unshift(row)
            }
        }

        return cleared
    }

    /**
     * Returns if the board is empty.
     */
    checkForPerfectClear() {
        /* Check from the bottom up to hopefully reduce the runtime */
        for (let y = this.height - 1; y >= 0; y--) {
            for (let x = 0; x < this.width; x++) {
                if (!this.isStaticEmptyFromBlock(this.staticBoard[y][x])) {
                    return false
                }
            }
        }
        return true
    }

    /**
     * Creates garbage at random columns.
     * @param {number} column the column to create the garbage in
     */
    createGarbage(amount) {
        let column = Math.floor(Math.random() * this.width)
        for (let i = 0; i < amount; i++) {
            if (Math.random() > Rules.GARBAGE_IN_SAME_COLUMN) {
                column = Math.floor(Math.random() * this.width)
            }

            let row = []
            for (let x = 0; x < this.width; x++) {
                if (x == column) {
                    row[x] = 0
                } else {
                    row[x] = Colors.GRAY
                }
            }

            /* Push the row to the back and shift the top row away */
            this.staticBoard.push(row)
            this.staticBoard.shift()
        }
    }

    /**
     * Converts the static blocks into sprites.
     */
    update() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let spriteBlock = this.spriteBoard[y][x]
                let staticBlock = this.staticBoard[y][x]

                spriteBlock.setColor(staticBlock)
                if (y >= this.obstructTop) {
                    spriteBlock.setActive(!this.isStaticEmptyFromBlock(staticBlock))
                } else {
                    spriteBlock.setActive(false)
                }
                spriteBlock.setOpacity(1)
            }
        }
    }
}