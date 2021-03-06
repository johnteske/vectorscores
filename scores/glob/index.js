import generateScore from "./_score.js";
import Glob from "./_glob.js";
import * as meta from "./_meta.js";
import scoreOptions from "./_options.js";

var canvas = {
    width: 400,
    height: 400,
    center: 200,
  },
  layout = {
    width: 240,
    margin: {},
  },
  transitionTime = {
    long: 20000,
    short: 600,
  },
  scoreLength = 12,
  textoffset = 5,
  debug = +VS.getQueryString("debug") === 1 || false,
  svg = d3.select(".main"),
  wrapper = svg.append("g");

var pitchClassSet = meta.pitchClassSet(canvas, wrapper, scoreOptions);
var dynamics = meta.dynamics(canvas, wrapper);

var glob0 = new Glob(wrapper, canvas);
var glob1 = new Glob(wrapper, canvas);
var glob2 = new Glob(wrapper, canvas);

var update = (function (options) {
  return function (dur, bar) {
    var pcSet = VS.pitchClass.transpose(
      bar.pitch.set,
      bar.pitch.transpose + options.transposition
    );
    pitchClassSet.update(pcSet);

    glob0.move(dur, bar.globs[0]);
    glob1.move(dur, bar.globs[1]);
    glob2.move(dur, bar.globs[2]);

    dynamics.update(bar.dynamics);
  };
})(scoreOptions);

var score = generateScore(update, transitionTime.long);
update(0, score[0]);

/**
 * Debug
 */
if (debug) {
  var debugGroup = wrapper.append("g").attr("class", "debug");

  debugGroup
    .append("circle")
    .attr("r", 12)
    .attr("cx", canvas.center)
    .attr("cy", canvas.center);

  debugGroup
    .append("circle")
    .attr("r", 96)
    .attr("cx", canvas.center)
    .attr("cy", canvas.center);

  debugGroup
    .append("circle")
    .attr("r", 192)
    .attr("cx", canvas.center)
    .attr("cy", canvas.center);

  debugGroup
    .append("rect")
    .attr("r", 12)
    .attr("width", canvas.width)
    .attr("height", canvas.height);
}

/**
 * Resize
 */
d3.select(window).on("resize", resize);

function resize() {
  var main = d3.select("main");

  var w = parseInt(main.style("width"), 10);
  var h = parseInt(main.style("height"), 10);

  var scaleX = VS.clamp(w / canvas.width, 0.25, 3);
  var scaleY = VS.clamp(h / canvas.height, 0.25, 3);

  layout.scale = Math.min(scaleX, scaleY);

  layout.margin.left = w * 0.5 - canvas.width * 0.5 * layout.scale;
  layout.margin.top = h * 0.5 - canvas.height * 0.5 * layout.scale;

  wrapper.attr(
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

resize();

var updateAtPointer = function () {
  var pointer = VS.score.getPointer();

  if (!VS.score.pointerAtLastEvent()) {
    update(transitionTime.short, score[pointer]);
  }
};

VS.score.hooks.add("stop", updateAtPointer);
VS.control.hooks.add("step", updateAtPointer);
