(function() {
    var controlCallback = function() {
        var pointer = VS.score.pointer;
        var fn = VS.score.funcAt(pointer);

        if (typeof fn === 'function') {
            update(transitionTime.short, score[VS.score.pointer]);
        }
    };

    VS.score.hooks.add('stop', controlCallback);
    VS.control.hooks.add('step', controlCallback);
})();
