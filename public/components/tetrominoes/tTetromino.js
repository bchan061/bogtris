class TTetromino extends BasicTetromino {
    static get MINI_T_SPIN() {
        return 1
    }

    static get T_SPIN() {
        return 2
    }

    constructor() {
        super(
            "T",
            Colors.PURPLE,
            [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0]
            ]
        )
    }

    /**
     * Checks if the current T tetromino resulted from a spin.
     * Returns 0 if no spin, 1 for mini, and 2 for a full-spin.
     */
    checkTSpin(board, location) {
        /* Check the corners of the t tetromino. */

        let corner1 = board.willCollide(location.x, location.y)
        let corner2 = board.willCollide(location.x + 2, location.y)
        let corner3 = board.willCollide(location.x + 2, location.y + 2)
        let corner4 = board.willCollide(location.x, location.y + 2)
        let corners = [corner1, corner2, corner3, corner4]

        let total = corner1 + corner2 + corner3 + corner4
        if (total >= 3) {
            let required = [0, 1]
            let rotationState = this.currentShapeIndex
            required[0] = (required[0] + rotationState) % this.rotationBoxes.length
            required[1] = (required[1] + rotationState) % this.rotationBoxes.length
            if (corners[required[0]] == 1 && corners[required[1]] == 1) {
                return TTetromino.T_SPIN
            } else {
                return TTetromino.MINI_T_SPIN
            }
        }

        return 0
    }
}