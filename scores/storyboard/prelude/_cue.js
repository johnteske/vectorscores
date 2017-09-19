/**
 * TODO
 * allow custom blink and cancel functions (executed internally as .call())
 * re-consider end function, perhaps as .on("end") -- currently is included in blink so last/end transition does not cancel previous
 * set nBlinks on init
 */
function CueSymbol(selection, args) {
    if (!(this instanceof CueSymbol)) {
        return new CueSymbol();
    }

    this.selection = selection;

    if (args) {
        this.beats = args.beats;
        this.interval = args.interval;
    }

    // total duration
    this.duration = this.beats * this.interval;

    this.time = {
        on: 50,
        off: 700
    };

    this.opacities = {
        on: 1,
        off: 0.25,
        end: 1
    };
}

CueSymbol.prototype.blink = function() {
    var self = this,
        n = this.beats || 1;

    function blink(selection, delay, isLast) {
        self.selection.transition().delay(delay).duration(self.time.on)
            .style("fill", isLast ? "#888" : "blue")
            .style("opacity", self.opacities.on)
            .transition().delay(self.time.on).duration(self.time.off)
            .style("opacity", isLast ? self.opacities.end : self.opacities.off);
    }

    for (var i = 0; i < (n + 1); i++) {
        this.selection.call(blink, i * this.interval, i === n);
    }
};

CueSymbol.prototype.cancel = function() {
    this.selection
        .style("fill", "#888")
        .transition()
        .style("opacity", this.opacities.end);
};
