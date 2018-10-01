class Tetromino {
    constructor(name, color, originalShape) {
        this.name = name
        this.color = color
        this.shape = originalShape
        this.rotationBoxes = []
        this.currentShapeIndex = 0

        this.generateRotationBoxes()
    }

    getHeight() {
        return this.getRotationBox().length
    }

    getWidth() {
        return this.getRotationBox()[0].length
    }

    reset() {
        this.currentShapeIndex = 0
    }

    rotateRight() {
        this.currentShapeIndex = (this.currentShapeIndex + 1) % this.rotationBoxes.length
    }
    
    rotateLeft() {
        this.currentShapeIndex = ((this.currentShapeIndex - 1) + this.rotationBoxes.length) % this.rotationBoxes.length
    }

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

    getRotationBox() {
        return this.rotationBoxes[this.currentShapeIndex]
    }

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
}