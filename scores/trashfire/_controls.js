VS.score.hooks.add('stop', function() {
    trash.empty();
    trash.update();
    TrashFire.noiseLayer.remove(0);
    TrashFire.scrapeDrone.hide(0);
    dumpster.shake();
});
