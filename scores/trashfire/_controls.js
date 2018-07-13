VS.score.hooks.add('stop', function() {
    trash.set(1000, []);
    TrashFire.noiseLayer.remove(0);
    TrashFire.scrapeDrone.hide(0);
    dumpster.shake();
});

VS.control.hooks.add('step', function() {
    // TODO set duration to 0, otherwise trash can get lost if stepping quickly
    var pointer = VS.score.getPointer();
    var args = score[pointer].args;
    args[0] = 0;
    score[pointer].fn.apply(null, args);
});
