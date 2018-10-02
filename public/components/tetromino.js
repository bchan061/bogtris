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

        this.generateRotationBoxes()
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
     * Tries to rotate the tetromino in the current board and location.
     * May modify the location as part SRS.
     */
    tryRotate(board, location) {
        
    }
}