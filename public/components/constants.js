class Colors {
    static get CYAN() {
        return 0x00FFFF
    }

    static get BLUE() {
        return 0x0000FF
    }

    static get ORANGE() {
        return 0xFF8000
    }

    static get YELLOW() {
        return 0xFFFF00
    }

    static get GREEN() {
        return 0x00FF00
    }

    static get PURPLE() {
        return 0x800080
    }

    static get RED() {
        return 0xFF0000
    }
}

class GraphicsConstants {
    /**
     * Returns the default width of the screen.
     */
    static get SCREEN_WIDTH() {
        return 480
    }

    /**
     * Returns the default height of the screen.
     */
    static get SCREEN_HEIGHT() {
        return 480
    }

    /**
     * Returns the block size, in pixels.
     */
    static get BLOCK_SIZE() {
        return 18
    }

    /**
     * Returns how much rows on the top are obstructed.
     */
    static get OBSTRUCT_TOP() {
        return 5
    }
}

class Rules {
    /**
     * The max rotations acceptable before the piece is automatically placed down without any leeway.
     */
    static get MAX_ROTATIONS() {
        return 20
    }

    /**
     * The number of pieces visible in the next queue.
     */
    static get NEXT_PIECES() {
        return 5
    }

    /**
     * The time it takes to drop a tetromino without any action.
     */
    static get DROP_TIMER() {
        return 1
    }

    /**
     * The time it takes for the player to input any final action when the piece touches the board.
     */
    static get INACTIVE_TIMER() {
        return 1
    }
}

class Timings {
    /**
     * Delayed auto-shift (DAS): delay when holding a key down before moving the tetromino fast.
     */
    static get DAS() {
        return 0.2
    }

    /**
     * Auto-repeat rate (ARR): time it takes to fast move a tetromino after DAS.
     */
    static get ARR() {
        return 0.033
    }
}
