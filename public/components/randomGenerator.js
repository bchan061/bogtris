class RandomGenerator {
    /**
     * Initializes a random generator, with a new bag and queue.
     * @param {object} tetrominoes a Tetrominoes object, specified in Tetrominoes.js
     */
    constructor(tetrominoes) {
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

        this.fillQueueWithBag()
    }

    /**
     * Shuffles the array of tetrominoes via Fisher-Yates.
     */
    shuffleTetrominoes() {
        /* Fisher-Yates */

        for (let i = this.tetrominoArray.length - 1; i >= 1; i--) {
            let j = Math.floor(Math.random() * (i + 1))
            let temp = this.tetrominoArray[j]
            this.tetrominoArray[j] = this.tetrominoArray[i]
            this.tetrominoArray[i] = temp
        }
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
     * Pops a tetromino from the queue.
     */
    popFromQueue() {
        let tetromino = this.queue.shift()
        tetromino.reset()

        this.fillQueueWithBag()
        return tetromino
    }
}