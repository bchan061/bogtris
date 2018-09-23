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
        this.addKey(new Key("Rotate Left", 90))
        this.addKey(new Key("Rotate Right", 88))
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
}