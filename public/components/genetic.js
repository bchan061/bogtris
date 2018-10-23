/**
 * Based off of
 * https://towardsdatascience.com/introduction-to-genetic-algorithms-including-example-code-e396e98d8bf3.
 */
class Population {
    static get PARENT_SURVIVES() {
        return 1
    }

    constructor() {
        this.individuals = []
        this.finishedIndividuals = []
        this.generation = 1
        this.individualCount = 1

        this.cutoff = 0.4
        this.lucky = 0.1
    }

    addIndividual(individual) {
        this.individuals.push(individual)
    }

    finishIndividual(individual) {
        this.finishedIndividuals.push(individual)
    }

    populateInitial(amount, amountOfGenes) {
        for (let i = 0; i < amount; i++) {
            let genes = []
            for (let geneI = 0; geneI < amountOfGenes; geneI++) {
                genes[geneI] = Math.random() * 50 - 25
            }
            let individual = new Individual(new Chromosome(genes))
            this.individuals.push(individual)
        }
    }

    /**
     * Selects individuals and removes the rest.
     */
    select() {
        let nextIndividuals = []
        /* Sort the individuals by fitness. */
        this.finishedIndividuals.sort(function(a, b) {
            return a.fitness - b.fitness
        })

        this.finishedIndividuals.reverse()

        /* Add all the individuals that made the cutoff. */
        let cutoffIndex = Math.ceil(this.cutoff * this.finishedIndividuals.length)
        for (let i = 0; i < cutoffIndex; i++) {
            nextIndividuals.push(this.finishedIndividuals[i])
        }

        /* Within the others... */
        for (let i = 0; i < Math.ceil(this.lucky * this.finishedIndividuals.length); i++) {
            /* Choose a random index from the non-chosen */
            let randomIndex = Math.floor(Math.random() * (this.finishedIndividuals.length - 1 - cutoffIndex))
            if (i >= this.finishedIndividuals.length) {
                continue
            }
            nextIndividuals.push(this.finishedIndividuals[randomIndex])
        }

        /* Wipe out all of the individuals and set the next individuals in place */
        this.individuals = nextIndividuals
        this.finishedIndividuals = []

        this.generation += 1

        this.individualCount = 1

        this.breed()

        console.log("Selected onto generation " + this.generation)

        this.sendIndividuals()
    }
    
    breed() {
        let currentIndividuals = this.individuals
        let newIndividuals = []
        while(currentIndividuals.length >= 2) {
            let adult1 = currentIndividuals.shift()
            let adult2 = currentIndividuals.shift()

            let newChromosomes = adult1.chromosome.crossOver(adult2.chromosome)

            let individual1 = new Individual(newChromosomes[0])
            let individual2 = new Individual(newChromosomes[1])

            newIndividuals.push(individual1)
            newIndividuals.push(individual2)

            if (Math.random() < Population.PARENT_SURVIVES) {
                newIndividuals.push(adult1)
            }
            if (Math.random() < Population.PARENT_SURVIVES) {
                newIndividuals.push(adult2)
            }
        }

        this.individuals = newIndividuals
    }

    sendIndividuals() {
        let data = {
            "generation": this.generation,
            "individuals": this.individuals
        }
        return fetch("http://localhost:3000/log", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(function(response) {
            console.log("Response received: " + response.json())
        })

        /** Log a copy of a generation into the console for safe-keeping */
        let jsonData = JSON.stringify(data)
        console.log(jsonData)
    }

    loadFromData(data) {
        let parsedData = data
        this.generation = parsedData.generation
        for (let i = 0; i < parsedData.individuals.length; i++) {
            let individualObject = parsedData.individuals[i]
            let individual = new Individual(new Chromosome(individualObject.chromosome.genes))

            this.individuals.push(individual)
        }
    }

    update() {
        if (this.individuals.length == 0) {
            this.select()
        }
        let individual = this.individuals.shift()
        this.individualCount += 1
        return individual
    }
}

class Chromosome {
    static get MUTATION_CHANCE() {
        return 0.1
    }
    static get MUTATION_THRESHOLD() {
        return 5
    }

    constructor(genes) {
        /* We'll let genes be non-binary to reduce the complexity. */
        this.genes = genes
    }
    
    crossOver(otherChromosome) {
        let crossingPoint = Math.floor(this.genes.length / 2)
        let newChromosome1 = new Chromosome([])
        let newChromosome2 = new Chromosome([])
        for (let i = 0; i < this.genes.length; i++) {
            if (i <= crossingPoint) {
                newChromosome1.genes[i] = this.genes[i]
                newChromosome2.genes[i] = otherChromosome.genes[i]
            } else {
                newChromosome1.genes[i] = otherChromosome.genes[i]
                newChromosome2.genes[i] = this.genes[i]
            }   
        }

        if (Math.random() < Chromosome.MUTATION_CHANCE) {
            newChromosome1.mutate(Chromosome.MUTATION_THRESHOLD)
        }
        if (Math.random() < Chromosome.MUTATION_CHANCE) {
            newChromosome2.mutate(Chromosome.MUTATION_THRESHOLD)
        }

        return [newChromosome1, newChromosome2]
    }

    mutate(threshold) {
        for (let i = 0; i < this.genes.length; i++) {
            let difference = Math.random() * threshold * 2
            this.genes[i] += difference
        }
    }
}

class Individual {
    constructor(chromosome) {
        this.chromosome = chromosome
        this.fitness = 0
    }

    assignFitness(fitness) {
        this.fitness = fitness
    }
}
