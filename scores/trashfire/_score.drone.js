/**
 * Drone
 */
// var droneEvents = buildArray(3, function(i, n) {
//     var timeWindow = Math.floor(lastTime / n);
//     var duration = timeWindow * VS.getRandIntIncl(0.5, 0.75);

//     return [
//         {
//             duration: duration,
//             fn: TrashFire.scrapeDrone.show,
//             args: []
//         },
//         {
//             duration: 0,
//             fn: TrashFire.scrapeDrone.hide,
//             args: []
//         }
//     ]
//     .map(addTimeFromDurations);
// })
// .map(timeWindowOffset(lastTime))
// .reduce(flatten, []);
var droneEvents = [];
