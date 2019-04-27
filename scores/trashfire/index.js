import { TrashFire, layout } from "./_setup"

import * as utils from "./_utils"

import makeDumpster from "./_dumpster.js"
const dumpster = makeDumpster(TrashFire)

import makeTrash from "./_trash.js"
const trash = makeTrash(TrashFire)
import makeSpike from "./_spike.js"
const spike = makeSpike(TrashFire)
import makeNoise from "./_noise.js"
const noise = makeNoise(TrashFire)
import makeScrapeDrone from "./_scrape-drone.js"
const scrapeDrone = makeScrapeDrone(TrashFire)

//import fireCycle from "./_score.fire-cycle.js"
//import noise from "./_score.noise.js"
//import drone from "./_score.drone.js"
//import score from "./_score.js"

//import controls from "./_controls.js"
//import resize from "./_resize.js"

// TODO implement
d3.select(window).on('load', function() {
  // resize();
  // TrashFire.noiseLayer.render();
});
