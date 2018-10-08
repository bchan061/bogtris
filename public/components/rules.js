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

    /**
     * The amount of pieces that can be dropped before the back-to-back bonus gets removed.
     */
    static get BACK_TO_BACK() {
        return 10
    }

    /**
     * The probability that the garbage lands in the same column.
     */
    static get GARBAGE_IN_SAME_COLUMN() {
        return 0.7
    }

    /**
     * The amount of garbage for a perfect clear.
     */
    static get PERFECT_CLEAR_GARBAGE() {
        return 10
    }

    /**
     * Returns the bonus for achieving a combo.
     * @param {number} combo the combo
     */
    static getGarbageBonusFromCombo(combo) {
        if (combo >= 2 && combo <= 3) {
            return 1
        } else if (combo >= 4 && combo <= 5) {
            return 2
        } else if (combo >= 6 && combo <= 7) {
            return 3
        } else if (combo >= 8) {
            return 4
        } else {
            return 0
        }
    }

    /**
     * Computes the number of garbage from an action.
     */
    static computeGarbage(cleared, spin, combo, backToBack) {
        let defaultGarbage = 0
        switch (cleared) {
            case 1:
                if (spin == TTetromino.T_SPIN) {
                    defaultGarbage = 2
                } else {
                    defaultGarbage = 0
                }
                break;
            case 2:
                if (spin == TTetromino.T_SPIN) {
                    defaultGarbage = 4
                } else {
                    defaultGarbage = 1
                }
                break;
            case 3:
                if (spin == TTetromino.T_SPIN) {
                    defaultGarbage = 6
                } else {
                    defaultGarbage = 2
                }
                break;
            case 4:
                defaultGarbage = 4
                break;
        }

        if (backToBack > 0 && (this.spin >= TTetromino.MINI_T_SPIN || cleared == 4)) {
            defaultGarbage += 1
        }

        return defaultGarbage + Rules.getGarbageBonusFromCombo(combo)
    }
}
