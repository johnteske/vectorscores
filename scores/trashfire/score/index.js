import fireEvents from "./fire-cycle.js"
var lastTime = fireEvents[fireEvents.length - 1].time;
import makeNoiseEvents from "./noise.js"
const noiseEvents = makeNoiseEvents(lastTime)
import makeDroneEvents from "./drone.js"
const droneEvents = makeDroneEvents(lastTime)

import trash from '../_trash'

var firstEvent = {
    time: 0,
    fn: trash.set,
    args: [0, []]
};

/**
 * Sort score by event time
 */
var score = [].concat(firstEvent, fireEvents, noiseEvents, droneEvents)
    .sort(function(a, b) {
        return a.time - b.time;
    });

export default score
