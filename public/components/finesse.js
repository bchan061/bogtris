class Finesse {
    constructor(tetromino, orientations, x, steps, strict = true) {
        this.tetromino = tetromino
        this.orientations = orientations
        this.x = x
        this.steps = steps
        this.strict = strict
    }
}

class FinesseStep {
    static get DAS_LEFT() {
        return "DAS Left"
    }

    static get DAS_RIGHT() {
        return "DAS Right"
    }

    static get LEFT() {
        return "Left"
    }

    static get RIGHT() {
        return "Right"
    }

    static get ROTATE_CLOCKWISE() {
        return "CW"
    }

    static get ROTATE_COUNTERCLOCKWISE() {
        return "CCW"
    }

    static get ROTATE_TWICE() {
        return "Rotate Twice"
    }
}

class Finesses {
    constructor(tetrominoes) {
        this.initMaps(tetrominoes)
        this.addAllFinesses(tetrominoes)
    }

    initMaps(tetrominoes) {
        this.finesses = new Map()
        this.finessesSet = new Map()
        for (let tetromino of tetrominoes.tetrominoArray) {
            // Map tetromino
            this.finesses.set(tetromino, new Map())
            for (let i = 0; i < 4; i++) {
                // Map each orientation
                let orientationMap = this.finesses.get(tetromino)
                orientationMap.set(i, new Map())
            }
            
            this.finessesSet.set(tetromino, new Set())
        }
    }

    addFinesse(finesse) {
        let orientationMap = this.finesses.get(finesse.tetromino)
        for (let orientation of finesse.orientations) {
            let xMap = orientationMap.get(orientation)
            xMap.set(finesse.x, finesse.steps)
        }

        let tetrominoFinesseSet = this.finessesSet.get(finesse.tetromino)
        tetrominoFinesseSet.add({
            orientations: finesse.orientations,
            x: finesse.x,
            steps: finesse.steps,
            strict: finesse.strict
        })
    }

    getAllFinesses(tetromino) {
        return this.finessesSet.get(tetromino)
    }

    getSteps(tetromino, orientation, x) {
        try {
            let orientationMap = this.finesses.get(tetromino)
            let xMap = orientationMap.get(orientation)
            let steps = xMap.get(x)
            return steps
        } catch {
            return null
        }
    }

