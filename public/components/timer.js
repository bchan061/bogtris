class Timer {
    constructor(tick, onTick) {
        this.elapsed = 0
        this.onTick = onTick
        this.tickTime = tick
    }

    reset() {
        this.elapsed = 0
    }

    changeTickTime(newTickTime) {
        this.tickTime = newTickTime
    }

    update(elapsed) {
        this.elapsed += elapsed

        if (this.isFulfilled()) {
            this.elapsed -= this.tickTime
            if (this.onTick != null) {
                this.onTick()
            }
        }
    }

    isFulfilled() {
        return this.elapsed >= this.tickTime
    }

    active() {
        return this.elapsed > 0
    }
}

class CountdownTimer extends Timer {
    constructor(time, onEnd) {
        super(time, onEnd)
        this.elapsed = time
        this.initialTime = time
        this.done = false
        this.active = true
    }

    reset() {
        this.elapsed = this.initialTime
        this.done = false
    }

    activate() {
        this.active = true
    }

    deactivate() {
        this.active = false
    }

    update(elapsed) {
        if (this.active) {
            this.elapsed -= elapsed
            if (!this.done && this.isFulfilled()) {
                this.done = true
                if (this.onTick !== null) {
                    this.onTick()
                }
            }
        }
    }

    isFulfilled() {
        return this.elapsed <= 0
    }

    active() {
        return this.active
    }
}

class CountedCountdownTimer extends CountdownTimer {
    reset() {
        super.reset()
        this.counter += 1
    }

    resetWithCounter() {
        this.reset()
        this.counter = 0
    }
}

class EndlessTimer extends Timer {
    constructor(tick) {
        super(tick, null)
    }

    reset() {
        this.elapsed = 0
    }

    update(elapsed) {
        this.elapsed += elapsed
    }
}
