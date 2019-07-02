class ITetromino extends BasicTetromino {
    constructor() {
        super(
            "I",
            Colors.CYAN,
            [
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 1, 1, 1, 1],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0]
            ]
        )
    }

    /**
     * Creates a sprite (really a container of blocks) for the I tetromino.
     */
    createSprites() {
        let displayShape = [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
        for (let y = 0; y < displayShape.length; y++) {
            for (let x = 0; x < displayShape[0].length; x++) {
                let block = displayShape[y][x]

                if (block == 1) {
                    for (let i = 0; i < this.sprites.length; i++) {
                        let sprite = new PIXI.Sprite(PIXI.loader.resources["assets/block.svg"].texture)
                        sprite.position.set(x * GraphicsConstants.BLOCK_SIZE, y * GraphicsConstants.BLOCK_SIZE)
                        sprite.scale.set(GraphicsConstants.BLOCK_SIZE / sprite.texture.width)
                        sprite.tint = this.color
                        this.sprites[i].addChild(sprite)
                    }
                }
            }
        }
    }

    createOffsets() {
        this.offsets = [
            [ [0, 0], [-1, 0], [2, 0], [-1, 0], [2, 0] ], // Original
            [ [-1, 0], [0, 0], [0, 0], [0, 1], [0, -2] ], // Rotated right
            [ [-1, 1], [1, 1], [-2, 1], [1, 0], [-2, 0] ], // Rotated 180
            [ [0, 1], [0, 1], [0, 1], [0, -1], [0, 2] ]  // Rotated left
        ]
    }
}