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
        this.iTetromino = new Tetromino(
            "I",
            Colors.CYAN,
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]
        )
        this.tTetromino = new Tetromino(
            "T",
            Colors.PURPLE,
            [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0]
            ]
        )
        this.jTetromino = new Tetromino(
            "J",
            Colors.BLUE,
            [
                [1, 0, 0],
                [1, 1, 1],
                [0, 0, 0]
            ]
        )
        this.lTetromino = new Tetromino(
            "l",
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
        this.sTetromino = new Tetromino(
            "S",
            Colors.GREEN,
            [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0]
            ]
        )
        this.zTetromino = new Tetromino(
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