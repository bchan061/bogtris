class Key {
    constructor(name, keycode) {
        this.name = name
        this.keycode = keycode

        this.isDown = false
        this.justPressed = false
    }

    keyDown() {
        if (!this.isDown) {
            this.isDown = true
            this.justPressed = true
        }
    }

    keyUp() {
        if (this.isDown) {
            this.isDown = false
        }
    }

    isJustPressed() {
        let status = this.justPressed

        this.justPressed = false

        return status
    }
    isPressed() {
        return this.isDown
    }
}