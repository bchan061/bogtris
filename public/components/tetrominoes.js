class Tetrominoes {
    constructor() {
        this.createTetrominoes()
    }

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
            "J",
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
}