class Utilities {
    /**
     * Changes a number of lines into its respective name.
     * (e.g. 1 => "Single", 2 => "Double"...)
     * @param {number} number the lines
     */
    static numberToCount(number) {
        switch(number) {
            case 1:
                return "Single"
            case 2:
                return "Double"
            case 3:
                return "Triple"
            case 4:
                return "Tetris"
            default:
                return ""
        }
    }

    /**
     * Returns a value relative to the smallest screen dimension.
     * Useful for fonts.
     * @param {number} value the value to scale
     */
    static getRelativeToSmallestScreenDimension(value) {
        return value * Math.min(GraphicsConstants.SCREEN_WIDTH, GraphicsConstants.SCREEN_HEIGHT)
    }

    /**
     * Returns a copy of a 2D array.
     * @param {object} array the 2D array to copy
     */
    static clone2DArray(array) {
        return array.map((arr) => {
                return arr.slice()
            }
        )
    }
}