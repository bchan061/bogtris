class Block {
    constructor(board) {
        this.board = board
        this.sprite = new PIXI.Sprite(board.blockTexture)
        this.sprite.scale.set(this.board.blockSize / this.board.blockTexture.width)

        this.reset()
    }

    /**
     * The color of the block
     * @param {number} color a hex representation of the color
     */
    setColor(color) {
        this.color = color
        this.sprite.tint = color
    }

    /**
     * Sets whether the block is active or not.
     * @param {*} status whether the block is active or not
     */
    setActive(status) {
        this.active = status
        this.sprite.visible = this.active
    }

    /**
     * Sets the opacity of the block
     * @param {number} opacity the opacity of the sprite (0 => invisible, 1 => visible)
     */
    setOpacity(opacity) {
        this.sprite.alpha = opacity
    }

    /**
     * Used for pools.
     */
    reset() {
        this.setColor(0xFFFFFF)
        this.setActive(false)
    }

    /**
     * Sets the block location in the board.
     * @param {number} x 
     * @param {number} y 
     */
    set(x, y) {
        this.x = x
        this.y = y

        this.sprite.position.set(
            x * this.board.blockSize,
            y * this.board.blockSize
        )
    }

    random() {
        this.setColor(Math.floor(Math.random() * 0xFFFFFF))
        this.setActive(true)
    }
}