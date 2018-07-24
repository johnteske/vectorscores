VS.control.hooks.add('step', function() {
    var pointer = VS.score.getPointer();
    eventList[pointer].action(150);
});

VS.control.hooks.add('stop', forgetAll);
