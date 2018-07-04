(function() {
    var updateAtPointer = function() {
        var pointer = VS.score.getPointer();

        if (!VS.score.pointerAtLastEvent()) {
            update(transitionTime.short, score[pointer]);
        }
    };

    VS.score.hooks.add('stop', updateAtPointer);
    VS.control.hooks.add('step', updateAtPointer);
})();
