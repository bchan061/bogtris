/**
 * A screen that with game logic.
 */
class Screen {
    constructor(application, game) {
        this.stage = new PIXI.Container()
        this.application = application
        this.game = game

        this.application.stage.addChild(this.stage)
    }

    /**
     * Updates the screen.
     * @param {number} delta the delta percentage
     * @param {number} elapsed the elapsed ms
     */
    update(delta, elapsed) {

    }

    /**
     * Detaches the current screen from the application.
     */
    detach() {
        this.application.stage.removeChild(this.stage)
    }
}