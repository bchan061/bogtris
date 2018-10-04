class Sounds {
    static init() {
        Sounds.move = new Howl({
            src: ['assets/sound/move.wav']
        })
        Sounds.drop = new Howl({
            src: ['assets/sound/drop.wav'],
            volume: 0.5
        })
        Sounds.softDrop = new Howl({
            src: ['assets/sound/softDrop.wav']
        })
        Sounds.hardDrop = new Howl({
            src: ['assets/sound/hardDrop.wav']
        })
        Sounds.rotate = new Howl({
            src: ['assets/sound/rotate.wav']
        })
        Sounds.hold = new Howl({
            src: ['assets/sound/hold.wav']
        })
        Sounds.forceDrop = new Howl({
            src: ['assets/sound/forceDrop.wav']
        })
        Sounds.clear = new Howl({
            src: ['assets/sound/clear.wav']
        })
        Sounds.tetris = new Howl({
            src: ['assets/sound/tetris.wav']
        })
        Sounds.spin = new Howl({
            src: ['assets/sound/spin.wav']
        })
        Sounds.clearSpin = new Howl({
            src: ['assets/sound/clearSpin.wav']
        })
        Sounds.backToBack = new Howl({
            src: ['assets/sound/back2back.wav']
        })
        Sounds.perfectClear = new Howl({
            src: ['assets/sound/perfectClear.wav']
        })
    }
}