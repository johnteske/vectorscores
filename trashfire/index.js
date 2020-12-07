(function () {
  'use strict';

  const lcg = (seed) => () =>
    ((seed = Math.imul(741103597, seed)) >>> 0) / 2 ** 32;

  // Excludes max
  const floatBetween = (lcg, min, max) => lcg() * (max - min) + min;

  // Includes max
  const integerBetween = (lcg, min, max) =>
    Math.floor(floatBetween(lcg, min, max));

  const itemFrom = (lcg, items) => items[Math.floor(lcg() * items.length)];

  const itemFromWeighted = (lcg, items, weights) => {
    const totalWeight = weights.reduce((a, b) => a + b, 0);

    const rand = floatBetween(lcg, 0, totalWeight);

    for (let i = 0, acc = 0; i < items.length; i++) {
      acc += weights[i];

      if (rand <= acc) {
        return items[i];
      }
    }
  };

  const prng = lcg(Date.now());

  // {% include_relative _setup.js %}
  var TrashFire = (function () {
    var tf = {};

    tf.view = {
      width: 480,
      height: 480,
    };

    tf.svg = d3
      .select(".main")
      .attr("width", tf.view.width)
      .attr("height", tf.view.height);

    tf.svg.append("defs").node().innerHTML = `
<g id="front" stroke="black" stroke-width="1" fill="white" fill-rule="evenodd" transform="translate(0.000000, 48.000000)">
  <path d="M16,1 L296,1" id="top-edge"></path>
  <polyline id="bottom" points="24 59 40 156 272 156 288 59"></polyline>
  <polygon id="mid" points="16 14 296 14 296 59 16 59"></polygon>
  <rect id="top-edge-fill" stroke="none" x="16" y="1" width="280" height="6"></rect>
  <path d="M16,1 L296,1" id="top-edge"></path>
  <rect id="top-lip" x="7" y="7" width="298" height="7"></rect>
  <g id="fork-left" transform="translate(0.000000, 14.000000)">
    <rect id="outer" x="0" y="12" width="16" height="29"></rect>
    <rect id="inner" x="3" y="15" width="10" height="23"></rect>
    <path d="M0,12 L12,0" id="Line" stroke-linecap="square"></path>
  </g>
  <g id="fork-right" transform="translate(312.000000, 14.000000) scale(-1, 1)">
    <rect id="outer" x="0" y="12" width="16" height="29"></rect>
    <rect id="inner" x="3" y="15" width="10" height="23"></rect>
    <path d="M0,12 L12,0" id="Line" stroke-linecap="square"></path>
  </g>
</g>
<g id="back" stroke="black" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(7.000000, 0.000000)">
  <polyline id="outer" points="298 55 278 0 20 0 0 55"></polyline>
  <polyline id="inner" points="289 49 273 5 25 5 9 49"></polyline>
  <path d="M273,5 L273,49" id="line-r" stroke-linecap="square"></path>
  <path d="M25,5 L25,49" id="line-l" stroke-linecap="square"></path>
</g>`;

    tf.wrapper = tf.svg.append("g");

    tf.dumpster = {
      y: 200,
      width: 312,
      height: 204,
    };

    tf.trashOrigin = {
      x: tf.dumpster.width * 0.5,
      y: tf.dumpster.height * 0.5,
    };

    return tf;
  })();

  var layout = {
    width: TrashFire.view.width,
    height: TrashFire.view.height,
    margin: {},
    main: d3.select("main"),
  };

  d3.select(window).on("load", function () {
    resize();
    TrashFire.noiseLayer.render();
  });

  // {% include_relative _helpers.js %}
  var TrashUtils = {};

  TrashUtils.buildArray = function (n, fn) {
    var array = [];

    for (var i = 0; i < n; i++) {
      array[i] = fn(i, n);
    }

    return array;
  };

  TrashUtils.flatten = function (target, array) {
    return target.concat(array);
  };

  TrashUtils.last = function (array) {
    return array.slice(-1)[0] || [];
  };

  TrashUtils.lineGenerator = d3
    .line()
    .x(function (d) {
      return d[0];
    })
    .y(function (d) {
      return d[1];
    });

  TrashUtils.push = function (array, item) {
    return [].concat(array, item);
  };

  TrashUtils.sum = function (a, b) {
    return a + b;
  };

  // {% include_relative _dumpster.js %}
  /**
   * Draw front and back groups so objects can emerge between the layers
   */
  var dumpster = (function (tf) {
    var dumpster = {};

    var group = tf.wrapper
      .append("g")
      .attr("transform", translateDumpsterWithYOffset(0));

    group.call(addDumpsterLayer, "back");

    dumpster.trashGroup = group.append("g");

    group.call(addDumpsterLayer, "front");

    dumpster.shake = function () {
      group
        .transition()
        .duration(300)
        .ease(d3.easeElastic)
        .attr("transform", translateDumpsterWithYOffset(10))
        .transition()
        .duration(300)
        .ease(d3.easeBounce)
        .attr("transform", translateDumpsterWithYOffset(0));
    };

    function translateDumpsterWithYOffset(yOffset) {
      return function () {
        return (
          "translate(" +
          (tf.view.width - tf.dumpster.width) * 0.5 +
          ", " +
          (tf.dumpster.y + yOffset) +
          ")"
        );
      };
    }

    function addDumpsterLayer(selection, layer) {
      selection
        .append("g")
        .append("use")
        .attr("href", `#${layer}`);
    }

    return dumpster;
  })(TrashFire);

  // {% include_relative _trash.js %}
  /**
   * Generate trash
   */
  var trash = (function (tf) {
    var trash = {};

    var xOffset = 10;
    var yOffset = -50;

    var _trash = [];

    trash.set = function (t, trashArray) {
      _trash = trashArray;
      update(t);
    };

    function update(dur) {
      // var dur = duration || 1000;

      var trashWidths = _trash.map(function (t) {
        return t.size;
      });

      var xOffsets = (_trash.length - 1) * xOffset;
      var trashWidthSum = trashWidths.reduce(TrashUtils.sum, xOffsets);
      // Leftmost trash position based on width of all trash (and offsets)
      var trashX = tf.trashOrigin.x - trashWidthSum * 0.5;

      function trashPosition(d, i) {
        var currentSum = trashWidths.slice(0, i).reduce(TrashUtils.sum, 0);
        var x = trashX + (currentSum + i * xOffset);
        var y = d.size * -0.5 + yOffset;
        return "translate(" + x + "," + y + ")";
      }

      var trashSelection = dumpster.trashGroup
        .selectAll(".trash")
        .data(_trash, function (d) {
          return d.id;
        });

      // EXIT
      trashSelection
        .exit()
        .transition()
        .duration(dur)
        .attr("transform", translateTrashOrigin)
        .style("opacity", 0)
        .remove();

      // UPDATE
      trashSelection.transition().duration(dur).attr("transform", trashPosition);

      // ENTER
      trashSelection
        .enter()
        .append("g")
        .attr("class", "trash")
        .attr("transform", translateTrashOrigin)
        .call(makePath)
        .transition()
        .duration(dur)
        .attr("transform", trashPosition);
    }

    function translateTrashOrigin() {
      return "translate(" + tf.trashOrigin.x + "," + tf.trashOrigin.y + ")";
    }

    return trash;
  })(TrashFire);

  function makePath(selection) {
    selection.each(function (d) {
      var nPoints = 60;
      var margin = 10;
      var slice = (d.size - margin * 2) / (nPoints + 1);
      var height = d.type === "blaze" ? d.size * 0.67 : 3;

      d.pathPoints = TrashUtils.buildArray(
        nPoints,
        d.type === "embers" ? makeEmberPoint : makeFlamePoint
      );

      function makeFlamePoint(i) {
        return [
          margin + i * slice,
          d.size * 0.5 - height * 0.5 + prng() * height,
        ];
      }

      function makeEmberPoint(i) {
        return [
          margin + i * slice,
          d.size - margin - i * slice + prng() * height,
        ];
      }
    });

    selection
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", function (d) {
        return d.type !== "embers" ? 2 : 1;
      })
      .style("opacity", function (d) {
        return d.type === "blaze" || d.type === "scrape" ? 1 : 0.5;
      })
      .attr("d", function (d) {
        return TrashUtils.lineGenerator(d.pathPoints);
      });
  }

  // {% include_relative _spike.js %}
  TrashFire.spike = (function (tf) {
    var spike = {};

    var x = tf.view.width * 0.5;

    var path = tf.wrapper
      .append("path")
      .attr("d", "M-15,0 L15,0 L0,60 Z")
      .style("opacity", 0);

    spike.show = function (t, trashes) {
      trash.set(0, trashes);

      path
        .attr("transform", translateY(15))
        .style("opacity", 0)
        .transition()
        .duration(t)
        .style("opacity", 1);
    };

    spike.hit = function (t, trashes) {
      trash.set(t * 0.4, trashes);

      path
        .transition()
        .duration(t * 0.8)
        .ease(d3.easeElastic)
        .attr("transform", translateY(tf.dumpster.y - 45))
        .transition()
        .duration(t * 0.2)
        .ease(d3.easeLinear)
        .style("opacity", 0);

      dumpster.shake();
    };

    // Used for step control hook only
    spike.hide = function () {
      path.style("opacity", 0);
    };

    function translateY(y) {
      return function () {
        return "translate(" + x + ", " + y + ")";
      };
    }

    return spike;
  })(TrashFire);

  // {% include_relative _noise.js %}
  /**
   * TODO make noise noisier, similar to trash/fire paths
   */
  TrashFire.noiseLayer = (function (tf) {
    var noiseLayer = {};

    var group = tf.wrapper.append("g");
    var noiseElements;

    var n = 200; // fixed size, for now

    function x() {
      return prng() * layout.main.width - layout.main.width * 0.25;
    }

    function y() {
      return prng() * layout.main.height;
    }

    function w() {
      return prng() * layout.main.width;
    }

    function h() {
      return prng() * 2;
    }

    noiseLayer.render = function () {
      noiseElements = group
        .selectAll(".noise")
        .data(d3.range(0, n))
        .enter()
        .append("rect")
        .attr("class", "noise")
        .style("opacity", 0)
        .attr("fill", "#888888")
        .attr("x", x)
        .attr("y", y)
        .attr("width", w)
        .attr("height", h);
    };

    noiseLayer.show = delayedOpacityTransition(1);

    noiseLayer.hide = delayedOpacityTransition(0);

    function delayedOpacityTransition(opacity) {
      return function (delay) {
        noiseElements
          .transition()
          .duration(0)
          .delay(function (d, i) {
            return i * delay;
          })
          .style("opacity", opacity);
      };
    }

    return noiseLayer;
  })(TrashFire);

  // {% include_relative _scrape-drone.js %}
  TrashFire.scrapeDrone = (function (tf) {
    var drone = {};

    var width = tf.view.width * 0.75;

    var selection = tf.wrapper
      .append("path")
      .attr(
        "transform",
        "translate(" + (tf.view.width * 0.5 - width * 0.5) + "," + 350 + ")"
      )
      .style("opacity", 0)
      .attr("fill", "none")
      .attr("stroke", "#444")
      .attr("d", function () {
        return TrashUtils.lineGenerator(makePath());
      });

    function makePath() {
      var points = 232;
      var slice = width / (points + 1);
      var height = 3;

      return TrashUtils.buildArray(points, function (i) {
        return [i * slice, height * 0.5 + prng() * height];
      });
    }

    drone.show = function (t) {
      var dur = typeof t === "undefined" ? 7000 : t;
      selection
        .attr("stroke-width", 0)
        .transition()
        .duration(dur)
        .attr("stroke-width", 5)
        .style("opacity", 1);
    };

    drone.hide = function (t) {
      var dur = typeof t === "undefined" ? 7000 : t;
      selection
        .transition()
        .duration(dur)
        .attr("stroke-width", 0)
        .style("opacity", 0);
    };

    return drone;
  })(TrashFire);

  // {% include_relative _score.fire-cycle.js %}
  function makeTrash(type, min, max) {
    return {
      id: VS.id(),
      size: integerBetween(prng, min, max),
      type: type,
    };
  }

  function addTrash(acc, bar, fn) {
    var lastTrashList = TrashUtils.last(acc);
    var newTrashList = TrashUtils.push(lastTrashList, fn(bar));
    return TrashUtils.push(acc, [newTrashList]);
  }

  function removeTrash(acc) {
    var lastTrashList = TrashUtils.last(acc);
    var newTrashList = lastTrashList.slice(1);
    return TrashUtils.push(acc, [newTrashList]);
  }

  function emptyTrash(acc) {
    return TrashUtils.push(acc, [[]]);
  }

  function copyTrash(acc) {
    var lastTrashList = TrashUtils.last(acc);
    return TrashUtils.push(acc, [lastTrashList]);
  }

  /**
   * Fire/spike cycle
   */
  function fireCycle() {
    // Build 3-5 flames
    var flames = TrashUtils.buildArray(itemFrom(prng, [3, 4, 5]), function (
      index,
      n
    ) {
      var type = index > 2 ? "blaze" : "crackle";

      return {
        duration: (7 - index) * 1000, // duration: 7-2 seconds
        action: "add",
        fn: trash.set,
        transitionDuration: 1000,
        trashes: [makeTrash(type, 25, 25 + index * (50 / n))],
      };
    });

    // Hit dumpster, 0-3 times
    // TODO reduce trash to last 3 items if no spike?
    var nSpikes = itemFromWeighted(prng, [0, 1, 2, 3], [15, 60, 15, 10]);
    var spikes = TrashUtils.buildArray(nSpikes, function () {
      return [
        {
          duration: 600,
          action: "copy",
          fn: TrashFire.spike.show,
          transitionDuration: 600,
        },
        {
          duration: 750,
          action: "empty",
          fn: TrashFire.spike.hit,
          transitionDuration: 750,
        },
      ];
    }).reduce(TrashUtils.flatten, []);

    var tailType = itemFrom(prng, ["resume", "embers", "multi", ""]);
    var tailFns = {
      resume: resume,
      embers: embers,
      multi: multi,
    };
    var tail = tailType !== "" ? tailFns[tailType]() : [];

    // Come back stronger
    function resume() {
      return {
        duration: 7000,
        action: "add",
        fn: trash.set,
        transitionDuration: 1000,
        trashes: [makeTrash("blaze", 25, 75)],
      };
    }

    function embers() {
      var n = itemFrom(prng, [1, 2, 3]);

      var grow = TrashUtils.buildArray(n, function (i) {
        return {
          duration: (7 - i) * 1000, // duration: 7-5 seconds
          action: "add",
          fn: trash.set,
          transitionDuration: 1000,
          trashes: [makeTrash("embers", 25, 75)],
        };
      });

      var die = TrashUtils.buildArray(n, function (i, n) {
        return {
          duration: (n - i + 4) * 1000,
          action: "remove",
          fn: trash.set,
          transitionDuration: 1000,
        };
      });

      return [].concat(grow, die);
    }

    function multi() {
      var n = itemFrom(prng, [1, 2, 3]);

      var trashes = TrashUtils.buildArray(n, function () {
        return makeTrash("crackle", 25, 75);
      });

      // Add
      var add = {
        duration: 7000,
        action: "add",
        fn: trash.set,
        transitionDuration: 1000,
        trashes: trashes,
      };

      // Then die away
      var dieAway = TrashUtils.buildArray(n, function (i, n) {
        return {
          duration: (n - i + 4) * 1000,
          action: "remove",
          fn: trash.set,
          transitionDuration: 1000,
        };
      });

      return [].concat(add, dieAway);
    }

    // Empty trash
    var empty = {
      duration: 3000,
      action: "empty",
      fn: trash.set,
      transitionDuration: 1000,
    };

    var cycle = [].concat(flames, spikes, tail, empty);

    var trashes = cycle.reduce(function (acc, bar) {
      var actions = {
        add: addTrash,
        remove: removeTrash,
        empty: emptyTrash,
        copy: copyTrash,
      };
      return actions[bar.action](acc, bar, function (bar) {
        return bar.trashes;
      });
    }, []);

    // Zip the events and trash together, then add time, for a valid VS.score event
    return cycle
      .map(function (d, i) {
        return {
          duration: d.duration,
          fn: d.fn,
          args: [d.transitionDuration, trashes[i]],
        };
      })
      .map(addTimeFromDurations);
  }

  var fireEvents = TrashUtils.buildArray(5, fireCycle)
    .map(function (cycle, i, cycles) {
      if (i === 0) {
        return cycle;
      }

      var previousCycle = cycles[i - 1];
      var lastBarPreviousCycle = previousCycle[previousCycle.length - 1];
      var offset = lastBarPreviousCycle.time + lastBarPreviousCycle.duration;

      return cycle.map(timeOffset(offset));
    })
    .reduce(TrashUtils.flatten, []);

  var lastTime = fireEvents[fireEvents.length - 1].time;

  // {% include_relative _score.noise.js %}
  /**
   * Noise
   */
  var noiseEvents = TrashUtils.buildArray(5, function () {
    var duration = integerBetween(prng, 1600, 3200);

    return [
      {
        duration: duration,
        fn: TrashFire.noiseLayer.show,
        args: [8],
      },
      {
        duration: 0,
        fn: TrashFire.noiseLayer.hide,
        args: [32],
      },
    ].map(addTimeFromDurations);
  })
    .map(timeWindowOffset(lastTime))
    .reduce(TrashUtils.flatten, []);

  // {% include_relative _score.drone.js %}
  /**
   * Drone
   */
  var droneEvents = TrashUtils.buildArray(3, function (i, n) {
    var timeWindow = Math.floor(lastTime / n);
    var duration = timeWindow * floatBetween(prng, 0.5, 0.75);

    return [
      {
        duration: duration,
        fn: TrashFire.scrapeDrone.show,
        args: [],
      },
      {
        duration: 0,
        fn: TrashFire.scrapeDrone.hide,
        args: [],
      },
    ].map(addTimeFromDurations);
  })
    .map(timeWindowOffset(lastTime))
    .reduce(TrashUtils.flatten, []);

  // {% include_relative _score.js %}
  // NOTE this mutates its input
  function addTimeFromDurations(currentBar, i, score) {
    currentBar.time = score.slice(0, i).reduce(function (sum, bar) {
      return (sum += bar.duration);
    }, 0);

    return currentBar;
  }

  function timeOffset(ms) {
    return function (bar) {
      bar.time += ms;
      return bar;
    };
  }

  function timeWindowOffset(endTime) {
    return function (d, i, list) {
      var timeWindow = Math.floor(endTime / list.length);
      var offset = timeWindow * i + integerBetween(prng, 0, timeWindow);

      return d.map(timeOffset(offset));
    };
  }

  var firstEvent = {
    time: 0,
    fn: trash.set,
    args: [0, []],
  };

  /**
   * Sort score by event time
   */
  var score = []
    .concat(firstEvent, fireEvents, noiseEvents, droneEvents)
    .sort(function (a, b) {
      return a.time - b.time;
    });

  score.forEach(function (bar) {
    VS.score.add(bar.time, bar.fn, bar.args);
  });

  // {% include_relative _controls.js %}
  VS.score.hooks.add("stop", function () {
    trash.set(1000, []);
    TrashFire.noiseLayer.hide(0);
    TrashFire.scrapeDrone.hide(0);
    dumpster.shake();
  });

  VS.control.hooks.add("step", function () {
    var pointer = VS.score.getPointer();
    var argsWithZeroDuration = [].concat(0, score[pointer].args.slice(1));
    score[pointer].fn.apply(null, argsWithZeroDuration);

    // If not explicitly showing these layers, hide
    score[pointer].fn !== TrashFire.spike.show && TrashFire.spike.hide(0);
    score[pointer].fn !== TrashFire.noiseLayer.show &&
      TrashFire.noiseLayer.hide(0);
    score[pointer].fn !== TrashFire.scrapeDrone.show &&
      TrashFire.scrapeDrone.hide(0);
  });

  // {% include_relative _resize.js %}
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

}());
