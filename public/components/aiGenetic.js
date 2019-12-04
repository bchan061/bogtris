/**
 * Handles genetic evolution for the AI input.
 */
class AIGenetic {
    /**
     * Initializes an AIGenetic instance.
     */
    constructor(screen) {
        this.game = screen.game
        this.screen = screen
        this.currentAIPlayfield = null
        this.currentAIInput = null
        this.currentAIIndividual = null
        this.currentAIGarbage = 0

        this.aiTime = 30
        this.aiPopulation = new Population()
        /* Load from test/genetic.json */
        //this.aiPopulation.loadFromData(previousGeneration)
        this.aiPopulation.populateInitial(24, 6)
        this.aiTimer = new Timer(this.aiTime, this.end.bind(this))

        this.createNewAI()
    }

    /**
     * Called at the end of the timer.
     */
    end() {
        let fitness = this.aiTime + (this.currentAIGarbage) / this.aiTime
        console.log("Individual finished with fitness " + fitness)
        this.currentAIIndividual.assignFitness(fitness)
        this.aiPopulation.finishIndividual(this.currentAIIndividual)
        this.newAI()
    }

    /**
     * Creates a new AI.
     */
    createNewAI() {
        let playfield = new Playfield(this.screen, new PIXI.Point(GraphicsConstants.SCREEN_WIDTH - 20 * GraphicsConstants.BLOCK_SIZE, 0))
        let input = new AIInput(playfield)
        this.game.inputDelegator.addInput(input)
        playfield.setInput(input)

        this.currentAIPlayfield = playfield
        this.currentAIInput = input
        this.currentAIGarbage = 0
        this.currentAIIndividual = this.aiPopulation.update()

        input.garbageMultiplier = this.currentAIIndividual.chromosome.genes[0]
        input.holesMultiplier = this.currentAIIndividual.chromosome.genes[1]
        input.relativeHeightMultiplier = this.currentAIIndividual.chromosome.genes[2]
        input.heightsMultiplier = this.currentAIIndividual.chromosome.genes[3]
        input.holdOffset = this.currentAIIndividual.chromosome.genes[4]
		input.lineClearMultiplier = this.currentAIIndividual.chromosome.genes[5]
    
        console.log("Generation " + this.aiPopulation.generation + ", Individual " + (this.aiPopulation.individualCount - 1))
        console.log("Gene 1 (garbage): " + this.currentAIIndividual.chromosome.genes[0])
        console.log("Gene 2 (holes): " + this.currentAIIndividual.chromosome.genes[1])
        console.log("Gene 3 (relativeHeight): " + this.currentAIIndividual.chromosome.genes[2])
        console.log("Gene 4 (height): " + this.currentAIIndividual.chromosome.genes[3])
        console.log("Gene 5 (hold offset): " + this.currentAIIndividual.chromosome.genes[4])
        console.log("Gene 6 (lines cleared): " + this.currentAIIndividual.chromosome.genes[5])

        this.screen.addPlayfield(playfield)
    }

    /**
     * Adds the current AI garbage count.
     * @param {number} amount the amount of garbage
     */
    acceptGarbage(amount) {
        this.currentAIGarbage += amount
    }

    /**
     * Removes the AI from the game.
     */
    removeAI() {
        this.screen.removePlayfield(this.currentAIPlayfield)
        this.game.inputDelegator.removeInput(this.currentAIInput)
    }

    newAI() {
        this.removeAI()
        this.createNewAI()
        this.aiTimer.reset()
    }

    update(delta, elapsed) {
        this.aiTimer.update(elapsed)
        if (this.currentAIPlayfield.gameOver) {
            /* Call end prematurely */
            this.end()
        }
    }
}