class Input {
    constructor(game) {
        this.onKeyDown = this.onKeyDown.bind(this)
        this.onKeyUp = this.onKeyUp.bind(this)
        this.game = game
        this.keys = {}
        this.keycodes = {}

        this.initializeKeys()
    }

    initializeKeys() {
        this.addKey(new Key("Left", 37))
        this.addKey(new Key("Right", 39))
        this.addKey(new Key("Rotate left", 90))
        this.addKey(new Key("Rotate right", 88))
        this.addKey(new Key("Soft drop", 40))
        this.addKey(new Key("Hard drop", 38))
        this.addKey(new Key("Hold", 32))
    }

    addKey(key) {
        this.keys[key.name] = key
        this.keycodes[key.keycode] = key
    }

    onKeyDown(keycode) {
        if (keycode in this.keycodes) {
            let key = this.keycodes[keycode]
            key.keyDown()
        }
    }
    
    onKeyUp(keycode) {
        if (keycode in this.keycodes) {
            let key = this.keycodes[keycode]
            key.keyUp()
        }
    }

    update(delta, elapsed) {
        if (this.keys["Left"].isJustPressed()) {
            this.game.tryMove(-1, 0)
        }
        if (this.keys["Right"].isJustPressed()) {
            this.game.tryMove(1, 0)
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

        if (this.keys["Hard drop"].isJustPressed()) {
            this.game.hardDropTetromino()
        }
    }
}