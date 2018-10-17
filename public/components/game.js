/**
 * The main game.
 */
class Game {
    constructor(application) {
        this.application = application
        this.inputDelegator = new InputDelegator(this)
        this.screen = new AIBattleScreen(this.application, this)
    }

    attachScreen(newScreen) {
        this.screen = newScreen
    }

    update(delta, elapsed) {
        if (this.screen != null) {
            this.screen.update(delta, elapsed)
        }
    }
}