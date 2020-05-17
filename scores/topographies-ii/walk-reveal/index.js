(function () {
  'use strict';

  // {% include_relative _setup.js %}
  var main = d3.select(".main"),
    wrapper = main.append("g"),
    topo = wrapper.append("g"),
    // width = 480,
    tileWidthHalf = 24,
    tileHeightHalf = tileWidthHalf * 0.5,
    heightScale = {
      revealed: 2.5,
      hidden: 1,
    },
    score = {
      width: 8, // currently used in creation, not display
    },
    revealFactor = 38,
    nearbyRevealFactor = 23,
    transitionTime = 600,
    nEvents = 100;

  var layout = {
    width: 400,
    height: 300,
    scale: 1,
    margin: {},
  };

  // {% include_relative _utils.js %}
  /**
   * x, y from i of row-major order
   */
  function indexToPoint(i) {
    var y = Math.floor(i / score.width);
    var x = i - y * score.width;

    return {
      x: x,
      y: y,
    };
  }

  function xyToIndex(x, y) {
    return (x & (score.width - 1)) + (y & (score.width - 1)) * score.width;
  }

  function pointToIndex(point) {
    return xyToIndex(point.x, point.y);
  }

  // {% include_relative _point.js %}
  function shift(axis, step) {
    return function (point) {
      var newPoint = {
        x: point.x,
        y: point.y,
      };
      newPoint[axis] += step;
      return newPoint;
    };
  }

  function compose(f, g) {
    return function (x) {
      return f(g(x));
    };
  }

  var directions = {
    west: shift("x", -1),
    east: shift("x", 1),
    north: shift("y", -1),
    south: shift("y", 1),
  };

  directions.northWest = compose(directions.north, directions.west);
  directions.southEast = compose(directions.south, directions.east);

  // {% include_relative _symbol-sets.js %}
  var symbolSet = {};

  switch (+VS.getQueryString("symbols") || VS.getRandIntIncl(1, 4)) {
    case 1:
      symbolSet.strings = Object.assign(
        VS.dictionary.Bravura.accidentals,
        VS.dictionary.Bravura.durations.stemless,
        {
          min: "\uE4E5", // quarter rest
          max: "\uE4C4", // short fermata
        }
      );

      symbolSet.offsets = {
        min: { x: -0.125, y: 0 },
        "-1.5": { x: -0.225, y: 0 }, // three-quarter flat (backwards, forwards)
        "-1": { x: -0.1, y: 0 }, // flat
        "-0.5": { x: -0.1325, y: 0 }, // quarter flat (backwards)
        "0": { x: -0.0875, y: 0 }, // natural
        "2": { x: -0.175, y: 0 },
        "1": { x: -0.175, y: 0 },
        "0.5": { x: -0.025, y: -0.25 },
        "0.25": { x: -0.025, y: -0.35 },
        max: { x: -0.3, y: 0.175 },
      };

      symbolSet.scale = ["-1.5", "-1", "-0.5", "0", "2", "1", "0.5", "0.25"];

      break;
    case 2:
      symbolSet.strings = Object.assign(VS.dictionary.Bravura.accidentals, {
        min: "\uE4C1", // long fermata, flipped
        under: "\uE4BA",
        over: "\uE4BB",
        max: "\uE4C4", // short fermata
      });

      symbolSet.offsets = {
        min: { x: -0.3, y: -0.16 },
        under: { x: -0.185, y: 0 },
        over: { x: -0.185, y: 0 },
        "0": { x: -0.0875, y: 0 }, // natural
        "0.5": { x: -0.09, y: -0.025 }, // quarter sharp (single vertical stroke)
        "1": { x: -0.125, y: 0 }, // sharp
        "1.5": { x: -0.1625, y: 0 }, // three-quarter sharp (three vertical strokes)
        max: { x: -0.3, y: 0.175 },
      };

      symbolSet.scale = [
        "under",
        "under",
        "over",
        "over",
        "0",
        "0.5",
        "1",
        "1.5",
      ];

      break;
    case 3:
      symbolSet.strings = Object.assign(
        VS.dictionary.Bravura.durations.stemless,
        {
          min: "\uE4C6", // long fermata
          graceAcc: "\uE560",
          graceApp: "\uE562",
          irrTremolo: "\uE22B",
          mordent: "\uE56C",
          max: "\uE537", // sfp
        }
      );

      symbolSet.offsets = {
        min: { x: -0.3, y: 0.1625 },
        "8": { x: -0.35, y: 0 },
        "4": { x: -0.225, y: 0 },
        "2": { x: -0.175, y: 0 },
        "1": { x: -0.175, y: 0 },
        irrTremolo: { x: 0, y: 0 },
        mordent: { x: -0.35, y: 0.125 },
        graceApp: { x: -0.1, y: 0 },
        graceAcc: { x: -0.1, y: 0 },
        max: { x: -0.4, y: 0.135 },
      };

      symbolSet.scale = [
        8,
        4,
        2,
        1,
        "irrTremolo",
        "mordent",
        "graceApp",
        "graceAcc",
      ];

      break;
    case 4:
    default:
      symbolSet.strings = Object.assign(
        VS.dictionary.Bravura.durations.stemless,
        VS.dictionary.Bravura.articulations,
        {
          min: "\uE4C1", // long fermata, flipped
          max: "\uE4C4", // short fermata
        }
      );

      symbolSet.offsets = {
        min: { x: -0.3, y: -0.16 },
        "-": { x: -0.1625, y: 0.03125 },
        ">": { x: -0.1625, y: 0.125 },
        ".": { x: -0.0625, y: 0.0625 },
        "2": { x: -0.175, y: 0 },
        "1": { x: -0.175, y: 0 },
        "0.5": { x: -0.025, y: -0.25 },
        "0.25": { x: -0.025, y: -0.35 },
        max: { x: -0.3, y: 0.175 },
      };

      symbolSet.scale = ["-", "-", ">", ".", 2, 1, 0.5, 0.25];
  }

  // {% include_relative _topography.js %}
  /**
   * @returns {Array} - row-major order data
   */
  var topography = (function generateValues() {
    var values = [];
    var width = score.width;
    var height = score.width;

    var featureSize = 4;
    var sampleSize = featureSize;

    var scale = 4;

    function frand() {
      return Math.random() * 2 - 1;
    }

    for (var y = 0; y < height; y += featureSize) {
      for (var x = 0; x < width; x += featureSize) {
        setSample(x, y, frand() * scale);
      }
    }

    function sample(x, y) {
      return values[xyToIndex(x, y)];
    }

    function setSample(x, y, value) {
      values[xyToIndex(x, y)] = value;
    }

    function sampleSquare(x, y, size, value) {
      var half = size / 2;

      var a = sample(x - half, y - half);
      var b = sample(x + half, y - half);
      var c = sample(x - half, y + half);
      var d = sample(x + half, y + half);

      setSample(x, y, (a + b + c + d) / 4.0 + value);
    }

    function sampleDiamond(x, y, size, value) {
      var half = size / 2;

      var a = sample(x - half, y);
      var b = sample(x + half, y);
      var c = sample(x, y - half);
      var d = sample(x, y + half);

      setSample(x, y, (a + b + c + d) / 4.0 + value);
    }

    function diamondSquare(stepSize, scale) {
      var x, y;
      var halfStep = stepSize / 2;

      for (y = halfStep; y < height + halfStep; y += stepSize) {
        for (x = halfStep; x < width + halfStep; x += stepSize) {
          sampleSquare(x, y, stepSize, frand() * scale);
        }
      }

      for (y = 0; y < height; y += stepSize) {
        for (x = 0; x < width; x += stepSize) {
          sampleDiamond(x + halfStep, y, stepSize, frand() * scale);
          sampleDiamond(x, y + halfStep, stepSize, frand() * scale);
        }
      }
    }

    while (sampleSize > 1) {
      diamondSquare(sampleSize, scale);
      sampleSize /= 2;
      scale /= 2.0;
    }

    return values;
  })();

  // {% include_relative _walk-events.js %}
  /**
   * Reveal a starting point, chosen from an extreme high or low
   */
  function getScoreRange(data) {
    return {
      min: Math.min.apply(null, data),
      max: Math.max.apply(null, data),
    };
  }
  var startingIndex = (function () {
    var range = getScoreRange(topography);

    var extremaIndices = topography
      .map(function (d, i) {
        return {
          height: d,
          index: i,
        };
      })
      .filter(function (d) {
        return d.height === range.min || d.height === range.max;
      });

    return VS.getItem(extremaIndices).index;
  })();

  function createEmptyFrame(duration) {
    return {
      walkerIndex: startingIndex,
      direction: "",
      duration: duration,
      topography: topography.map(function (d) {
        return {
          height: d,
          revealed: 0,
          explored: false,
        };
      }),
    };
  }

  var firstFrame = createEmptyFrame(0);

  var walkEvents = [].concat(firstFrame, walkFrames(), createEmptyFrame(6000));

  function walkFrames() {
    var frames = [];

    for (var i = 0, lastFrame; i < nEvents; i++) {
      lastFrame = i > 0 ? frames[i - 1] : firstFrame;
      frames.push(createNewFrame(lastFrame));
    }

    return frames;
  }

  function numberIsInBounds(n) {
    return n > 0 && n < score.width;
  }
  function pointIsInBounds(point) {
    return numberIsInBounds(point.x) && numberIsInBounds(point.y);
  }

  // With 100 events, will be between 90-120s total duration
  function randDuration() {
    return VS.getRandIntIncl(900, 1200);
  }

  function createNewFrame(lastFrame) {
    var lastPoint = indexToPoint(lastFrame.walkerIndex);

    var adjacentChoices = [
      "north",
      "south",
      "east",
      "west",
      "northWest",
      "southEast",
    ]
      .map(function (dir) {
        return {
          direction: dir,
          point: directions[dir](lastPoint),
        };
      })
      .filter(function (d) {
        return pointIsInBounds(d.point);
      })
      .map(function (d) {
        return {
          direction: d.direction,
          index: pointToIndex(d.point),
        };
      });

    function revealAdjacentChoices(index, frame) {
      adjacentChoices
        .map(function (d) {
          return d.index;
        })
        .filter(function () {
          return Math.random() < 0.2;
        })
        .forEach(function (index) {
          frame.topography[index].revealed += nearbyRevealFactor;
        });

      return frame;
    }

    function createNewFrame(tuple) {
      var newFrame = {
        topography: lastFrame.topography.map(function (d) {
          // copy
          return {
            height: d.height,
            // decrement reveal, if not 0
            revealed: d.revealed ? d.revealed - 1 : 0,
            explored: d.explored,
          };
        }),
      };
      newFrame.duration = randDuration();
      newFrame.walkerIndex = tuple.index;
      newFrame.direction = tuple.direction;
      newFrame.topography[tuple.index].explored = true;
      newFrame.topography[tuple.index].revealed = revealFactor;
      newFrame = revealAdjacentChoices(tuple.index, newFrame);
      return newFrame;
    }

    /**
     * Same direction
     */
    var sameDirIndices = adjacentChoices
      .filter(function (d) {
        return d.direction === lastFrame.direction;
      })
      .map(function (d) {
        return {
          direction: "",
          index: d.index,
        };
      });

    if (sameDirIndices.length) {
      return createNewFrame(sameDirIndices[0]);
    }

    /**
     * Unexplored
     */
    var unexploredIndices = adjacentChoices.filter(function (d) {
      return !lastFrame.topography[d.index].explored;
    });

    if (unexploredIndices.length) {
      return createNewFrame(VS.getItem(unexploredIndices));
    }

    /**
     * Explored
     * If all adjacent points are explored, move to the point with the lowest "reveal",
     * aligned with the "try to remember the past" instruction.
     */
    var exploredIndices = adjacentChoices.filter(function (d) {
      return lastFrame.topography[d.index].explored;
    });

    // In theory, this should never be thrown--but may be helpful catching errors in experimentation.
    if (!exploredIndices.length) {
      throw new Error("No available indices of any type");
    }

    function getRevealed(index) {
      return lastFrame.topography[index].revealed;
    }

    var exploredIndexLeastRevealed = []
      .concat(exploredIndices)
      .sort(function (a, b) {
        return getRevealed(a.index) > getRevealed(b.index);
      })[0];

    return createNewFrame(exploredIndexLeastRevealed);
  }

  // {% include_relative _text.js %}
  var text = wrapper
    .append("text")
    .attr("class", "instructions")
    .attr("text-anchor", "middle")
    .attr("y", 220)
    .attr("opacity", 0)
    .text("explore the unknown, try to remember the past");

  function toggleText(duration, toggle) {
    text
      .transition()
      .duration(duration || transitionTime)
      .attr("opacity", toggle ? 1 : 0);
  }

  var makeTextToggler = function (toggle) {
    return function (duration) {
      toggleText(duration, toggle);
    };
  };

  // {% include_relative _render.js %}
  // Initial render
  topo
    .selectAll("text")
    .data(walkEvents[0].topography)
    .enter()
    .append("text")
    .attr("x", function (d, i) {
      var c = indexToPoint(i);
      return (c.x - c.y) * tileWidthHalf;
    })
    .each(function (d, i) {
      var symbolIndex = ~~topography[i] + 4; // NOTE get symbols from topography, not own data
      var symbolKey = getStringByIndex(symbolIndex);
      var offsets = symbolSet.offsets[symbolKey];

      d3.select(this)
        .text(symbolSet.strings[symbolKey])
        .attr("dx", offsets.x + "em")
        .attr("dy", offsets.y + "em");
    })
    .call(update, 0, 0);

  function getStringByIndex(index) {
    if (index > symbolSet.scale.length - 1) {
      return "max";
    } else if (index < 0) {
      return "min";
    } else {
      return symbolSet.scale[index];
    }
  }

  // {% include_relative _display.js %}
  function update(selection, dur, frameIndex) {
    selection
      .data(walkEvents[frameIndex].topography)
      .transition()
      .duration(dur)
      .attr("y", function (d, i) {
        var c = indexToPoint(i);
        var hScale = d.revealed ? heightScale.revealed : heightScale.hidden;

        var scaledHeight = d.height * hScale;

        return (c.x + c.y) * tileHeightHalf - scaledHeight;
      })
      .style("opacity", function (d) {
        return d.revealed / revealFactor;
      });
  }

  function updateSymbols(dur, index) {
    topo.selectAll("text").call(update, dur, index);
  }

  // {% include_relative _score.js %}
  /**
   * Populate score
   */
  VS.score.preroll = transitionTime;

  /**
   * Fade text in and out
   */
  var textEventList = [
    {
      duration: 0,
      action: makeTextToggler(false),
    },
    {
      duration: 3600,
      action: makeTextToggler(true),
    },
    {
      duration: 3600,
      action: makeTextToggler(false),
    },
  ];

  var walkEventList = walkEvents.map(function (frame, frameIndex) {
    return {
      duration: frame.duration,
      action: updateSymbols,
      parameters: [600, frameIndex],
    };
  });

  var finalEventList = [
    {
      duration: 0,
      action: function () {},
    },
  ];

  var eventList = []
    .concat(textEventList, walkEventList, finalEventList)
    .map(function (bar, i, list) {
      bar.time = list.slice(0, i).reduce(function (sum, bar2) {
        return (sum += bar2.duration);
      }, 0);
      return bar;
    });

  eventList.forEach(function (bar) {
    VS.score.add(bar.time, bar.action, bar.parameters);
  });

  // {% include_relative _controls.js %}
  VS.control.hooks.add("step", function () {
    var pointer = VS.score.getPointer();
    var scoreEvent = eventList[pointer];
    var parameters = [].concat(
      150,
      scoreEvent.parameters && scoreEvent.parameters.slice(1)
    );
    scoreEvent.action.apply(null, parameters);
  });

  VS.control.hooks.add("stop", function () {
    makeTextToggler(false)(150);
    updateSymbols(150, 0);
  });

  // {% include_relative _resize.js %}
  function resize() {
    var main = d3.select("main");

    var w = parseInt(main.style("width"), 10);
    var h = parseInt(main.style("height"), 10);

    var scaleX = VS.clamp(w / layout.width, 0.25, 2);
    var scaleY = VS.clamp(h / layout.height, 0.25, 2);

    layout.scale = Math.min(scaleX, scaleY);

    layout.margin.left = w * 0.5;
    layout.margin.top = h * 0.5 - layout.height * 0.25 * layout.scale;

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

  d3.select(window).on("resize", resize);
  d3.select(window).on("load", resize);

}());
