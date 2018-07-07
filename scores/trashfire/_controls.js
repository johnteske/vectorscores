VS.score.hooks.add('stop', function() {
    trash.empty();
    TrashFire.noiseLayer.remove(0); // calls updateTrash();
    TrashFire.scrapeDrone.hide(0);
    dumpster.shake();
});
