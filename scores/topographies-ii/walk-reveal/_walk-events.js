/**
 * WIP
 * list of height, revealed, walked data at each point in walk
 * first event is initial topoData,
 */

var walkEvents = [topoData.map(function(d) {
    return {
        height: d.height,
        revealed: 0,
        walked: false
    };
})];

console.log(walkEvents);
