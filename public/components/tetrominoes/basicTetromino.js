/**
 * Every tetromino besides the O tetromino is a basic tetromino.
 * That is, according to SRS, they employ the same offsets.
 */
class BasicTetromino extends Tetromino {
    constructor(name, color, shape) {
        super(name, color, shape)

        this.offsets = []

        this.createOffsets()
    }

    createOffsets() {
        this.offsets = [
            [ [0, 0], [0, 0], [0, 0], [0, 0], [0, 0] ], // Original
            [ [0, 0], [1, 0], [1, -1], [0, 2], [1, 2] ], // Rotated right
            [ [0, 0], [0, 0], [0, 0], [0, 0], [0, 0] ], // Rotated 180
            [ [0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2] ]  // Rotated left
        ]
    }

    /**
     * Tries to rotate the tetromino into the board, employing offsets if necessary.
     * Should be overridden.
     * @param {object} board the board
     * @param {object} location the location of the tetromino
     * @param {object} clockwise whether to rotate the piece clockwise
     * @returns -1 if unsuccessful, the offset number otherwise
     */
    tryRotate(board, location, clockwise) {
        let nextRotationBox = -1
        if (clockwise) {
            nextRotationBox = 1
        }
        let nextRotationState = ((this.currentShapeIndex + nextRotationBox) + this.rotationBoxes.length) % this.rotationBoxes.length

        /**
         * Test each of the offsets, in order.
         * If the next offset is A, and the current offset is B, we calculate B - A.
         */
        for (let i = 0; i < this.offsets[0].length; i++) {
            let offsetA = this.offsets[this.currentShapeIndex][i]
            let offsetB = this.offsets[nextRotationState][i]
            let kick = [offsetA[0] - offsetB[0], offsetA[1] - offsetB[1]]

            // Offsets are set so that Y points up.
            // Our Y values are pointing down, so we need to invert the kick's Y coordinate
            kick[1] = -kick[1]

            /* Apply the kick and see if it succeeds. */
            if (clockwise) {
                this.rotateRight()
            } else {
                this.rotateLeft()
            }
            if (
                !board.tetrominoCollides(
                    this,
                    location.x + kick[0],
                    location.y + kick[1]
                )
            ) {
                location.x += kick[0]
                location.y += kick[1]

                return i
            } else {
                /* Reverse the rotation */
                if (clockwise) {
                    this.rotateLeft()
                } else {
                    this.rotateRight()
                }
            }
        }

        /* No kicks work. */
        return -1
    }
}