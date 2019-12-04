/**
 * The main game.
 */
class Game {
    constructor(application) {
        this.application = application
        this.inputDelegator = new InputDelegator(this)
        this.screen = new EndlessScreen(this.application, this)
    }

    attachScreen(newScreen) {
        if (this.screen) {
            this.screen.detach()
        }
        delete this.screen
        this.screen = newScreen
    }

    resize(width, height) {
        let windowWidth = window.innerWidth
        let windowHeight = window.innerHeight
        
        if (windowWidth > windowHeight) {
            let scale = window.innerHeight / height
            width = width * scale
            height = window.innerHeight
        } else {
            let scale = window.innerWidth / width
            width = window.innerWidth
            height = height * scale
        }
        
        GraphicsConstants.SCREEN_WIDTH = width
        GraphicsConstants.SCREEN_HEIGHT = height
        
        GraphicsConstants.updateBlockSize()

        this.application.width = width
        this.application.height = height
        this.application.renderer.resize(width, height)
    }

    update(delta, elapsed) {
        if (this.screen != null) {
            this.screen.update(delta, elapsed)
        }
    }
}