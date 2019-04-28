import { addTimeFromDurations, timeWindowOffset } from './time'
import { buildArray, flatten } from '../_utils'
import scrapeDrone from '../_scrape-drone'

/**
 * Drone
 */
function makeDroneEvents(lastTime) {
  return buildArray(3, function(i, n) {
    var timeWindow = Math.floor(lastTime / n);
    var duration = timeWindow * VS.getRandIntIncl(0.5, 0.75);

    return [
        {
            duration: duration,
            fn: scrapeDrone.show,
            args: []
        },
        {
            duration: 0,
            fn: scrapeDrone.hide,
            args: []
        }
    ]
    .map(addTimeFromDurations);
})
.map(timeWindowOffset(lastTime))
.reduce(flatten, []);
}

export default makeDroneEvents
