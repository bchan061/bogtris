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
     * @param {*} value 
     */
    static getRelativeToSmallestScreenDimension(value) {
        return value * Math.min(GraphicsConstants.SCREEN_WIDTH, GraphicsConstants.SCREEN_HEIGHT)
    }
}