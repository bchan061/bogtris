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

    static get GRAY() {
        return 0x999999
    }
}

class GraphicsConstants {
    /**
     * Returns the default width of the screen.
     */
    static get DEFAULT_SCREEN_WIDTH() {
        return 480
    }

    /**
     * Returns the default width of the screen when playing multiplayer
     */
    static get MULTIPLAYER_SCREEN_WIDTH() {
        return 854
    }

    /**
     * Returns the default height of the screen.
     */
    static get DEFAULT_SCREEN_HEIGHT() {
        return 480
    }

    /**
     * Updates the block size.
     */
    static updateBlockSize() {
        GraphicsConstants.BLOCK_SIZE = Math.min(
            GraphicsConstants.SCREEN_WIDTH,
            GraphicsConstants.SCREEN_HEIGHT
        ) / 28
    }

    /**
     * Returns how much rows on the top are obstructed.
     */
    static get OBSTRUCT_TOP() {
        return 5
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
