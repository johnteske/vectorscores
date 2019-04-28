import { TrashFire, layout } from "./_setup";

import * as utils from "./_utils";

import makeDumpster from "./_dumpster.js";
const dumpster = makeDumpster(TrashFire);

import makeTrash from "./_trash.js";
const trash = makeTrash(TrashFire);
import makeSpike from "./_spike.js";
const spike = makeSpike(TrashFire);
import makeNoise from "./_noise.js";
const noise = makeNoise(TrashFire);
import makeScrapeDrone from "./_scrape-drone.js";
const scrapeDrone = makeScrapeDrone(TrashFire);

import score from "./score/index.js";
score.forEach(function(bar) {
  VS.score.add(bar.time, bar.fn, bar.args);
});

//import controls from "./_controls.js"

/**
 * Resize
 */
function resize() {
  var main = layout.main;

  var w = (layout.main.width = parseInt(main.style("width"), 10));
  var h = (layout.main.height = parseInt(main.style("height"), 10));

  var scaleX = VS.clamp(w / layout.width, 0.25, 2);
  var scaleY = VS.clamp(h / layout.height, 0.25, 2);

  layout.scale = Math.min(scaleX, scaleY);

  layout.margin.left = w * 0.5 - layout.width * 0.5 * layout.scale;
  layout.margin.top = h * 0.5 - layout.height * 0.5 * layout.scale;

  TrashFire.wrapper.attr(
    "transform",
    "translate(" +
      layout.margin.left +
      "," +
      layout.margin.top +
      ") scale(" +
      layout.scale +
      "," +
      layout.scale +
      ")"
  );
}

d3.select(window).on("resize", resize);

// TODO implement
d3.select(window).on("load", function() {
  resize();
  // TrashFire.noiseLayer.render();
});
