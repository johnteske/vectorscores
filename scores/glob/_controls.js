VS.score.preroll = 1000;

VS.control.stepCallback = VS.score.stopCallback = function() {
    update(transitionTime.short, score[VS.score.pointer]);
};
