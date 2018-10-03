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
    }

    /**
     * Returns the appropriate spawning location for the tetromino.
     * @param {object} tetromino the tetromino to spawn in
     * @param {object} board the board
     */
    getSpawningLocation(tetromino, board) {
        let top = board.obstructTop
        let x = board.width / 2 - Math.ceil(tetromino.getWidth() / 2)

        return {
            x: x,
            y: top
        }
    }
}