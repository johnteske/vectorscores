VS.control.hooks.add('step', function() {
    var pointer = VS.score.getPointer();
    var scoreEvent = eventList[pointer];
    var parameters = [].concat(150, scoreEvent.parameters && scoreEvent.parameters.slice(1));
    scoreEvent.action.apply(null, parameters);
});

VS.control.hooks.add('stop', function() {
    makeTextToggler(false)(150);
    updateSymbols(150, 0);
});
