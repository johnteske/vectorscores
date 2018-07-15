VS.score.hooks.add('stop', function() {
    trash.set(1000, []);
    TrashFire.noiseLayer.hide(0);
    TrashFire.scrapeDrone.hide(0);
    dumpster.shake();
});

VS.control.hooks.add('step', function() {
    var pointer = VS.score.getPointer();
    var argsWithZeroDuration = [].concat(0, score[pointer].args.slice(1));
    score[pointer].fn.apply(null, argsWithZeroDuration);

    // If not explicitly showing these layers, hide
    (score[pointer].fn !== TrashFire.spike.show) && TrashFire.spike.hide(0);
    (score[pointer].fn !== TrashFire.noiseLayer.show) && TrashFire.noiseLayer.hide(0);
    (score[pointer].fn !== TrashFire.scrapeDrone.show) && TrashFire.scrapeDrone.hide(0);
});
