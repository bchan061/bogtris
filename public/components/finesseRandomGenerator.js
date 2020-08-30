class FinesseRandomGenerator extends RandomGenerator {
    constructor(tetrominoes) {
        super(tetrominoes, 1)
    }

    createNewBag() {
        for (let i = 0; i < this.tetrominoArray.length; i++) {
            this.bag[i] = this.tetromino ? this.tetromino : this.tetrominoes.oTetromino
        }
    }
}
