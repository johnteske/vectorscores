function Globject(width) {
    if (!(this instanceof Globject)) {
        return new Globject();
    }
    this.width = width;
    // this.height
    // this.rangePath
    this.pitches = {};
}

Globject.prototype.setRangeEnvelopes = function (type, hi, lo, times) {
    this.rangeEnvelope =  {
        type: type,
        hi: hi,
        lo: lo,
        times: times
    };
};

Globject.prototype.setPitchClassSets = function (pitchClasses, times) {
    // check if pitchClasses.length === times.length
    this.pitches.classes = pitchClasses;
    this.pitches.times = times;
    // weight: [0.5, 0.25, 0.25]
};

Globject.prototype.setDynamics = function (dynamics, times) {
    this.dynamics =  {
        values: dynamics,
        times: times
    };
};
