VS.score.hooks.add('stop', function() {
    trash.set(1000, []);
    TrashFire.noiseLayer.remove(0);
    TrashFire.scrapeDrone.hide(0);
    dumpster.shake();
});

VS.control.hooks.add('step', function() {
    var pointer = VS.score.getPointer();
    var argsWithZeroDuration = [].concat(0, score[pointer].args.slice(1));
    score[pointer].fn.apply(null, argsWithZeroDuration);
});
