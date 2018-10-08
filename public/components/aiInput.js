/**
 * Genetic AI input.
 * Stacks for Tetris.
 */
class AIInput extends Input {
    constructor(playfield) {
        super(playfield)
        this.actTimer = new Timer(1.5, this.act.bind(this))
        this.active = true
    }

    heuristic(currentTetromino, position) {
        
    }

    calculateHoles() {

    }

    act() {
        let currentTetromino = this.playfield.currentTetromino
        let position = this.playfield.tetrominoLocation

        if (position.x > 0) {
            this.playfield.tryMove(-1, 0)
        } else {
            this.playfield.hardDropTetromino()
        }
    }

    update(delta, elapsed) {
        if (this.active) {
            this.actTimer.update(elapsed)
        }
    }
}

class SimulatedBoard extends Board {
    
}
