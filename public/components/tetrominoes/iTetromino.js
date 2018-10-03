class ITetromino extends BasicTetromino {
    constructor() {
        super(
            "I",
            Colors.CYAN,
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]
        )
    }

    createOffsets() {
        this.offsets = [
            [ [0, 0], [-1, 0], [2, 0], [-1, 0], [2, 0] ], // Original
            [ [-1, 0], [0, 0], [0, 0], [0, 1], [0, -2] ], // Rotated right
            [ [-1, 1], [1, 1], [-2, 1], [1, 0], [-2, 0] ], // Rotated 180
            [ [0, 1], [0, 1], [0, 1], [0, -1], [0, 2] ]  // Rotated left
        ]
    }
}