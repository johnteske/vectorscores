import { addTimeFromDurations, timeWindowOffset } from './time'
import { buildArray, flatten } from '../_utils'
import noiseLayer from '../_noise'

/**
 * Noise
 */
function makeNoiseEvents(lastTime) {
  return buildArray(5, function() {
    var duration = VS.getRandIntIncl(1600, 3200);

    return [{
        duration: duration,
        fn: noiseLayer.show,
        args: [8]
    },
    {
        duration: 0,
        fn: noiseLayer.hide,
        args: [32]
    }]
    .map(addTimeFromDurations);
})
.map(timeWindowOffset(lastTime))
.reduce(flatten, []);
}

export default makeNoiseEvents
