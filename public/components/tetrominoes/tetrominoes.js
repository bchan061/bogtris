class Tetrominoes {
    /**
     * Initializes the tetrominoes.
     */
    constructor() {
        this.createTetrominoes()
    }

    /**
     * Creates the tetrominoes.
     */
    createTetrominoes() {
        this.iTetromino = new ITetromino()
        this.tTetromino = new TTetromino()
        this.jTetromino = new BasicTetromino(
            "J",
            Colors.BLUE,
            [
                [1, 0, 0],
                [1, 1, 1],
                [0, 0, 0]
            ]
        )
        this.lTetromino = new BasicTetromino(
            "L",
            Colors.ORANGE,
            [
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 0]
            ]
        )
        this.oTetromino = new Tetromino(
            "O",
            Colors.YELLOW,
            [
                [1, 1],
                [1, 1]
            ]
        )
        this.sTetromino = new BasicTetromino(
            "S",
            Colors.GREEN,
            [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0]
            ]
        )
        this.zTetromino = new BasicTetromino(
            "Z",
            Colors.RED,
            [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0]
            ]
        )
        this.tetrominoArray = [
            this.iTetromino,
            this.tTetromino,
            this.oTetromino,
            this.sTetromino,
            this.zTetromino,
            this.jTetromino,
            this.lTetromino
        ]
    }

    /**
     * Tests all tetrominoes and rotations.
     */
    testTetrominoes() {
        console.log("Testing tetrominoes and rotations.")
        for (let tetrominoIndex in this.tetrominoArray) {
            let tetromino = this.tetrominoArray[tetrominoIndex]

            tetromino.reset()
            console.log("Initial rotation [" + tetromino.name + "]")
            tetromino.logBox()
            console.log("90 degree rotation right [" + tetromino.name + "]")
            tetromino.rotateRight()
            tetromino.logBox()
            console.log("180 degree rotation [" + tetromino.name + "]")
            tetromino.rotateRight()
            tetromino.logBox()
            console.log("270 degree rotation [" + tetromino.name + "]")
            tetromino.rotateRight()
            tetromino.logBox()

            tetromino.reset()
        }
    }
}