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
     * Returns a random element in the array.
     * @param {array} array the array
     */
    static randomElementInArray(array) {
        return array[Math.floor(Math.random() * array.length)]
    }

    /**
     * Shuffles the array inplace.
     * @param {array} array the array
     */
    static shuffleArray(array) {
        /* Fisher-Yates */

        for (let i = array.length - 1; i >= 1; i--) {
            let j = Math.floor(Math.random() * (i + 1))
            let temp = array[j]
            array[j] = array[i]
            array[i] = temp
        }

        return array
    }

    /**
     * Checks if two arrays have the same elements.
     * @param {array} arr1 one array
     * @param {array} arr2 another array
     */
    static containSameElements(arr1, arr2) {
        return arr1.every(item => arr2.includes(item)) && arr2.every(item => arr1.includes(item))
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