/**
 * Hooks inputs into playfields.
 */
class InputDelegator {
    /**
     * Initializes an input delegator.
     */
    constructor() {
        this.inputs = []
        this.gamepads = []
        this.activeGamepad = null
    }

    /**
     * Adds an input from the delegator.
     * @param {object} input an input object
     */
    addInput(input) {
        this.inputs.push(input)
    }

    /**
     * Removes an input from the delegator.
     * @param {object} input an input object
     */
    removeInput(input) {
        for (let i = 0; i < this.inputs.length; i++) {
            if (input == this.inputs[i]) {
                this.inputs.splice(i, 1)
                this.activeGamepad = null
            }
        }
    }

    /**
     * Adds a gamepad to the delegator.
     * @param {object} gamepad the gamepad to add
     */
    addGamepad(gamepad) {
        this.gamepads.push(gamepad)
    }

    /**
     * Removes a gamepad from the delegator.
     * @param {object} gamepad the gamepad to remove
     */
    removeGamepad(gamepad) {
        for (let i = 0; i < this.gamepads.length; i++) {
            if (this.gamepads[i] == gamepad) {
                this.gamepads.splice(i, 1)
            }
        }
    }

    /**
     * Called on key down events in the window.
     * @param {number} keycode the keycode
     */
    onKeyDown(keycode) {
        for (let i = 0; i < this.inputs.length; i++) {
            this.inputs[i].onKeyDown(keycode)
        }
    }

    /**
     * Called on key up events in the window.
     * @param {number} keycode the keycode
     */
    onKeyUp(keycode) {
        for (let i = 0; i < this.inputs.length; i++) {
            this.inputs[i].onKeyUp(keycode)
        }
    }

    /**
     * Simulates a key press.
     * @param {string} name the name of the key
     */
    simulateKeyDown(name) {
        for (let i = 0; i < this.inputs.length; i++) {
            this.inputs[i].simulateKeyDown(name)
        }
    }

    /**
     * Simulate a key up.
     * @param {string} name the name of the key
     */
    simulateKeyUp(name) {
        for (let i = 0; i < this.inputs.length; i++) {
            this.inputs[i].simulateKeyUp(name)
        }
    }

    /**
     * Checks if a gamepad button is pressed.
     * @param {object} button gamepad button
     */
    isButtonPressed(button) {
        if (button == null) {
            return false
        } else if (button.pressed != null) {
            return button.pressed
        } else {
            return button == 1.0
        }
    }

    /**
     * Polls each of the gamepads.
     * Maps each inputs according to XBOX 360 controller.
     */
    pollGamepads() {
        if (this.activeGamepad == null) {
            for (let i = 0; i < this.gamepads.length; i++) {
                let gamepad = this.gamepads[i]
                let buttons = gamepad.buttons
                for (let bi = 0; bi < buttons.length; bi++) {
                    let button = gamepad.buttons[bi]
                    if (button.pressed) {
                        this.activeGamepad = i
                    }
                }
            }
        } else {
            let gamepad = this.gamepads[this.activeGamepad]

            this.simulateKeyWithGamepad("Left", gamepad.buttons[14])
            this.simulateKeyWithGamepad("Right", gamepad.buttons[15])
            this.simulateKeyWithGamepad("Rotate left", gamepad.buttons[0])
            this.simulateKeyWithGamepad("Rotate right", gamepad.buttons[1])
            this.simulateKeyWithGamepad("Soft drop", gamepad.buttons[13])
            this.simulateKeyWithGamepad("Hard drop", gamepad.buttons[12])
            this.simulateKeyWithGamepad("Hold", gamepad.buttons[4])
            this.simulateKeyWithGamepad("Hold", gamepad.buttons[5])
        }
    }

    /**
     * Simulates a key down or key up event with the button press.
     * @param {string} name the name of the key
     * @param {object} button the button
     */
    simulateKeyWithGamepad(name, button) {
        if (this.isButtonPressed(button)) {
            this.simulateKeyDown(name)
        } else {
            this.simulateKeyUp(name)
        }
    }

    /**
     * Updates each of the inputs.
     * @param {number} delta the delta percentage
     * @param {number} elapsed the elapsed percentage
     */
    update(delta, elapsed) {
        if (this.gamepads.length > 0) {
            this.pollGamepads()
        }
        for (let i = 0; i < this.inputs.length; i++) {
            this.inputs[i].update(delta, elapsed)
        }
    }
}