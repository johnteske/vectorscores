/**
 * TODO
 * allow custom blink and cancel functions (executed internally as .call())
 * re-consider end function, perhaps as .on("end") -- currently is included in blink so last/end transition does not cancel previous
 */
function CueSymbol(selection, args) {

    this.selection = selection;

    if (args) {
        this.beats = args.beats;
        this.interval = args.interval;
    }

    this.beats = this.beats || 1;
    this.interval = args.interval || 1;

    // total duration
    this.duration = VS.constant(this.beats * this.interval);

    this.time = {
        on: 50,
        off: 700
    };
}

CueSymbol.prototype._setOn = function(selection) {
    selection.style('fill', 'blue')
        .style('opacity', 1);
};

CueSymbol.prototype._setOff = function(selection) {
    selection.style('fill', '#888')
        .style('opacity', 0.25);
};

CueSymbol.prototype._setEnd = function(selection) {
    selection.style('fill', '#888')
        .style('opacity', 1);
};

CueSymbol.prototype.blink = function() {
    var self = this,
        n = this.beats;

    function blink(selection, delay, isLast) {
        selection.transition().delay(delay).duration(self.time.on)
            .call(self._setOn)
            .transition().delay(self.time.on).duration(self.time.off)
            .call(isLast ? self._setEnd : self._setOff);
    }

    for (var i = 0; i < (n + 1); i++) {
        this.selection.call(blink, i * this.interval, i === n);
    }
};

CueSymbol.prototype.cancel = function() {
    this.selection
        .transition()
        .call(this._setEnd);
};
