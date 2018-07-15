/**
 * Noise
 */
var noiseEvents = TrashUtils.buildArray(5, function() {
    var duration = VS.getRandIntIncl(1600, 3200);

    return [{
        duration: duration,
        fn: TrashFire.noiseLayer.show,
        args: [8]
    },
    {
        duration: 0,
        fn: TrashFire.noiseLayer.hide,
        args: [32]
    }]
    .map(addTimeFromDurations);
})
.map(timeWindowOffset(lastTime))
.reduce(TrashUtils.flatten, []);
