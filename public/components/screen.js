/**
 * A screen that with game logic.
 */
class Screen {
    constructor(application, game) {
        this.stage = new PIXI.Container()
        this.application = application
        this.game = game

        this.attach()
    }

    /**
     * Updates the screen.
     * @param {number} delta the delta percentage
     * @param {number} elapsed the elapsed ms
     */
    update(delta, elapsed) {

    }

    /**
     * Attaches the current screen onto the application.
     */
    attach() {
        this.application.stage.addChild(this.stage)
    }

    /**
     * Detaches the current screen from the application.
     */
    detach() {
        this.application.stage.removeChild(this.stage)
    }
    
    reset() {
        this.detach()
        this.attach()
    }
}