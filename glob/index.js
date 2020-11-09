(function () {
  'use strict';

  function generateScore (update, tt) {
    var score = [];
    var bars = [
      // <
      {
        duration: 3000,
        types: ["glob"],
        range: [0, 0],
        dynamics: "n",
        pitch: { set: [] },
      },
      // A
      {
        types: ["glob"],
        range: [1, 4],
        dynamics: "pp",
        pitch: { set: [0, 1, 2] },
      },
      {
        types: ["glob"],
        range: [1, 4],
        dynamics: "p",
        pitch: { set: [0, 1, 4] },
      },
      // B
      {
        types: ["glob", "chord"],
        range: [3, 7],
        dynamics: "mf",
        pitch: { set: [0, 1, 6] },
      },
      {
        types: ["glob", "chord"],
        range: [3, 7],
        dynamics: "mf",
        pitch: { set: [0, 2, 6] },
      },
      {
        types: ["glob", "chord"],
        range: [3, 7],
        dynamics: "mf",
        pitch: { set: [0, 1, 3] },
      },
      // C
      {
        types: ["glob"],
        range: [3, 13],
        dynamics: "mp",
        pitch: { set: [0, 1, 4] },
      },
      {
        types: ["rhythm"],
        range: [3, 13],
        dynamics: "p",
        pitch: { set: [0, 2, 5] },
      },
      {
        types: ["glob", "rhythm"],
        range: [3, 13],
        dynamics: "mp",
        pitch: { set: [0, 1, 5] },
      },
      // D
      {
        types: ["glob"],
        range: [12, 19],
        dynamics: "mf",
        pitch: { set: [0, 1, 3] },
      },
      {
        types: ["glob"],
        range: [12, 25],
        dynamics: "ff",
        pitch: { set: [0, 1, 4, 6] },
      },
      {
        types: ["glob"],
        range: [12, 25],
        dynamics: "f",
        pitch: { set: [0, 1, 4] },
      },
      // E
      {
        types: ["glob", "chord", "rhythm"],
        range: [12, 25],
        dynamics: "mf",
        pitch: { set: [0, 2, 6] },
      },
      {
        types: ["glob", "chord", "rhythm"],
        range: [12, 25],
        dynamics: "mp",
        pitch: { set: [0, 1, 6] },
      },
      {
        types: ["glob", "chord", "rhythm"],
        range: [12, 25],
        dynamics: "p",
        pitch: { set: [0, 2, 5] },
      },
      // F
      {
        types: ["glob", "chord"],
        range: [1, 25],
        dynamics: "pp",
        pitch: { set: [0, 1, 5] },
      },
      {
        types: ["glob", "rhythm"],
        range: [1, 4],
        dynamics: "ppp",
        pitch: { set: [0, 1, 3] },
      },
      // >
      {
        duration: 3000,
        types: ["glob"],
        range: [0, 0],
        dynamics: "n",
        pitch: { set: [] },
      },
    ];

    var globules0 = [],
      globules1 = [],
      globules2 = [];

    function randInt(min, max) {
      return Math.floor(VS.getRandExcl(min, max));
    }

    function createGlobules(globules, n) {
      globules = globules.slice(0, n);

      for (var i = 0; i < n - globules.length; i++) {
        globules.push(VS.getItem([1, 2, 4]));
      }

      return globules;
    }

    var time = 0;
    var transpose = 0;

    for (var i = 0; i < bars.length; i++) {
      var bar = bars[i],
        range = bar.range;

      globules0 = createGlobules(globules0, randInt(range[0], range[1]));
      globules1 = createGlobules(globules1, randInt(range[0], range[1]));
      globules2 = createGlobules(globules2, randInt(range[0], range[1]));

      bar.pitch.transpose = transpose;

      score.push({
        globs: [
          {
            type: VS.getItem(bar.types),
            durations: globules0,
          },
          {
            type: VS.getItem(bar.types),
            durations: globules1,
          },
          {
            type: VS.getItem(bar.types),
            durations: globules2,
          },
        ],
        dynamics: bar.dynamics,
        pitch: bar.pitch,
      });

      VS.score.add(time, update, [tt, score[i]]);

      time += bar.duration || tt;

      // transpose +/- within range of pitch class set in normal form
      transpose +=
        VS.getItem([-1, 1]) *
        Math.floor(
          Math.random() * (bar.pitch.set[bar.pitch.set.length - 1] || 0)
        );
    }

    // final, empty event
    VS.score.add(time);

    return score;
  }

  var durationDict = VS.dictionary.Bravura.durations.stemless;
  var radius = 96;

  function newPoint(x, y) {
    var r = VS.getRandExcl(1, radius), // TODO allow radius to be set
      angle = Math.random() * Math.PI * 2,
      d = Math.random() - Math.random();
    return {
      x: Math.cos(angle) * r * d + x,
      y: Math.sin(angle) * r * d + y,
    };
  }

  /**
   * Create a cloud of elements
   * @constructor
   * @param {D3Selection} parent - Parent element to which the Glob is appended
   */
  function Glob(parent, canvas, args) {
    args = args || {};

    this.group = parent
      .append("g")
      .attr(
        "transform",
        "translate(" + (canvas.center - 11) + ", " + canvas.center + ")"
      );

    this.size = args.n || 8;

    this.center = {
      x: 0,
      y: 0,
    };

    // this.data = d3.range(this.size); // fallback if no data
  }

  Glob.prototype.move = function (dur, data) {
    var self = this,
      type = data.type,
      t = d3.transition().duration(dur).ease(d3.easeCubic);

    // this.data = data;

    function clone(o) {
      return JSON.parse(JSON.stringify(o));
    }

    var oldCenter = clone(this.center);

    this.center = {
      x: VS.getRandExcl(-radius, radius),
      y: VS.getRandExcl(-radius, radius),
    };

    function transform() {
      var point = newPoint(self.center.x, self.center.y);
      if (type === "chord") {
        point.x = 0;
      } else if (type === "rhythm") {
        point.y = 0;
      }
      return "translate(" + point.x + ", " + point.y + ")";
    }

    var globules = this.group.selectAll(".globule").data(data.durations);

    // exit
    globules
      .exit()
      .transition(t)
      .attr("transform", "translate(" + this.center.x + "," + this.center.y + ")")
      .style("opacity", 0)
      .remove();

    // update
    globules.transition(t).style("opacity", 1).attr("transform", transform);

    // enter
    globules
      .enter()
      .append("text")
      .attr("class", "globule")
      .text(function (d) {
        return durationDict[d];
      })
      .attr("transform", "translate(" + oldCenter.x + "," + oldCenter.y + ")")
      .style("opacity", 0)
      .transition(t)
      .attr("transform", transform)
      .style("opacity", 1);
  };

  /**
   * Pitch class set
   */
  function pitchClassSet(canvas, wrapper, options) {
    var selection = wrapper
      .append("text")
      .attr("class", "pc-set")
      .attr("x", canvas.center)
      .attr("dy", "1em");

    function update(set) {
      var formatted = set
        .map(function (pc) {
          return VS.pitchClass.format(
            pc,
            options.pitchClasses.display,
            options.pitchClasses.preference
          );
        })
        .join(", ");

      selection.text(function () {
        return "{" + formatted + "}";
      });
    }

    return {
      update: update,
    };
  }

  /**
   * Dynamics
   */
  var dynamicsDict = VS.dictionary.Bravura.dynamics;
  function dynamics(canvas, wrapper) {
    var selection = wrapper
      .append("text")
      .attr("class", "dynamics")
      .attr("x", canvas.center)
      .attr("y", canvas.height)
      .attr("dy", "-0.5em");

    function update(text) {
      selection.text(dynamicsDict[text]);
    }

    return {
      update: update,
    };
  }

  VS.scoreOptions.add(
    "pitchClasses",
    { "pitch-classes": "numbers", prefer: "te" },
    new VS.PitchClassSettings()
  );
  VS.scoreOptions.add("transposition", 0, new VS.NumberSetting("transposition"));

  var scoreOptions = (function () {
    var options = VS.scoreOptions.setFromQueryString();

    // TODO working with old property names in score, for now
    options.pitchClasses.display = options.pitchClasses["pitch-classes"];
    options.pitchClasses.preference = options.pitchClasses["prefer"];

    // TODO should coerce internally
    options.transposition = +options.transposition;

    return options;
  })();

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
    debug = +VS.getQueryString("debug") === 1 || false,
    svg = d3.select(".main"),
    wrapper = svg.append("g");

  var pitchClassSet$1 = pitchClassSet(canvas, wrapper, scoreOptions);
  var dynamics$1 = dynamics(canvas, wrapper);

  var glob0 = new Glob(wrapper, canvas);
  var glob1 = new Glob(wrapper, canvas);
  var glob2 = new Glob(wrapper, canvas);

  var update = (function (options) {
    return function (dur, bar) {
      var pcSet = VS.pitchClass.transpose(
        bar.pitch.set,
        bar.pitch.transpose + options.transposition
      );
      pitchClassSet$1.update(pcSet);

      glob0.move(dur, bar.globs[0]);
      glob1.move(dur, bar.globs[1]);
      glob2.move(dur, bar.globs[2]);

      dynamics$1.update(bar.dynamics);
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

}());
