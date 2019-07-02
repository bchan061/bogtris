class OTetromino extends BasicTetromino {
    constructor() {
        super(
            "O",
            Colors.YELLOW,
            [
                [0, 1, 1],
                [0, 1, 1],
                [0, 0, 0]
            ]
        )
    }

    createOffsets() {
        this.offsets = [
            [ [0, 0] ], // Original
            [ [0, -1] ], // Rotated right
            [ [-1, -1] ], // Rotated 180
            [ [-1, 0] ]  // Rotated left
        ]
    }
}