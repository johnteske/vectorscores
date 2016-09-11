function globject() {
    this.rangeEnv =  {
        type: 'midi',
        hi: wedgeRangeGen(4, 64, 127),
        lo: stepRangeGen(4, 0, 63),
        times: [0, 0.3, 0.5, 1] // may want independent times for hi and lo
    };
    this.pitches = {
        classes: [0, 2, 6],
        weight: [0.5, 0.25, 0.25]
    };
    this.duration = {
        values: [0.5, 0.75, 1],
        weights: [0.5, 0.25, 0.25]
    };
    this.articulation = {
        values: [">", "_", "."],
        weights: [0.5, 0.25, 0.25]
    };
    this.dynamics = { // global
        values: ["mp", "cres.", "f"],
        dur: [0, 0.5, 1] //
    }
}
