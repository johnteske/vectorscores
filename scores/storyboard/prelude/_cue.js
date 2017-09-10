/**
 * TODO
 * allow custom blink and cancel functions (executed internally as .call())
 * re-consider end function, perhaps as .on("end") -- currently is included in blink so last/end transition does not cancel previous
 * set nBlinks on init
 */
function CueSymbol(selection) {
    if (!(this instanceof CueSymbol)) {
        return new CueSymbol();
    }

    this.selection = selection;

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

CueSymbol.prototype.blink = function(nTimes) {
    var self = this,
        n = nTimes || 1;

    function blink(selection, delay, isLast) {
        self.selection.transition().delay(delay).duration(self.time.on)
            .style("fill", isLast ? "#888" : "blue")
            .style("opacity", self.opacities.on)
            .transition().delay(self.time.on).duration(self.time.off)
            .style("opacity", isLast ? self.opacities.end : self.opacities.off);
    }

    for (var i = 0; i < (n + 1); i++) {
        this.selection.call(blink, i * 1000, i === n);
    }
};

CueSymbol.prototype.cancel = function() {
    this.selection
        .transition()
        .style("fill", "#888")
        .style("opacity", this.opacities.end);
};
