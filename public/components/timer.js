class Timer {
    constructor(tick, onTick) {
        this.elapsed = 0
        this.onTick = onTick
        this.tickTime = tick
    }

    reset() {
        this.elapsed = 0
    }

    update(elapsed) {
        this.elapsed += elapsed

        if (this.elapsed >= this.tickTime) {
            this.elapsed -= this.tickTime
            this.onTick()
        }
    }
}