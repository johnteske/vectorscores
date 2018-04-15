VS.control.stepCallback = VS.score.stopCallback = function() {
    var pointer = VS.score.pointer;
    var fn = VS.score.funcAt(pointer);

    if (typeof fn === 'function') {
        update(transitionTime.short, score[VS.score.pointer]);
    }
};
