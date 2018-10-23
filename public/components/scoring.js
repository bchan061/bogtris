/**
 * Handles the scoring.
 */

class Scoring {
    /**
     * Returns the increment in score for an action.
     */
    static getScoreDelta(lines, spin, combo, backToBack) {
        let increment = 0
        switch (lines) {
            case 0:
                if (spin == 2) {
                    increment = Scoring.TSPIN
                } else if (spin == 1) {
                    increment = Scoring.MINI_TSPIN
                }
                break
            case 1:
                if (spin == 2) {
                    increment = Scoring.TSPIN_SINGLE
                } else if (spin == 1) {
                    increment = Scoring.MINI_TSPIN + Scoring.SINGLE
                } else {
                    increment = Scoring.SINGLE
                }
                break
            case 2:
                if (spin == 2) {
                    increment = Scoring.TSPIN_DOUBLE
                } else if (spin == 1) {
                    increment = Scoring.MINI_TSPIN + Scoring.DOUBLE
                } else {
                    increment = Scoring.DOUBLE
                }
                break
            case 3:
                if (spin == 1 || spin == 2) {
                    increment = Scoring.TSPIN_TRIPLE
                } else {
                    increment = Scoring.TRIPLE
                }
                break
            case 4:
                increment = Scoring.TETRIS
                break
        }

        if (backToBack > 0) {
            increment *= Scoring.BACK_TO_BACK_MULTIPLIER
        }
        increment += Scoring.getComboBonus(combo)

        return increment
    }

    /**
     * The following are constant scores, according to their labels.
     */
    static get SOFT_DROP() {
        return 1   
    }
    static get HARD_DROP() {
        return 2
    }

    static get SINGLE() {
        return 100
    }

    static get DOUBLE() {
        return 300
    }

    static get TRIPLE() {
        return 500
    }

    static get TETRIS() {
        return 800
    }

    static get TSPIN_SINGLE() {
        return 800
    }

    static get TSPIN_DOUBLE() {
        return 1200   
    }
    
    static get TSPIN_TRIPLE() {
        return 1600
    }

    static get PERFECT_CLEAR() {
        return 2000
    }

    static get TSPIN() {
        return 400
    }

    static get MINI_TSPIN() {
        return 100
    }

    static get BACK_TO_BACK_MULTIPLIER() {
        return 1.5
    }

    static getComboBonus(combo) {
        let comboBonus = (combo - 1) * 50
        if (comboBonus < 0) {
            return 0
        } else {
            return comboBonus
        }
    }
}
