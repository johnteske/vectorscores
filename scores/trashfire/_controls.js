VS.score.hooks.add('stop', function() {
    trash = [];
    TrashFire.noiseLayer.remove(0); // calls updateTrash();
    TrashFire.scrapeDrone.hide(0);
    dumpsterShake();
});
