/**
 * Includes both the random generator and the next queue.
 */
class RandomGenerator {
    /**
     * Initializes a random generator, with a new bag and queue.
     * @param {object} tetrominoes a Tetrominoes object, specified in Tetrominoes.js
     */
    constructor(tetrominoes, nextPieces = Rules.NEXT_PIECES) {
        this.queue = []
        this.queueLength = 7
        this.bag = []
        this.tetrominoes = tetrominoes
        this.tetrominoArray = [
            tetrominoes.iTetromino,
            tetrominoes.tTetromino,
            tetrominoes.jTetromino,
            tetrominoes.lTetromino,
            tetrominoes.sTetromino,
            tetrominoes.zTetromino,
            tetrominoes.oTetromino,
        ]
        this.nextPieces = nextPieces

        this.nextOffset = new PIXI.Point(250, 50)
        this.nextContainer = new PIXI.Container()
        this.nextText = new PIXI.extras.BitmapText(
            "Next",
            {
                font: Utilities.getRelativeToSmallestScreenDimension(0.05) + 'px Exo2Medium',
                fill: 'white',
            }
        )
        this.nextText.position.set(
            (10 * GraphicsConstants.BLOCK_SIZE) + 4 * GraphicsConstants.BLOCK_SIZE,
            4 * GraphicsConstants.BLOCK_SIZE
        )
        this.nextContainer.addChild(this.nextText)
        this.nextContainers = []
        for (let i = 0; i < this.nextPieces; i++) {
            this.nextContainers[i] = new PIXI.Container()
            this.nextContainers[i].position.set(
                (10 * GraphicsConstants.BLOCK_SIZE) + 4 * GraphicsConstants.BLOCK_SIZE,
                8 * GraphicsConstants.BLOCK_SIZE + (i * 3 * GraphicsConstants.BLOCK_SIZE)
            )

            if (i == 0) {
                this.nextContainers[i].position.y -= 2 * GraphicsConstants.BLOCK_SIZE
                this.nextContainers[i].alpha = 1
            } else {
                /* Fade the other next pieces a little bit */
                this.nextContainers[i].alpha = 0.4
            }

            this.nextContainer.addChild(this.nextContainers[i])
        }

        this.fillQueueWithBag()
        this.fillNextSprites()
    }

    /**
     * Fills all of the next queue with the sprites of the tetromino.
     */
    fillNextSprites() {
        for (let i = 0; i < this.nextContainers.length; i++) {
            let container = this.nextContainers[i]
            let tetromino = this.queue[i]

            let sprite = tetromino.getSprite()
            if (sprite != null) {
                container.addChild(sprite)
            }
        }
    }

    /**
     * Shifts all of the containers up.
     */
    shiftNextSprites() {
        /* Remove the tetromino's sprite. */
        let removedContainer = this.nextContainers[0]
        let removedTetromino = this.queue[0]
        if (removedContainer.children.length == 1) {
            let removedSprite = removedContainer.children[0]
            removedTetromino.releaseSprite(removedSprite)
            removedContainer.removeChildren()
        }

        /* Remove the top container and push it to the bottom. */
        removedContainer.y = 8 * GraphicsConstants.BLOCK_SIZE +
            ((this.nextPieces - 1) * 3 * GraphicsConstants.BLOCK_SIZE)
        removedContainer.alpha = 0.4
        this.nextContainers.shift()
        this.nextContainers.push(removedContainer)

        /* Shift all containers down. */
        for (let i = 0; i < this.nextContainers.length - 1; i++) {
            let container = this.nextContainers[i]
            container.position.y -= 3 * GraphicsConstants.BLOCK_SIZE

            if (i == 0) {
                this.nextContainers[i].position.y -= 2 * GraphicsConstants.BLOCK_SIZE
                this.nextContainers[i].alpha = 1
            } else {
                /* Fade the other next pieces */
                this.nextContainers[i].alpha = 0.4
            }
        }

        let newTetromino = this.queue[this.nextPieces]
        let newSprite = newTetromino.getSprite()
        if (newSprite != null) {
            removedContainer.addChild(newSprite)
        }
    }

    /**
     * Shuffles the array of tetrominoes via Fisher-Yates.
     */
    shuffleTetrominoes() {
        Utilities.shuffleArray(this.tetrominoArray)
    }

    /**
     * Creates a new bag.
     */
    createNewBag() {
        this.shuffleTetrominoes()
        for (let i = 0; i < this.tetrominoArray.length; i++) {
            this.bag[i] = this.tetrominoArray[i]
        }
    }

    /**
     * Returns whether the bag is empty or not.
     */
    isBagEmpty() {
        return this.bag.length == 0
    }

    /**
     * Fills the queue with tetrominoes from the bag, until it reaches this.queueLength.
     */
    fillQueueWithBag() {
        while (this.queue.length < this.queueLength) {
            if (this.isBagEmpty()) {
                this.createNewBag()
            }

            let bagTetromino = this.bag.shift()

            this.queue.push(bagTetromino)
        }
    }

    /**
     * Clears the whole queue and bag.
     */
    clearQueueAndBag() {
        this.createNewBag()
        let previousQueueLength = this.queue.length
        for (let i = 0; i < previousQueueLength; i++) {
            this.popFromQueue()
        }
    }

    /**
     * Pops a tetromino from the queue.
     */
    popFromQueue() {
        this.shiftNextSprites()

        let tetromino = this.queue.shift()
        tetromino.reset()

        this.fillQueueWithBag()
        return tetromino
    }
}