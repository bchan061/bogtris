/**
 * Hooks inputs into playfields.
 */
class InputDelegator {
    /**
     * Initializes an input delegator.
     */
    constructor() {
        this.inputs = []
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
     * Updates each of the inputs.
     * @param {number} delta the delta percentage
     * @param {number} elapsed the elapsed percentage
     */
    update(delta, elapsed) {
        for (let i = 0; i < this.inputs.length; i++) {
            this.inputs[i].update(delta, elapsed)
        }
    }
}