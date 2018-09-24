class Board {
    constructor(game, width = 10, height = 25) {
        /* Obstruct the top 5 rows, so that only (typically) 20 rows are visible. */
        const OBSTRUCT_TOP = 5
        const BLOCK_SIZE = 18

        this.width = width
        this.height = height
        this.blockSize = BLOCK_SIZE
        this.obstructTop = OBSTRUCT_TOP
        this.game = game
        this.board = new Array(this.height)
        this.offset = new PIXI.Point(0, 18)
        this.blockTexture = PIXI.loader.resources["assets/block.svg"].texture

        this.initBoard = this.initBoard.bind(this)

        this.initBoard()
    }

    initBoard() {
        for (let y = 0; y < this.height; y++) {
            let row = new Array(this.width)
            for (let x = 0; x < this.width; x++) {
                let block = new Block(this)
                block.set(x, y)

                this.game.application.stage.addChild(block.sprite)

                row[x] = block
            }

            this.board[y] = row
        }
    }

    update() {
        
    }
}