(function() {
    var updateAtPointer = function() {
        var pointer = VS.score.getPointer();
        var fn = VS.score.functionAt(pointer);

        if (typeof fn === 'function') {
            update(transitionTime.short, score[pointer]);
        }
    };

    VS.score.hooks.add('stop', updateAtPointer);
    VS.control.hooks.add('step', updateAtPointer);
})();
