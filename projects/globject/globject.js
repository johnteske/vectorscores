function Globject() {
    if (!(this instanceof Globject)) {
        return new Globject();
    }
    // this.width
    // this.height
    this.pitches = {};
}

Globject.prototype.setRangeEnvelopes = function (type, hi, lo, times) {
    this.rangeEnvelope =  {
        type: "midi",
        hi: [64, 65, 66, 127],
        lo: [0,1,2,63],
        times: [0, 0.3, 0.5, 1]
    };
};

Globject.prototype.setPitchClassSet = function (pitchClasses) {
    // check if pitchClasses.length === times.length
    this.pitches.classes = [
        [
            0,
            Math.round(VS.getRandExcl(1,3)),
        ],
        [
            0,
            Math.round(VS.getRandExcl(1,3)),
            Math.round(VS.getRandExcl(4,7))
        ]
    ];
    this.pitches.times = [0, 0.6];
    // weight: [0.5, 0.25, 0.25]
};

Globject.prototype.setDynamics = function (dynamics, times) {
    this.dynamics =  {
        values: dynamics,
        times: times
    };
};