    addAllFinesses(tetrominoes) {
        const DAS_LEFT = FinesseStep.DAS_LEFT
        const DAS_RIGHT = FinesseStep.DAS_RIGHT
        const LEFT = FinesseStep.LEFT
        const RIGHT = FinesseStep.RIGHT
        const CCW = FinesseStep.ROTATE_COUNTERCLOCKWISE
        const CW = FinesseStep.ROTATE_CLOCKWISE
        const ROTATE_TWICE = FinesseStep.ROTATE_TWICE

        // O
        this.addFinesse(new Finesse(tetrominoes.oTetromino, [0, 1, 2, 3], 0, [DAS_LEFT]))
        this.addFinesse(new Finesse(tetrominoes.oTetromino, [0, 1, 2, 3], 1, [DAS_LEFT, RIGHT]))
        this.addFinesse(new Finesse(tetrominoes.oTetromino, [0, 1, 2, 3], 2, [LEFT, LEFT]))
        this.addFinesse(new Finesse(tetrominoes.oTetromino, [0, 1, 2, 3], 3, [LEFT]))
        this.addFinesse(new Finesse(tetrominoes.oTetromino, [0, 1, 2, 3], 4, []))
        this.addFinesse(new Finesse(tetrominoes.oTetromino, [0, 1, 2, 3], 5, [RIGHT]))
        this.addFinesse(new Finesse(tetrominoes.oTetromino, [0, 1, 2, 3], 6, [RIGHT, RIGHT]))
        this.addFinesse(new Finesse(tetrominoes.oTetromino, [0, 1, 2, 3], 7, [DAS_RIGHT, LEFT]))
        this.addFinesse(new Finesse(tetrominoes.oTetromino, [0, 1, 2, 3], 8, [DAS_RIGHT]))
        // I
        // - Horizontal
        this.addFinesse(new Finesse(tetrominoes.iTetromino, [0, 2], 0, [DAS_LEFT]))
        this.addFinesse(new Finesse(tetrominoes.iTetromino, [0, 2], 1, [LEFT, LEFT]))
        this.addFinesse(new Finesse(tetrominoes.iTetromino, [0, 2], 2, [LEFT]))
        this.addFinesse(new Finesse(tetrominoes.iTetromino, [0, 2], 3, []))
        this.addFinesse(new Finesse(tetrominoes.iTetromino, [0, 2], 4, [RIGHT]))
        this.addFinesse(new Finesse(tetrominoes.iTetromino, [0, 2], 5, [RIGHT, RIGHT]))
        this.addFinesse(new Finesse(tetrominoes.iTetromino, [0, 2], 6, [DAS_RIGHT]))
        // - Vertical
        this.addFinesse(new Finesse(tetrominoes.iTetromino, [1, 3], 0, [CCW, DAS_LEFT], false))
        this.addFinesse(new Finesse(tetrominoes.iTetromino, [1, 3], 1, [DAS_LEFT, CCW]))
        this.addFinesse(new Finesse(tetrominoes.iTetromino, [1, 3], 2, [DAS_LEFT, CW]))
        this.addFinesse(new Finesse(tetrominoes.iTetromino, [1, 3], 3, [LEFT, CCW], false))
        this.addFinesse(new Finesse(tetrominoes.iTetromino, [1, 3], 4, [CCW]))
        this.addFinesse(new Finesse(tetrominoes.iTetromino, [1, 3], 5, [CW]))
        this.addFinesse(new Finesse(tetrominoes.iTetromino, [1, 3], 6, [RIGHT, CW], false))
        this.addFinesse(new Finesse(tetrominoes.iTetromino, [1, 3], 7, [DAS_RIGHT, CCW]))
        this.addFinesse(new Finesse(tetrominoes.iTetromino, [1, 3], 8, [DAS_RIGHT, CW]))
        this.addFinesse(new Finesse(tetrominoes.iTetromino, [1, 3], 9, [CW, DAS_RIGHT], false))
        // S
        // - Horizontal
        this.addFinesse(new Finesse(tetrominoes.sTetromino, [0, 2], 0, [DAS_LEFT]))
        this.addFinesse(new Finesse(tetrominoes.sTetromino, [0, 2], 1, [LEFT, LEFT]))
        this.addFinesse(new Finesse(tetrominoes.sTetromino, [0, 2], 2, [LEFT]))
        this.addFinesse(new Finesse(tetrominoes.sTetromino, [0, 2], 3, []))
        this.addFinesse(new Finesse(tetrominoes.sTetromino, [0, 2], 4, [RIGHT]))
        this.addFinesse(new Finesse(tetrominoes.sTetromino, [0, 2], 5, [RIGHT, RIGHT]))
        this.addFinesse(new Finesse(tetrominoes.sTetromino, [0, 2], 6, [DAS_RIGHT, LEFT]))
        this.addFinesse(new Finesse(tetrominoes.sTetromino, [0, 2], 7, [DAS_RIGHT]))
        // - Vertical
        this.addFinesse(new Finesse(tetrominoes.sTetromino, [1, 3], 0, [CCW, DAS_LEFT], false))
        this.addFinesse(new Finesse(tetrominoes.sTetromino, [1, 3], 1, [DAS_LEFT, CW]))
        this.addFinesse(new Finesse(tetrominoes.sTetromino, [1, 3], 2, [CCW, LEFT], false))
        this.addFinesse(new Finesse(tetrominoes.sTetromino, [1, 3], 3, [CCW]))
        this.addFinesse(new Finesse(tetrominoes.sTetromino, [1, 3], 4, [CW]))
        this.addFinesse(new Finesse(tetrominoes.sTetromino, [1, 3], 5, [CW, RIGHT], false))
        this.addFinesse(new Finesse(tetrominoes.sTetromino, [1, 3], 6, [CW, RIGHT, RIGHT], false))
        this.addFinesse(new Finesse(tetrominoes.sTetromino, [1, 3], 7, [DAS_RIGHT, CCW]))
        this.addFinesse(new Finesse(tetrominoes.sTetromino, [1, 3], 8, [CW, DAS_RIGHT], false))
        // Z
        // - Horizontal
        this.addFinesse(new Finesse(tetrominoes.zTetromino, [0, 2], 0, [DAS_LEFT]))
        this.addFinesse(new Finesse(tetrominoes.zTetromino, [0, 2], 1, [LEFT, LEFT]))
        this.addFinesse(new Finesse(tetrominoes.zTetromino, [0, 2], 2, [LEFT]))
        this.addFinesse(new Finesse(tetrominoes.zTetromino, [0, 2], 3, []))
        this.addFinesse(new Finesse(tetrominoes.zTetromino, [0, 2], 4, [RIGHT]))
        this.addFinesse(new Finesse(tetrominoes.zTetromino, [0, 2], 5, [RIGHT, RIGHT]))
        this.addFinesse(new Finesse(tetrominoes.zTetromino, [0, 2], 6, [DAS_RIGHT, LEFT]))
        this.addFinesse(new Finesse(tetrominoes.zTetromino, [0, 2], 7, [DAS_RIGHT]))
        // - Vertical
        this.addFinesse(new Finesse(tetrominoes.zTetromino, [1, 3], 0, [CCW, DAS_LEFT], false))
        this.addFinesse(new Finesse(tetrominoes.zTetromino, [1, 3], 1, [DAS_LEFT, CW]))
        this.addFinesse(new Finesse(tetrominoes.zTetromino, [1, 3], 2, [CCW, LEFT], false))
        this.addFinesse(new Finesse(tetrominoes.zTetromino, [1, 3], 3, [CCW]))
        this.addFinesse(new Finesse(tetrominoes.zTetromino, [1, 3], 4, [CW]))
        this.addFinesse(new Finesse(tetrominoes.zTetromino, [1, 3], 5, [CW, RIGHT], false))
        this.addFinesse(new Finesse(tetrominoes.zTetromino, [1, 3], 6, [CW, RIGHT, RIGHT], false))
        this.addFinesse(new Finesse(tetrominoes.zTetromino, [1, 3], 7, [DAS_RIGHT, CCW]))
        this.addFinesse(new Finesse(tetrominoes.zTetromino, [1, 3], 8, [CW, DAS_RIGHT], false))
        // L
        // - Normal
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [0], 0, [DAS_LEFT]))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [0], 1, [LEFT, LEFT]))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [0], 2, [LEFT]))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [0], 3, []))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [0], 4, [RIGHT]))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [0], 5, [RIGHT, RIGHT]))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [0], 6, [DAS_RIGHT, LEFT]))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [0], 7, [DAS_RIGHT]))
        // - 90
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [1], 0, [CW, DAS_LEFT], false))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [1], 1, [DAS_LEFT, CW]))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [1], 2, [CW, LEFT, LEFT], false))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [1], 3, [CW, LEFT], false))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [1], 4, [CW]))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [1], 5, [CW, RIGHT], false))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [1], 6, [CW, RIGHT, RIGHT], false))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [1], 7, [DAS_RIGHT, CW, LEFT], false))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [1], 8, [CW, DAS_RIGHT], false))
        // - 180
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [2], 0, [DAS_LEFT, ROTATE_TWICE], false))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [2], 1, [LEFT, LEFT, ROTATE_TWICE], false))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [2], 2, [LEFT, ROTATE_TWICE], false))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [2], 3, [ROTATE_TWICE]))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [2], 4, [RIGHT, ROTATE_TWICE], false))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [2], 5, [RIGHT, RIGHT, ROTATE_TWICE], false))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [2], 6, [DAS_RIGHT, LEFT, ROTATE_TWICE], false))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [2], 7, [DAS_RIGHT, ROTATE_TWICE], false))
        // - 270
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [3], 0, [CCW, DAS_LEFT], false))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [3], 1, [CCW, LEFT, LEFT], false))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [3], 2, [CCW, LEFT], false))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [3], 3, [CCW], false))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [3], 4, [CCW, RIGHT], false))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [3], 5, [CCW, RIGHT, RIGHT], false))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [3], 6, [DAS_RIGHT, LEFT, CCW], false))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [3], 7, [DAS_RIGHT, CCW]))
        this.addFinesse(new Finesse(tetrominoes.lTetromino, [3], 8, [CCW, DAS_RIGHT], false))
        // J
        // - Normal
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [0], 0, [DAS_LEFT]))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [0], 1, [LEFT, LEFT]))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [0], 2, [LEFT]))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [0], 3, []))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [0], 4, [RIGHT]))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [0], 5, [RIGHT, RIGHT]))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [0], 6, [DAS_RIGHT, LEFT]))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [0], 7, [DAS_RIGHT]))
        // - 90
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [1], 0, [CW, DAS_LEFT], false))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [1], 1, [DAS_LEFT, CW]))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [1], 2, [CW, LEFT, LEFT], false))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [1], 3, [CW, LEFT], false))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [1], 4, [CW]))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [1], 5, [CW, RIGHT], false))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [1], 6, [CW, RIGHT, RIGHT], false))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [1], 7, [DAS_RIGHT, CW, LEFT], false))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [1], 8, [CW, DAS_RIGHT], false))
        // - 180
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [2], 0, [DAS_LEFT, ROTATE_TWICE], false))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [2], 1, [LEFT, LEFT, ROTATE_TWICE], false))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [2], 2, [LEFT, ROTATE_TWICE], false))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [2], 3, [ROTATE_TWICE]))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [2], 4, [RIGHT, ROTATE_TWICE], false))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [2], 5, [RIGHT, RIGHT, ROTATE_TWICE], false))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [2], 6, [DAS_RIGHT, LEFT, ROTATE_TWICE], false))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [2], 7, [DAS_RIGHT, ROTATE_TWICE], false))
        // - 270
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [3], 0, [CCW, DAS_LEFT], false))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [3], 1, [CCW, LEFT, LEFT], false))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [3], 2, [CCW, LEFT], false))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [3], 3, [CCW], false))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [3], 4, [CCW, RIGHT], false))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [3], 5, [CCW, RIGHT, RIGHT], false))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [3], 6, [DAS_RIGHT, LEFT, CCW], false))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [3], 7, [DAS_RIGHT, CCW]))
        this.addFinesse(new Finesse(tetrominoes.jTetromino, [3], 8, [CCW, DAS_RIGHT], false))
        // T
        // - Normal
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [0], 0, [DAS_LEFT]))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [0], 1, [LEFT, LEFT]))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [0], 2, [LEFT]))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [0], 3, []))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [0], 4, [RIGHT]))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [0], 5, [RIGHT, RIGHT]))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [0], 6, [DAS_RIGHT, LEFT]))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [0], 7, [DAS_RIGHT]))
        // - 90
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [1], 0, [CW, DAS_LEFT], false))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [1], 1, [DAS_LEFT, CW]))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [1], 2, [CW, LEFT, LEFT], false))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [1], 3, [CW, LEFT], false))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [1], 4, [CW]))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [1], 5, [CW, RIGHT], false))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [1], 6, [CW, RIGHT, RIGHT], false))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [1], 7, [DAS_RIGHT, CW, LEFT], false))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [1], 8, [CW, DAS_RIGHT], false))
        // - 180
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [2], 0, [DAS_LEFT, ROTATE_TWICE], false))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [2], 1, [LEFT, LEFT, ROTATE_TWICE], false))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [2], 2, [LEFT, ROTATE_TWICE], false))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [2], 3, [ROTATE_TWICE]))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [2], 4, [RIGHT, ROTATE_TWICE], false))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [2], 5, [RIGHT, RIGHT, ROTATE_TWICE], false))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [2], 6, [DAS_RIGHT, LEFT, ROTATE_TWICE], false))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [2], 7, [DAS_RIGHT, ROTATE_TWICE], false))
        // - 270
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [3], 0, [CCW, DAS_LEFT], false))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [3], 1, [CCW, LEFT, LEFT], false))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [3], 2, [CCW, LEFT], false))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [3], 3, [CCW], false))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [3], 4, [CCW, RIGHT], false))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [3], 5, [CCW, RIGHT, RIGHT], false))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [3], 6, [DAS_RIGHT, LEFT, CCW], false))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [3], 7, [DAS_RIGHT, CCW]))
        this.addFinesse(new Finesse(tetrominoes.tTetromino, [3], 8, [CCW, DAS_RIGHT], false))
    }
}
