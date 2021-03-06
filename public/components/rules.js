var RULES_DROP = 1

class Rules {
    /**
     * The max amount of lock delay resets that can be done before the piece forcefully locks.
     */
    static get MAX_RESET() {
        return 25
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
        return RULES_DROP
    }

    static set DROP_TIMER(newDrop) {
        RULES_DROP = newDrop
    }

    static get DROP_TIMER_NORMAL() {
        return 1
    }

    static get DROP_TIMER_FAST() {
        return 0
    }

    /**
     * The time it takes for the player to input any final action when the piece touches the board.
     */
    static get INACTIVE_TIMER() {
        return 1
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
     * Whether the initial hold system (IHS) is enabled.
     */
    static get IHS_ENABLED() {
        return false
    }

    /**
     * Whether the initial rotation system (IRS) is enabled.
     */
    static get IRS_ENABLED() {
        return false
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
        } else if (combo >= 6 && combo <= 11) {
            return 3
        } else if (combo >= 12) {
            return 4
        } else {
            return 0
        }
    }

    /**
     * Computes the number of garbage from an action.
     */
    static computeGarbage(cleared, spin, combo, backToBack, enableCombo) {
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
        if (backToBack && (spin >= TTetromino.MINI_T_SPIN || cleared == 4)) {
            defaultGarbage += 1
        }

        if (enableCombo) {
            defaultGarbage += Rules.getGarbageBonusFromCombo(combo)
        }
        return defaultGarbage
    }
}
