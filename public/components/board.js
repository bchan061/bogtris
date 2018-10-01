/**
 * The board.
 */
class Board {
    /**
     * Initializes the board.
     * @param {object} game a reference to the game
     * @param {number} width the width of the board
     * @param {number} height the height of the board
     */
    constructor(game, width = 10, height = 25) {
        /* Obstruct the top 5 rows, so that only (typically) 20 rows are visible. */
        const OBSTRUCT_TOP = 5
        const BLOCK_SIZE = 18

        this.width = width
        this.height = height
        this.blockSize = BLOCK_SIZE
        this.obstructTop = OBSTRUCT_TOP
        this.game = game
        this.spriteBoard = new Array(this.height)
        this.staticBoard = new Array(this.height)
        this.offset = new PIXI.Point(18, 18)
        this.blockTexture = PIXI.loader.resources["assets/block.svg"].texture

        this.initBoard = this.initBoard.bind(this)

        this.initBoard()
    }

    /**
     * Creates the arrays for the active and static block values.
     */
    initBoard() {
        for (let y = 0; y < this.height; y++) {
            let spriteRow = new Array(this.width)
            let staticRow = new Array(this.width)
            for (let x = 0; x < this.width; x++) {
                let block = new Block(this)
                block.set(x, y)

                this.game.application.stage.addChild(block.sprite)

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

                if (value == 1) {
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
     * Converts the static blocks into sprites.
     */
    update() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let spriteBlock = this.spriteBoard[y][x]
                let staticBlock = this.staticBoard[y][x]

                spriteBlock.setColor(staticBlock)
                spriteBlock.setActive(!this.isStaticEmptyFromBlock(staticBlock))
            }
        }
    }
}