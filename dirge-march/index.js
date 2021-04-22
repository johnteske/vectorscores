(function () {
  'use strict';

  /**
   * TODO Don't remove pitch classes from data when deduplicating,
   * instead hide them during rendering. Keeping the data will allow the
   * better line cloud rendering (also TODO).
   */

  // Musical constants that define the piece
  var config = {
    semitoneTransposition: 2,
    numberOfPercussionParts: 2,
    maxRhythmsPerBar: 2,
  };

  // Display constants
  var layout = {
    container: {
      height: null, // set after render for resizing/scaling
      scale: 1,
    },
    wrapper: {
      y: 105,
    },
    cueIndicator: {
      y: 15,
    },
    pitched: {
      y: 0,
      globjects: {
        height: 127,
      },
    },
    percussion: {
      y: 220,
    },
    scaleTime: function (x) {
      return x * 5.5;
    },
    barPadding: 6,
  };

  var dynamics = VS.dictionary.Bravura.dynamics;

  var rawGlobjects = [
    {
      contour: "descending",
      rangeEnvelope: {
        hi: [
          { value: 3, duration: 2 },
          { value: 3, duration: 2 },
          { value: 2, duration: 5 },
          { value: 0, duration: 0 },
        ],
        lo: [
          { value: 3, duration: 1 },
          { value: 2, duration: 2 },
          { value: 0, duration: 2 },
          { value: -2, duration: 4 },
          { value: 0, duration: 0 },
        ],
      },
    },
    {
      contour: "descending",
      rangeEnvelope: {
        hi: [
          { value: 3, duration: 2 },
          { value: 4, duration: 6 },
          { value: 3, duration: 4 },
          { value: 0, duration: 0 },
        ],
        lo: [
          { value: 3, duration: 1 },
          { value: 3, duration: 5 },
          { value: -2, duration: 6 },
          { value: 0, duration: 0 },
        ],
      },
    },
    {
      contour: "ascending",
      rangeEnvelope: {
        hi: [
          { value: -5, duration: 1 },
          { value: -2, duration: 1 },
          { value: 0, duration: 5 },
          { value: 3, duration: 4 },
          { value: 0, duration: 0 },
        ],
        lo: [
          { value: -5, duration: 5 },
          { value: -2, duration: 6 },
          { value: 0, duration: 0 },
        ],
      },
    },
    {
      contour: "descending",
      rangeEnvelope: {
        hi: [
          { value: 7, duration: 1 },
          { value: 10, duration: 1 },
          { value: 10, duration: 4 },
          { value: 7, duration: 4 },
          { value: 7, duration: 4 },
          { value: 0, duration: 0 },
        ],
        lo: [
          { value: 7, duration: 4 },
          { value: 5, duration: 4 },
          { value: 3, duration: 4 },
          { value: 0, duration: 2 },
          { value: 0, duration: 0 },
        ],
      },
    },
    {
      contour: "descending",
      rangeEnvelope: {
        hi: [
          { value: 3, duration: 2 },
          { value: 7, duration: 1 },
          { value: 7, duration: 3 },
          { value: 3, duration: 4 },
          { value: 3, duration: 4 },
          { value: 0, duration: 0 },
        ],
        lo: [
          { value: 3, duration: 5 },
          { value: 3, duration: 3 },
          { value: -2, duration: 6 },
          { value: 0, duration: 0 },
        ],
      },
    },
  ];

  // {% include_relative _generate-globjects.js %}
  function generateGlobjects(rawGlobjects) {
    return rawGlobjects.map(function (rawGlobject) {
      var globject = {
        contour: rawGlobject.contour,
        rangeEnvelope: rawGlobject.rangeEnvelope,
      };

      var highs = globject.rangeEnvelope.hi;
      var lows = globject.rangeEnvelope.lo;

      // NOTE highs and lows totalDurations should match
      var totalDuration = highs.reduce(function (sum, point) {
        return sum + point.duration;
      }, 0);

      /**
       * Normalize range values
       */
      var extent = d3.extent(highs.concat(lows), function (d) {
        return d.value;
      });

      function mapRangeEnvelope(envelope) {
        var currentTime = 0;

        return envelope.map(function (point) {
          point.value = VS.normalize(point.value, extent[0], extent[1]);
          point.time = currentTime;
          currentTime += point.duration / totalDuration;
          return point;
        });
      }

      highs = mapRangeEnvelope(highs);
      lows = mapRangeEnvelope(lows);

      globject.rangeEnvelope.type = "normalized";

      /**
       * Remove duplicate points for smooth globject curve
       * In this case, both the hi and lo ranges match on start and end
       */
      globject.rangeEnvelope.lo = globject.rangeEnvelope.lo.slice(1, -1);

      return globject;
    });
  }

  function generateRetrogradeGlobjects(generatedGlobjects) {
    return generatedGlobjects.map(function (globject) {
      function mapRetrogradeTime(point) {
        var mapped = {
          value: point.value,
          time: 1 - point.time,
        };
        return mapped;
      }

      var retrograde = {};

      retrograde.rangeEnvelope = {
        type: globject.rangeEnvelope.type,
        hi: [].concat(globject.rangeEnvelope.hi).map(mapRetrogradeTime),
        lo: [].concat(globject.rangeEnvelope.lo).map(mapRetrogradeTime),
      };

      return retrograde;
    });
  }

  var globjects = generateGlobjects(rawGlobjects);
  var retrogradeGlobjects = generateRetrogradeGlobjects(globjects);

  // {% include_relative _rhythms.js %}
  var rhythms = (function () {
    function flattenWithCommasBetween(array) {
      return array
        .reduce(function (a, b) {
          return a.concat(b, [","]);
        }, [])
        .slice(0, -1);
    }

    return {
      strings: [
        // 2/4
        "1, ,1,-,-0.5",
        "1,-,-0.5, ,1",
        "1, ,1,-,-0.5,trip,-,-0.5",
        "1,-,-0.5,trip,-,-0.5, ,1",
        "1,=,=0.25,=,=0.25,=,=0.25, ,1",
        // 4/4
        "1, ,1, ,r0.5, ,0.5, ,1,-,-0.5",
        "1,-,-0.5, ,1, ,r0.5, ,0.5, ,1",
        "1, ,1, ,r0.5., ,0.25,1.,-,=0.25",
        "1, ,1,-,-0.5, ,1,=,=0.25,=,=0.25,=,=0.25, ,1,-,-0.5",
        "1, ,1.,-,=0.25, ,1,-,-0.5,trip,-,-0.5, ,1.,-,=0.25",
        "1,-,-0.5, ,1,-,-0.5,=,=0.25, ,1,=,=0.25,-,-0.5, ,1,-,-0.5",
      ],
      // Bravura: beamed groups of notes (U+E220–U+E23F), only long stem glyphs selected
      // TODO standardize and integrate in Bravura dictionary
      stringToBravuraMap: {
        " ": " ",
        ".": "\ue1e7", // dot
        "-": "\ue1f8", // beam, single
        "=": "\ue1fa", // beam, double
        0.25: "\ue1d9", // sixteenth, with flag
        "=0.25": "\ue1f5", // sixteenth, leading beam
        0.5: "\ue1d7", // eighth, with flag
        "-0.5": "\ue1f3", // eighth, leading beam
        1: "\ue1f1", // quarter
        "1.": "\ue1f1\u2002\ue1e7", // dotted quarter (en space)
        // "[": "\ue201",
        trip: "\ue202",
        // "]": "\ue203"
        "r0.5": "\ue4e6",
        "r0.5.": "\ue4e6\ue1e7",
      },
      // Display as unordered set, with brackets and comma-separated
      getTextFragmentsFromIndices: function (indices) {
        var rhythmStringFragments = indices.map(function (index) {
          return rhythms.strings[index].split(",");
        });

        return [].concat(
          "{",
          flattenWithCommasBetween(rhythmStringFragments),
          "}"
        );
      },
    };
  })();

  // Wrap in IIFE to aid in linting
  var rawScore = (function () {
    var raw = [
      {
        time: 0,
        pitched: {
          duration: 46.667,
          globjectContour: "descending",
          pitch: [
            { time: 0, classes: [0] },
            { time: 1, classes: [0, 3] },
          ],
          range: {
            high: 96,
            low: 32,
          },
          phraseType: null,
          dynamics: [
            { time: 0, value: "pp" },
            { time: 0.25, value: "<" },
            { time: 0.5, value: "p" },
            { time: 0.75, value: ">" },
            { time: 1, value: "pp" },
          ],
        },
        percussion: {
          tempo: null,
        },
      },
      {
        time: 16,
        percussion: {
          tempo: 60,
          duration: 32,
          rhythmRange: [0, 1],
          dynamics: [
            { time: 0, value: "n" },
            { time: 0.5, value: "<" },
            { time: 1, value: "ppp" },
          ],
        },
      },
      {
        time: 46.667,
        pitched: {
          duration: 46.667,
          globjectContour: "descending",
          pitch: [
            {
              time: 0,
              classes: [0, 3],
            },
            {
              time: 1,
              classes: [0, 3, 7],
            },
          ],
          range: {
            high: 96,
            low: 0,
          },
          phraseType: null,
          dynamics: [
            { time: 0, value: "p" },
            { time: 0.25, value: "<" },
            { time: 0.5, value: "mp" },
            { time: 0.75, value: ">" },
            { time: 1, value: "p" },
          ],
        },
        percussion: {
          tempo: null,
        },
      },
      {
        time: 48,
        percussion: {
          tempo: 60,
          duration: 32,
          rhythmRange: [0, 3],
          dynamics: [
            { time: 0, value: "ppp" },
            { time: 0.5, value: "<" },
            { time: 1, value: "p" },
          ],
        },
      },
      {
        time: 80,
        percussion: {
          tempo: 60,
          duration: 32,
          rhythmRange: [0, 4],
          dynamics: [
            { time: 0, value: "p" },
            { time: 0.5, value: "<" },
            { time: 1, value: "mf" },
          ],
        },
      },
      {
        time: 93.333,
        pitched: {
          duration: 46.667,
          globjectContour: "descending",
          pitch: [{ time: 0, classes: [0, 3, 7] }],
          range: {
            high: 64,
            low: 0,
          },
          phraseType: "descending",
          dynamics: [
            { time: 0, value: "mp" },
            { time: 0.25, value: "<" },
            { time: 0.5, value: "mf" },
            { time: 0.75, value: ">" },
            { time: 1, value: "pp" },
          ],
        },
        percussion: {
          tempo: null,
        },
      },
      {
        time: 112,
        percussion: {
          tempo: null,
        },
      },
      {
        time: 144,
        pitched: {
          duration: 3,
          globjectContour: "rest",
          pitch: [],
          phraseType: "rest",
          dynamics: [],
        },
        percussion: {
          tempo: null,
        },
      },
      {
        time: 147,
        pitched: {
          duration: 96,
          globjectContour: "ascending",
          pitch: [
            { time: 0, classes: [5] },
            { time: 0.5, classes: [5, 9] },
            { time: 1, classes: [5, 9, 0] },
          ],
          range: {
            high: 127,
            low: 64,
          },
          phraseType: "ascending",
          dynamics: [
            { time: 0, value: "n" },
            { time: 0.25, value: "<" },
            { time: 0.5, value: "p" },
            { time: 0.75, value: ">" },
            { time: 1, value: "n" },
          ],
        },
        percussion: {
          tempo: null,
        },
      },
      {
        time: 211,
        percussion: {
          tempo: 120,
          duration: 32,
          rhythmRange: [5, 8],
          dynamics: [
            { time: 0, value: "mf" },
            { time: 0.5, value: "<" },
            { time: 1, value: "f" },
          ],
        },
      },
      {
        time: 243,
        pitched: {
          duration: 24,
          globjectContour: "all",
          pitch: [
            { time: 0, classes: [0] },
            { time: 1, classes: [0, 3] },
          ],
          range: {
            low: 32,
            high: 96,
          },
          phraseType: "both",
          dynamics: [
            { time: 0, value: "mf" },
            { time: 0.5, value: ">" },
            { time: 1, value: "p" },
          ],
        },
        percussion: {
          tempo: 120,
          duration: 32,
          rhythmRange: [5, 10],
          dynamics: [
            { time: 0, value: "f" },
            { time: 0.25, value: "<" },
            { time: 0.5, value: "ff" },
            { time: 0.75, value: ">" },
            { time: 1, value: "f" },
          ],
        },
      },
      {
        time: 267,
        pitched: {
          duration: 24,
          globjectContour: "all",
          globjectCount: 2,
          pitch: [
            { time: 0, classes: [0, 3] },
            { time: 1, classes: [0, 3, 7] },
          ],
          range: {
            low: 0,
            high: 127,
          },
          phraseType: "both",
          dynamics: [
            { time: 0, value: "f" },
            { time: 0.5, value: ">" },
            { time: 1, value: "mp" },
          ],
        },
        percussion: {
          tempo: null,
        },
      },
      {
        time: 275,
        percussion: {
          tempo: 120,
          duration: 32,
          rhythmRange: [0, 10],
          dynamics: [
            { time: 0, value: "f" },
            { time: 0.5, value: ">" },
            { time: 1, value: "mf" },
          ],
        },
      },
      {
        time: 291,
        pitched: {
          duration: 24,
          globjectContour: "all",
          globjectCount: 3,
          pitch: [
            { time: 0, classes: [0, 3] },
            { time: 1, classes: [0, 3, 7] },
          ],
          range: {
            low: 0,
            high: 127,
          },
          phraseType: "both",
          dynamics: [
            { time: 0, value: "f" },
            { time: 0.5, value: ">" },
            { time: 1, value: "mp" },
          ],
        },
        percussion: {
          tempo: null,
        },
      },
      {
        time: 307,
        percussion: {
          tempo: null,
        },
      },
      {
        time: 315,
        pitched: {
          duration: 24,
          globjectContour: "all",
          pitch: [{ time: 0, classes: [0, 3, 7] }],
          range: {
            low: 32,
            high: 96,
          },
          phraseType: "both",
          dynamics: [
            { time: 0, value: "mf" },
            { time: 0.5, value: ">" },
            { time: 1, value: "n" },
          ],
        },
        percussion: {
          tempo: null,
        },
      },
      {
        time: 338,
        percussion: {
          tempo: null,
        },
      },
    ];

    return raw.map(function (bar, i) {
      bar.index = i;
      return bar;
    });
  })();

  var barTimes = rawScore.map(function (d) {
    return d.time;
  });

  // {% include_relative _generate-parts.js %};
  function generatePartsFromRawScore(rawScoreData) {
    // Use randomly sorted arrays to select from with Array#pop to avoid duplicate selections
    // https://www.frankmitchell.org/2015/01/fisher-yates/
    function shuffle(array) {
      var i = 0;
      var j = 0;
      var temp = null;

      for (i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }

    function generatePitchedPart() {
      var contours = {
        descending: globjects.filter(function (g) {
          return g.contour === "descending";
        }),
        ascending: globjects.filter(function (g) {
          return g.contour === "ascending";
        }),
        all: [].concat(globjects, retrogradeGlobjects),
      };

      shuffle(contours.descending);
      shuffle(contours.all);

      var pitchedBars = rawScoreData.filter(function (bar) {
        return bar.pitched;
      });

      pitchedBars = pitchedBars.map(function (bar) {
        var globject = [];

        if (bar.pitched.globjectContour !== "rest") {
          for (var i = 0; i < (bar.pitched.globjectCount || 1); i++) {
            globject.push(contours[bar.pitched.globjectContour].pop());
          }
        }

        return {
          index: bar.index,
          time: bar.time,
          duration: bar.pitched.duration,
          dynamics: bar.pitched.dynamics,
          phraseType: bar.pitched.phraseType,
          pitch: bar.pitched.pitch,
          range: bar.pitched.range,
          globjects: globject,
        };
      });

      insertSetTransformations(pitchedBars);
      deduplicateAdjacentSets(pitchedBars);

      return pitchedBars;
    }

    function filterBarsWithSets(bar) {
      return bar.phraseType !== "rest";
    }

    function insertSetTransformations(bars) {
      var barsWithSets = bars.filter(filterBarsWithSets);

      function getMidPoint(current, next) {
        return (next - current) * 0.5 + current;
      }

      for (var i = 0; i < barsWithSets.length; i++) {
        var pitch = barsWithSets[i].pitch;
        var newPitch = [];

        pitch.forEach(function (current, index, array) {
          var next = array[index + 1];

          newPitch.push(current);

          if (array.length !== index + 1) {
            newPitch.push({
              time: getMidPoint(current.time, next.time),
              classes: [],
              type: "transform",
            });
          }
        });

        barsWithSets[i].pitch = newPitch;
      }
    }

    function deduplicateAdjacentSets(bars) {
      var barsWithSets = bars.filter(filterBarsWithSets);

      for (var i = 0; i < barsWithSets.length - 1; i++) {
        var bar = barsWithSets[i];
        var barSet = bar.pitch;
        var lastSet = barSet[barSet.length - 1].classes.join();

        var nextBar = barsWithSets[i + 1];
        var nextSet = nextBar.pitch[0].classes.join();

        // NOTE Simple way to handle floating point addition rounding (.333 vs. .334, etc.)
        var adjacent =
          Math.round(bar.time + bar.duration) === Math.round(nextBar.time);
        if (lastSet === nextSet && adjacent) {
          barSet.pop();
        }
      }
    }

    function generatePercussionPart() {
      var percussionBars = rawScoreData.filter(function (bar) {
        return bar.percussion.tempo !== null;
      });

      percussionBars = percussionBars.map(function (bar) {
        bar.percussion.rhythmIndices = [];

        for (var i = 0; i < config.numberOfPercussionParts; i++) {
          bar.percussion.rhythmIndices.push(
            getRhythmIndices(bar.percussion.rhythmRange)
          );
        }

        return bar;
      });

      deduplicateAdjacentDynamics(percussionBars);

      return percussionBars;
    }

    function getRhythmIndices(extent) {
      var availableIndices = [];

      for (var i = extent[0]; i <= extent[1]; i++) {
        availableIndices.push(i);
      }

      shuffle(availableIndices);

      var selectedIndices = [];
      var rhythmsPerBar = Math.min(
        availableIndices.length,
        config.maxRhythmsPerBar
      );

      for (var j = 0; j < rhythmsPerBar; j++) {
        selectedIndices.push(availableIndices.pop());
      }

      return selectedIndices;
    }

    function deduplicateAdjacentDynamics(bars) {
      for (var i = 0; i < bars.length - 1; i++) {
        var bar = bars[i];
        var barDynamics = bar.percussion.dynamics;
        var lastDynamic = barDynamics[barDynamics.length - 1].value;

        var nextBar = bars[i + 1];
        var nextDynamic = nextBar.percussion.dynamics[0].value;

        if (
          lastDynamic === nextDynamic &&
          bar.time + bar.percussion.duration === nextBar.time
        ) {
          bar.percussion.dynamics.pop();
        }
      }
    }

    return {
      pitched: generatePitchedPart(),
      percussion: generatePercussionPart(),
    };
  }

  var parts = generatePartsFromRawScore(rawScore);

  // {% include_relative _draw-crescendos.js %}
  function drawCrescendos(selection, width) {
    var linePadding = 10;
    var y = 20;
    var height = 10;
    var halfHeight = height * 0.5;
    var lineWidthThreshold = 120;

    var line = d3
      .line()
      .x(function (d) {
        return d[0];
      })
      .y(function (d) {
        return d[1];
      });

    selection
      .filter(function (d) {
        return d.x2 - d.x1 < lineWidthThreshold;
      })
      .append("path")
      .attr("transform", "translate(0," + y + ")")
      .attr("d", function (d) {
        var x1 = d.x1 === 0 ? d.x1 : d.x1 + linePadding;
        var x2 = d.x2 === width ? d.x2 : d.x2 - linePadding;
        var hairpinStart;
        var hairpinEnd;

        if (d.value === "<") {
          hairpinStart = x1;
          hairpinEnd = x2;
        } else {
          hairpinStart = x2;
          hairpinEnd = x1;
        }

        var points = [
          [hairpinEnd, halfHeight],
          [hairpinStart, 0],
          [hairpinEnd, -halfHeight],
        ];

        return line(points);
      })
      .attr("stroke", "#222222")
      .attr("fill", "none");

    selection
      .filter(function (d) {
        return d.x2 - d.x1 > lineWidthThreshold;
      })
      .append("text")
      // .attr('class', 'dynamic text')
      .attr("x", function (d) {
        return layout.scaleTime(d.time * d.duration);
      })
      .attr("y", y)
      .attr("dy", "0.3em")
      .text(function (d) {
        if (d.value === "<") {
          return "cres.";
        } else {
          return "dim.";
        }
      })
      .attr("text-anchor", "middle")
      .style("font-family", "serif")
      .style("font-size", 15)
      .style("font-style", "italic");
  }

  // {% include_relative _pitched-part.js %}
  var globjectHeight = 42;

  var pitchedPart = (function () {
    var part = {};

    var bars;

    part.init = function (parent) {
      bars = parent
        .selectAll("g")
        .data(parts.pitched)
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
          return "translate(" + getXByScoreIndex(d.index) + "," + 0 + ")";
        });

      createFillPattern();
      createArrowMarker();
    };

    part.draw = function () {
      drawGlobjects();
      drawPitchClasses();
      drawDynamics();
      drawRests();
    };

    var staticGlobject = VS.globject()
      .width(function (d) {
        return layout.scaleTime(d.duration);
      })
      .height(globjectHeight)
      .curve(d3.curveCardinalClosed.tension(0.3));

    function drawGlobjects() {
      bars
        .selectAll(".globject")
        .data(function (d) {
          return d.globjects.map(function (globject) {
            return {
              duration: d.duration,
              totalGlobjects: d.globjects.length,
              pitch: d.pitch,
              range: d.range,
              phraseType: d.phraseType,
              rangeEnvelope: globject.rangeEnvelope,
            };
          });
        })
        .enter()
        .append("g")
        .attr("class", "globject")
        .attr("transform", function (d, i) {
          var y = VS.getRandIntIncl(d.range.low + globjectHeight, d.range.high);

          // TODO this is an easy way to space out the globjects--
          // replace with a real bin-packing algorithm so globjects can fit closely together
          if (d.totalGlobjects > 1) {
            y = (layout.pitched.globjects.height / d.totalGlobjects) * (i + 1);
          }

          return "translate(0," + (layout.pitched.globjects.height - y) + ")";
        })
        .each(staticGlobject)
        .each(fillGlobject);
    }

    function drawPitchClasses() {
      bars.each(drawPitchClassLayer);
    }

    function drawDynamics() {
      bars.each(function (data) {
        var selection = d3.select(this);
        var width = layout.scaleTime(data.duration);

        var dynamicsData = data.dynamics.map(function (dynamic) {
          dynamic.duration = data.duration;
          return dynamic;
        });

        var dynamicsGroup = selection
          .append("g")
          .attr("class", "dynamics")
          .attr(
            "transform",
            "translate(0," + layout.pitched.globjects.height + ")"
          )
          .selectAll(".dynamic")
          .data(dynamicsData)
          .enter();

        dynamicsGroup.filter(includeCrescendos(false)).call(appendDynamics);

        calculateJoiningSymbolPoints(
          dynamicsGroup.selectAll("text"),
          width,
          dynamicsData,
          includeCrescendos(true)
        );

        dynamicsGroup.filter(includeCrescendos(true)).call(drawCrescendos, width);

        function includeCrescendos(include) {
          return function (d) {
            return include === ("<>".indexOf(d.value) !== -1);
          };
        }
      });
    }

    function drawRests() {
      var rest = bars
        .filter(function (d) {
          return d.phraseType === "rest";
        })
        .append("text")
        .attr("class", "rest")
        .attr("y", layout.pitched.globjects.height * 0.5);

      // Half rest
      rest.append("tspan").text("\ue4f5");

      // Dot
      rest.append("tspan").text("\ue1fc").attr("dx", "0.25em");
    }

    return part;
  })();

  // {% include_relative _percussion-part.js %}
  var percussionPart = (function () {
    var part = {};

    var bars;

    var numberOfParts = config.numberOfPercussionParts;

    var rhythmLayout = {
      padding: 6,
      height: 24,
    };

    rhythmLayout.boxHeight =
      rhythmLayout.height * numberOfParts +
      rhythmLayout.padding * (numberOfParts + 1);

    part.init = function (parent) {
      bars = parent
        .selectAll("g")
        .data(parts.percussion)
        .enter()
        .append("g")
        .attr("transform", function (d) {
          return "translate(" + getXByScoreIndex(d.index) + "," + 0 + ")";
        });
    };

    part.draw = function () {
      drawTempi();
      drawBars();
    };

    function drawTempi() {
      var text = bars
        .append("text")
        .attr("class", "tempo-text")
        .attr("dy", "-0.5em");

      text.append("tspan").text(rhythms.stringToBravuraMap["1"]);

      text
        .append("tspan")
        .text(" = ")
        .style("letter-spacing", "-0.125em")
        .attr("class", "bpm");

      text
        .append("tspan")
        .text(function (d) {
          return d.percussion.tempo;
        })
        .attr("class", "bpm");
    }

    function drawBars() {
      drawBoundingRect();
      drawRhythms();
      setBoundingRectWidth();
      drawDurationLine();
      drawDynamics();
    }

    function drawBoundingRect() {
      bars
        .append("rect")
        .attr("height", rhythmLayout.boxHeight)
        .attr("stroke", "black")
        .attr("fill", "white");
    }

    function drawRhythms() {
      var rhythms = bars
        .selectAll(".rhythm")
        .data(function (d) {
          return d.percussion.rhythmIndices;
        })
        .enter()
        .append("text")
        .attr("class", "rhythm")
        .attr("y", function (d, i) {
          return i * (rhythmLayout.height + rhythmLayout.padding);
        })
        .attr("dy", 16 + rhythmLayout.padding)
        .attr("dx", rhythmLayout.padding);

      rhythms.call(appendTspans);
    }

    function appendTspans(selection) {
      var tspans = selection
        .selectAll("tspan")
        .data(rhythms.getTextFragmentsFromIndices)
        .enter()
        .append("tspan");

      // Unordered set characters
      tspans
        .filter(function (d) {
          return isSetCharacter(d);
        })
        .text(function (d) {
          return d;
        })
        .style("font-family", "monospace")
        .style("font-size", 18);

      // Rhythms
      tspans
        .filter(function (d) {
          return !isSetCharacter(d);
        })
        .text(function (d) {
          return rhythms.stringToBravuraMap[d];
        })
        .style("font-family", "Bravura")
        .style("font-size", 12)
        .style("baseline-shift", function (d) {
          var dy = d === "r0.5" || d === "r0.5." ? 0.4 : 0;
          return dy + "em";
        })
        .style("letter-spacing", function (d) {
          var spacing = 0;

          if (d === "trip") {
            spacing = -6;
          } else if (d === "1.") {
            spacing = -5;
          }

          return spacing;
        });

      function isSetCharacter(string) {
        return "{,}".indexOf(string) !== -1;
      }
    }

    function setBoundingRectWidth() {
      bars.each(function (d) {
        var groupWidth = d3.select(this).node().getBBox().width;
        d.width = groupWidth + rhythmLayout.padding;
      });

      bars.selectAll("rect").attr("width", function (d) {
        return d.width;
      });
    }

    function drawDurationLine() {
      var y = rhythmLayout.boxHeight * 0.5;

      bars
        .append("line")
        .attr("x1", function (d) {
          return d.width;
        })
        .attr("x2", function (d) {
          var nextBarTime = d.time + d.percussion.duration;
          var nextBarIndex = barTimes.indexOf(nextBarTime);
          return getXByScoreIndex(nextBarIndex) - getXByScoreIndex(d.index);
        })
        .attr("y1", y)
        .attr("y2", y)
        .attr("stroke", "black")
        .attr("stroke-width", 3);
    }

    function drawDynamics() {
      bars.each(function (data) {
        // TODO unlike the pitched part, `data` is not the percussion object, it is the full bar?
        data = data.percussion;

        var selection = d3.select(this);
        var width = layout.scaleTime(data.duration);
        var dynamicsData = data.dynamics.map(function (dynamic) {
          dynamic.duration = data.duration;
          return dynamic;
        });

        var dynamicsGroup = selection
          .append("g")
          .attr("class", "dynamics")
          .attr("transform", "translate(0," + rhythmLayout.boxHeight + ")")
          .selectAll(".dynamic")
          .data(dynamicsData)
          .enter();

        dynamicsGroup.filter(includeCrescendos(false)).call(appendDynamics);

        calculateJoiningSymbolPoints(
          dynamicsGroup.selectAll("text"),
          width,
          dynamicsData,
          includeCrescendos(true)
        );

        dynamicsGroup.filter(includeCrescendos(true)).call(drawCrescendos, width);

        function includeCrescendos(include) {
          return function (d) {
            return include === ("<>".indexOf(d.value) !== -1);
          };
        }
      });
    }

    return part;
  })();

  // {% include_relative _options.js %}
  VS.scoreOptions.add(
    "pitchClasses",
    { "pitch-classes": "numbers", prefer: "te" },
    new VS.PitchClassSettings()
  );
  VS.scoreOptions.add("transposition", 0, new VS.NumberSetting("transposition"));

  var scoreOptions = VS.scoreOptions.setFromQueryString();

  // TODO working with old property names in score, for now
  scoreOptions.pitchClasses.display = scoreOptions.pitchClasses["pitch-classes"];
  scoreOptions.pitchClasses.preference = scoreOptions.pitchClasses["prefer"];

  // TODO should coerce internally
  scoreOptions.transposition = +scoreOptions.transposition;

  config.semitoneTransposition += scoreOptions.transposition;

  // {% include_relative _cue.js %}
  /**
   * Score pointer/cue aid
   */
  var cueIndicator = {};

  // TODO will this be needed in the score info?
  function makeCueTriangle(selection) {
    selection
      .attr("class", "indicator")
      .attr("d", "M-6.928,0 L0,2 6.928,0 0,12 Z")
      .style("stroke", "black")
      .style("stroke-width", "1")
      .style("fill", "black")
      .style("fill-opacity", "0");
  }

  var cueTriangle;
  var blink;

  cueIndicator.initAndRender = function () {
    cueTriangle = container.append("path").call(makeCueTriangle);

    // this.positionToCenter();

    blink = VS.cueBlink(cueTriangle)
      .beats(3)
      .inactive(function (selection) {
        selection.style("fill-opacity", 0);
      })
      .on(function (selection) {
        selection.style("fill-opacity", 1);
      })
      .off(function (selection) {
        selection.style("fill-opacity", 0);
      })
      .down(function (selection) {
        selection.style("fill-opacity", 1);
      });
  };

  cueIndicator.positionToCenter = function () {
    cueTriangle.attr(
      "transform",
      "translate(" + viewCenter + "," + layout.cueIndicator.y + ")"
    );
  };

  cueIndicator.blink = function () {
    blink.start();
  };

  cueIndicator.cancel = function () {
    blink.cancel();
  };

  VS.score.preroll = 3000;

  function prerollAnimateCue() {
    VS.score.schedule(VS.score.preroll - 3000, cueIndicator.blink);
  }

  var svg = d3.select("svg");
  svg.append("defs");

  // Static group, for resizing/scaling calculations
  var container = svg.append("g");

  var wrapper = container.append("g").attr("class", "wrapper");

  function textAnchor(t) {
    var a = "middle";

    if (t === 0) {
      a = "start";
    } else if (t === 1) {
      a = "end";
    }

    return a;
  }

  // TODO add vinculum U+0305 to .333 and .666 bar times
  // -- or add tpans with optional .style('text-decoration', 'overline')
  function renderLayout() {
    var barLineGroup = wrapper.append("g").attr("class", "bar-lines");

    var barLineEnter = barLineGroup.selectAll("null").data(barTimes).enter();

    barLineEnter
      .append("text")
      .style("font-family", "serif")
      .style("font-style", "italic")
      .attr("dy", "-3em")
      .attr("x", function (d, i) {
        return getXByScoreIndex(i);
      })
      .text(function (d) {
        return d + "\u2033";
      });

    function drawBarLine(selection, y1, y2) {
      selection
        .append("line")
        .attr("x1", function (d, i) {
          return getXByScoreIndex(i);
        })
        .attr("x2", function (d, i) {
          return getXByScoreIndex(i);
        })
        .attr("y1", y1)
        .attr("y2", y2)
        .attr("stroke", "black")
        .attr("stroke-opacity", 0.25);
    }

    barLineEnter.call(drawBarLine, 0, layout.pitched.globjects.height);
    barLineEnter.call(
      drawBarLine,
      layout.percussion.y,
      layout.percussion.y + (config.numberOfPercussionParts * 32 + 2)
    ); // Add 2 for box border
  }

  /**
   *
   */
  // {% include_relative _fill-globject.js %}
  function createFillPattern() {
    var pattern = svg
      .select("defs")
      .append("pattern")
      .attr("id", "ascending-fill")
      .attr("width", 2)
      .attr("height", 2)
      .attr("patternUnits", "userSpaceOnUse");

    pattern.append("circle").attr("fill", "#eee").attr("r", 1);
  }

  var fillGlobject = (function () {
    function fillGlobject(d) {
      var bar = d;
      var phraseType = bar.phraseType;
      var duration = bar.duration;
      var width = layout.scaleTime(duration);

      var content = d3.select(this).select(".globject-content");

      content
        .append("rect")
        .attr("width", width)
        .attr("height", globjectHeight + 10)
        .attr("fill", "white");

      if (phraseType === "ascending") {
        content
          .append("rect")
          .attr("width", width)
          .attr("height", globjectHeight + 10)
          .attr("fill", "url(#ascending-fill)");
      }

      var lineCloud = VS.lineCloud()
        .duration(duration)
        // TODO shape over time for each PC set, not by a single set
        .phrase(makePhrase(phraseType, bar.pitch[0].classes))
        // .phrase(makePhrase(phraseType, bar.pitch[bar.pitch.length - 1].classes))
        .transposition("octave")
        .curve(d3.curveCardinal)
        .width(width)
        // NOTE this is not the height if the globject, it is the height of the fill,
        // for accurate pitch representations
        .height(layout.pitched.globjects.height);

      content.call(lineCloud, { n: Math.floor(duration) });

      content
        .selectAll(".line-cloud-path")
        .attr("stroke", "grey")
        .attr("stroke-dasharray", phraseType === "ascending" ? "1" : "none")
        .attr("fill", "none");
    }

    function makePhrase(type, set) {
      function coin(prob) {
        return Math.random() < (prob || 0.5);
      }

      return function () {
        var notes = [],
          pc1,
          pc2;

        if (!type) {
          pc1 = VS.getItem(set) + config.semitoneTransposition;
          notes.push({ pitch: pc1, duration: VS.getRandExcl(8, 12) });
          notes.push({ pitch: pc1, duration: 0 });
        } else if (type === "descending" || type === "ascending") {
          pc1 = VS.getItem(set) + config.semitoneTransposition;
          pc2 =
            VS.getItem(set) +
            config.semitoneTransposition +
            (type === "descending" ? -12 : 12);
          notes.push({ pitch: pc1, duration: VS.getRandExcl(4, 6) });
          if (coin(0.33)) {
            notes.push({ pitch: pc1, duration: VS.getRandExcl(4, 6) });
          }
          if (coin(0.33)) {
            notes.push({ pitch: pc2, duration: VS.getRandExcl(4, 6) });
          }
          notes.push({ pitch: pc2, duration: 0 });
        } else if (type === "both") {
          notes.push({
            pitch: VS.getItem(set) + config.semitoneTransposition,
            duration: VS.getRandExcl(4, 6),
          });
          notes.push({
            pitch:
              VS.getItem(set) + config.semitoneTransposition + (coin() ? 12 : 0),
            duration: VS.getRandExcl(4, 6),
          });
          notes.push({
            pitch:
              VS.getItem(set) + config.semitoneTransposition + (coin() ? 12 : 0),
            duration: 0,
          });
        }

        return notes;
      };
    }

    return fillGlobject;
  })();

  // {% include_relative _calculate-joining-symbol-points.js %}
  // TODO this could be split into smaller functions
  // TODO this flow could be written to avoid manipulating the data with the selections
  function calculateJoiningSymbolPoints(selection, width, data, joinFilter) {
    // Save rendered dimensions
    selection.each(function (d) {
      d.BBox = d3.select(this).node().getBBox();
    });

    data.forEach(function (current, index, array) {
      if (!joinFilter(current)) {
        return;
      }

      var previous = array[index - 1];
      var next = array[index + 1];

      if (index - 1 > -1) {
        current.x1 = previous.BBox.x + previous.BBox.width;
      } else {
        current.x1 = 0;
      }

      if (index + 1 < array.length) {
        current.x2 = next.BBox.x;
      } else {
        current.x2 = width;
      }
    });
  }

  // {% include_relative _draw-pitch-class-layer.js %}
  function createArrowMarker() {
    var marker = svg
      .select("defs")
      .append("marker")
      .attr("id", "arrow-marker")
      .attr("markerWidth", "9")
      .attr("markerHeight", "6")
      .attr("refX", "8")
      .attr("refY", "3")
      .attr("orient", "auto")
      .attr("markerUnits", "strokeWidth");

    marker.append("path").attr("d", "M0,0 L9,3 L0,6").attr("fill", "grey");
  }

  var drawPitchClassLayer = (function () {
    var y = "-1.5em";

    function filterSets(isSet) {
      return function (d) {
        return isSet === (d.type !== "transform");
      };
    }

    function drawPitchClassLayer(data) {
      var selection = d3.select(this);
      var width = layout.scaleTime(data.duration);

      var pitchClassGroup = selection
        .append("g")
        .attr("class", "pitch-classes")
        .selectAll(".pitch-class")
        .data(data.pitch)
        .enter();

      pitchClassGroup.filter(filterSets(true)).call(drawPitchClassText, width);

      calculateJoiningSymbolPoints(
        selection.selectAll(".pitch-class"),
        width,
        data.pitch,
        filterSets(false)
      );

      pitchClassGroup.filter(filterSets(false)).call(drawPitchClassLines, width);
    }

    function drawPitchClassText(selection, width) {
      selection
        .append("text")
        .attr("class", "pitch-class")
        .attr("x", function (d) {
          return d.time * width;
        })
        .attr("dy", y)
        .attr("text-anchor", function (d) {
          return textAnchor(d.time);
        })
        .text(function (d) {
          var set = VS.pitchClass
            .transpose(d.classes, config.semitoneTransposition)
            .map(function (pc) {
              return VS.pitchClass.format(
                +pc,
                scoreOptions.pitchClasses.display,
                scoreOptions.pitchClasses.preference
              );
            });

          return "{" + set + "}";
        });
    }

    function drawPitchClassLines(selection, width) {
      var linePadding = 6;

      selection
        .append("line")
        .attr("x1", function (d) {
          return d.x1 === 0 ? d.x1 : d.x1 + linePadding;
        })
        .attr("x2", function (d) {
          return d.x2 === width ? d.x2 : d.x2 - linePadding;
        })
        .attr("y1", y)
        .attr("y2", y)
        .attr("stroke", "grey")
        .attr("stroke-dasharray", "3")
        .attr("marker-end", "url(#arrow-marker)");
    }

    return drawPitchClassLayer;
  })();

  // {% include_relative _append-dynamics.js %}
  function appendDynamics(selection) {
    selection
      .append("text")
      .attr("class", "dynamic")
      .attr("x", function (d) {
        // console.log(d);
        return layout.scaleTime(d.duration * d.time);
      })
      .attr("dy", "1em")
      .attr("text-anchor", function (d) {
        return textAnchor(d.time);
      })
      .text(function (d) {
        return dynamics[d.value];
      });
  }

  function renderPitched() {
    var pitchedGroup = wrapper
      .append("g")
      .attr("class", "pitched-part")
      .attr("transform", "translate(" + 0 + "," + layout.pitched.y + ")");

    pitchedGroup.call(pitchedPart.init);
    pitchedPart.draw();
  }

  function renderPercussion() {
    var percussionGroup = wrapper
      .append("g")
      .attr("class", "percussion-parts")
      .attr("transform", "translate(" + 0 + "," + layout.percussion.y + ")");

    percussionGroup.call(percussionPart.init);
    percussionPart.draw();
  }

  /**
   * Resize
   */
  var viewCenter;
  function resize() {
    var main = d3.select("main");

    // TODO put global width, height in properties so these can be better named
    var w = parseInt(main.style("width"), 10);
    var h = parseInt(main.style("height"), 10);

    // TODO manually added 105 of "bottom padding"
    layout.container.scale = h / (layout.container.height + 15);

    container.attr("transform", "scale(" + layout.container.scale + ")");

    viewCenter = (w / layout.container.scale) * 0.5;

    setScorePosition(true);
    cueIndicator.positionToCenter();
  }

  d3.select(window).on("resize", resize);

  function getXByScoreIndex(i) {
    // Add offset to give rest more space
    var offset = i > 7 ? 18 : 0;

    var padding = i * layout.barPadding;

    return offset + layout.scaleTime(barTimes[i]) + padding;
  }

  function scrollScoreToIndex(index, duration) {
    var x = viewCenter - getXByScoreIndex(index);

    wrapper
      .transition()
      .ease(d3.easeLinear)
      .duration(duration)
      .attr("transform", "translate(" + x + "," + layout.wrapper.y + ")");
  }

  function scrollToNextBar(index, duration) {
    scrollScoreToIndex(index + 1, duration);
  }

  function setScorePosition(setImmediately) {
    if (VS.score.getPointer() > barTimes.length - 1) {
      return;
    }

    var dur = setImmediately ? 0 : 300;
    scrollScoreToIndex(VS.score.getPointer(), dur);
  }

  /**
   * Populate score
   */
  for (var i = 0; i < barTimes.length; i++) {
    var fn = scrollToNextBar;

    if (VS.score.getPointer() > barTimes.length - 1) {
      fn = function () {};
    }

    var duration = (barTimes[i + 1] - barTimes[i]) * 1000;

    VS.score.add(barTimes[i] * 1000, fn, [i, duration]);
  }

  /**
   * Initialize score
   */
  d3.select(window).on("load", function () {
    renderLayout();
    cueIndicator.initAndRender();
    renderPitched();
    renderPercussion();
    layout.container.height = container.node().getBBox().height;
    resize();
  });

  /**
   * Score controls
   */
  VS.control.hooks.add("play", prerollAnimateCue);

  VS.control.hooks.add("stop", setScorePosition);
  VS.control.hooks.add("step", setScorePosition);
  VS.control.hooks.add("pause", setScorePosition);

}());
