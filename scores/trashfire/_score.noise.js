/**
 * Noise
 */
// var noiseEvents = buildArray(5, function() {
//     var duration = VS.getRandIntIncl(1600, 3200);

//     return [{
//         duration: duration,
//         fn: TrashFire.noiseLayer.add,
//         args: [8]
//     },
//     {
//         duration: 0,
//         fn: TrashFire.noiseLayer.remove,
//         args: [32]
//     }]
//     .map(addTimeFromDurations);
// })
// .map(timeWindowOffset(lastTime))
// .reduce(flatten, []);
var noiseEvents = [];
