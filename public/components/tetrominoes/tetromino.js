/**
 * A tetromino.
 */
class Tetromino {
    /**
     * Initializes a tetromino.
     * @param {string} name the name of the tetromino
     * @param {number} color the color of the tetromino
     * @param {array} originalShape the shape of the tetromino when spawned
     */
    constructor(name, color, originalShape) {
        this.name = name
        this.color = color
        this.shape = originalShape
        this.rotationBoxes = []
        this.currentShapeIndex = 0
        this.sprites = [new PIXI.Container(), new PIXI.Container(), new PIXI.Container()]
        this.usedSprites = [false, false, false]

        this.generateRotationBoxes()

        this.createSprites()
    }

    /**
     * Gets a sprite container from the pool of sprites, if available.
     */
    getSprite() {
        for (let i = 0; i < this.usedSprites.length; i++) {
            let isPossible = this.usedSprites[i]
            if (!isPossible) {
                this.usedSprites[i] = true
                return this.sprites[i]
            }
        }

        console.log("Warning: no free sprites for tetromino " + this.name)

        return null
    }

    /**
     * Adds a sprite container back into the pool.
     */
    releaseSprite(container) {
        for (let i = 0; i < this.sprites.length; i++) {
            let sprite = this.sprites[i]
            if (sprite == container) {
                this.usedSprites[i] = false
                return
            }
        }
        console.log("Warning: can't find container to release! (" + this.name +")")
    }

    /**
     * Creates a sprite (really a container of blocks) for the tetromino.
     * Applies this to all three containers.
     */
    createSprites() {
        for (let y = 0; y < this.shape.length; y++) {
            for (let x = 0; x < this.shape[0].length; x++) {
                let block = this.shape[y][x]

                if (block == 1) {
                    for (let i = 0; i < this.sprites.length; i++) {
                        let sprite = new PIXI.Sprite(PIXI.loader.resources["assets/block.svg"].texture)
                        sprite.position.set(x * GraphicsConstants.BLOCK_SIZE, y * GraphicsConstants.BLOCK_SIZE)
                        sprite.scale.set(GraphicsConstants.BLOCK_SIZE / sprite.texture.width)
                        sprite.tint = this.color
                        this.sprites[i].addChild(sprite)
                    }
                }
            }
        }
    }

    /**
     * Returns the height of the tetromino's current rotation.
     */
    getHeight() {
        return this.getRotationBox().length
    }

    /**
     * Returns the width of the tetromino's current rotation.
     */
    getWidth() {
        return this.getRotationBox()[0].length
    }

    /**
     * Resets the tetromino back to its initial position.
     */
    reset() {
        this.currentShapeIndex = 0
    }

    /**
     * Rotates the tetromino clockwise.
     */
    rotateRight() {
        this.currentShapeIndex = (this.currentShapeIndex + 1) % this.rotationBoxes.length
    }
    
    /**
     * Rotates the tetromino counter-clockwise.
     */
    rotateLeft() {
        this.currentShapeIndex = ((this.currentShapeIndex - 1) + this.rotationBoxes.length) % this.rotationBoxes.length
    }

    /**
     * Generates the tetromino's rotation boxes.
     */
    generateRotationBoxes() {
        /* First shape: the original shape */
        this.rotationBoxes.push(this.shape)

        /* Second shape: the rotated-right shape */
        let newShape = []
        for (let y = 0; y < this.shape.length; y++) {
            newShape[y] = []
            for (let x = 0; x < this.shape[0].length; x++) {
                newShape[y][x] = this.shape[this.shape[0].length - 1 - x][y]
            }
        }
        this.rotationBoxes.push(newShape)

        /* Third shape: the 180-turned shape */
        let newShape2 = []
        for (let y = 0; y < this.shape.length; y++) {
            newShape2[y] = []
            for (let x = 0; x < this.shape[0].length; x++) {
                newShape2[y][x] = this.shape[this.shape.length - 1 - y][this.shape[0].length - 1 - x]
            }
        }

        this.rotationBoxes.push(newShape2)

        /* Fourth shape: the rotated-left shape */
        let newShape3 = []
        for (let y = 0; y < this.shape.length; y++) {
            newShape3[y] = []
            for (let x = 0; x < this.shape[0].length; x++) {
                newShape3[y][x] = this.shape[x][this.shape.length - 1 - y]
            }
        }

        this.rotationBoxes.push(newShape3)
    }

    /**
     * Returns the tetromino's current rotation box.
     */
    getRotationBox() {
        return this.rotationBoxes[this.currentShapeIndex]
    }

    /**
     * Logs the current rotation box.
     */
    logBox() {
        console.log(this.name + " Tetromino: ")
        let currentBox = this.getRotationBox()
        for (let y = 0; y < this.getHeight(); y++) {
            let row = "[" + y + "] "
            for (let x = 0; x < this.getWidth(); x++) {
                row += currentBox[y][x]
            }
            console.log(row)
        }
    }
    
    /**
     * Tries to rotate the tetromino into the board, employing offsets if necessary.
     * Should be overridden.
     * @param {object} board the board
     * @param {object} location the location of the tetromino
     * @param {object} clockwise whether to rotate the piece clockwise
     */
    tryRotate(board, location, clockwise) {
        if (clockwise) {
            this.rotateRight()
        } else {
            this.rotateLeft()
        }

        if (
            board.tetrominoCollides(
                this,
                location.x,
                location.y
            )
        ) {
            if (clockwise) {
                this.rotateLeft()
            } else {
                this.rotateRight()
            }

            return false
        }

        Sounds.rotate.play()
        return true
    }
    
    /**
     * Returns the offset of the spawning tetromino from the bottom of the box.
     */
    getOffsetFromBottom() {
        // Cache result
        if (this.offsetFromBottom) {
            return this.offsetFromBottom
        }
        
        let rotationBox = this.rotationBoxes[0]
        for (let y = this.getHeight() - 1; y >= 0; y--) {
            for (let x = 0; x <= this.getWidth(); x++) {
                if (rotationBox[y][x] === 1) {
                    this.offsetFromBottom = this.getHeight() - 1 - y
                    return this.offsetFromBottom
                }
            }
        }
        return y;
    }
}