/**
 * The input for the game.
 */
class Input {
    /**
     * Initializes all the keys and sets up timers for DAS and ARR.
     * @param {object} game the game
     */
    constructor(game) {
        this.onKeyDown = this.onKeyDown.bind(this)
        this.onKeyUp = this.onKeyUp.bind(this)
        this.game = game
        this.keys = {}
        this.keycodes = {}

        this.dasLeftTimer = new EndlessTimer(Timings.DAS)
        this.dasRightTimer = new EndlessTimer(Timings.DAS)
        this.softDropTimer = new Timer(Timings.ARR, this.softDrop.bind(this))
        this.arrTimer = new Timer(Timings.ARR, this.arr.bind(this))
        this.arrRight = false

        this.initializeKeys()
    }

    /**
     * Initializes the keys for the game.
     */
    initializeKeys() {
        this.addKey(new Key("Left", 37))
        this.addKey(new Key("Right", 39))
        this.addKey(new Key("Rotate left", 90))
        this.addKey(new Key("Rotate right", 88))
        this.addKey(new Key("Soft drop", 40))
        this.addKey(new Key("Hard drop", 38))
        this.addKey(new Key("Hold", 32))
    }

    /**
     * Adds the keys into the dictionary of keys.
     * @param {object} key the key to add
     */
    addKey(key) {
        this.keys[key.name] = key
        this.keycodes[key.keycode] = key
    }

    /**
     * Called on a key press.
     * Gets the respective key and presses the key down.
     * @param {number} keycode the keycode
     */
    onKeyDown(keycode) {
        if (keycode in this.keycodes) {
            let key = this.keycodes[keycode]
            key.keyDown()
        }
    }
    
    /**
     * Called on a key up event.
     * Gets the respective key and releases the key.
     * @param {number} keycode the keycode
     */
    onKeyUp(keycode) {
        if (keycode in this.keycodes) {
            let key = this.keycodes[keycode]
            key.keyUp()
        }
    }

    /**
     * Simulates a key press for the key.
     * @param {string} name the key name
     */
    simulateKeyDown(name) {
        this.keys[name].keyDown()
    }

    /**
     * Simulates a key up event for the key.
     * @param {string} name the key name
     */
    simulateKeyUp(name) {
        this.keys[name].keyUp()
    }

    /**
     * Handles ARR movement.
     */
    arr() {
        if (this.arrRight) {
            this.game.tryMove(1, 0)
        } else {
            this.game.tryMove(-1, 0)
        }
    }

    /**
     * Handles soft drops.
     */
    softDrop() {
        this.game.softDropTetromino()
    }

    /**
     * Updates the input.
     * Called from the game.
     * @param {number} delta the delta percentage
     * @param {number} elapsed the time elapsed from the previous frame
     */
    update(delta, elapsed) {
        if (this.keys["Left"].isJustPressed()) {
            this.game.tryMove(-1, 0)
            this.dasRightTimer.reset()
            this.arrTimer.reset()
        } else if (this.keys["Right"].isJustPressed()) {
            this.game.tryMove(1, 0)
            this.dasLeftTimer.reset()
            this.arrTimer.reset()
        }

        if (this.keys["Rotate left"].isJustPressed()) {
            this.game.tryRotate(false)
        }
        if (this.keys["Rotate right"].isJustPressed()) {
            this.game.tryRotate(true)
        }
        if (this.keys["Hold"].isJustPressed()) {
            this.game.hold()
        }

        if (this.keys["Soft drop"].isJustPressed()) {
            this.game.softDropTetromino()
        }
        if (this.keys["Hard drop"].isJustPressed()) {
            this.game.hardDropTetromino()
        }

        if (this.keys["Left"].isPressed()) {
            this.dasLeftTimer.update(elapsed)
            this.dasRightTimer.reset()

            if (this.dasLeftTimer.elapsed >= Timings.DAS) {
                this.arrTimer.update(elapsed)
                this.arrRight = false
            }
        } else if (this.keys["Right"].isPressed()) {
            this.dasRightTimer.update(elapsed)
            this.dasLeftTimer.reset()

            if (this.dasRightTimer.elapsed >= Timings.DAS) {
                this.arrTimer.update(elapsed)
                this.arrRight = true
            }
        } else {
            this.dasLeftTimer.reset()
            this.dasRightTimer.reset()
            this.arrTimer.reset()
        }

        if (this.keys["Soft drop"].isPressed()) {
            this.softDropTimer.update(elapsed)
            this.game.dropActive = false
        } else {
            this.softDropTimer.reset()
            this.game.dropActive = true
        }
    }
}