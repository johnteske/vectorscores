(function () {
  'use strict';

  /**
   * TODO
   * display pitch and timbre inline--and only if there is a change (or make that optional)
   * bounding boxes for phrases? make optional setting?
   * allow option to show note names? or pitch classes? (provided a pitch center)
   * double bar
   * have scores use parts as data, not simple bar index, then fetching parts
   * disambiguate score (svg, display) vs. score (musical data)--also clean up global vars in _score.js
   */
  var scaleX = 3,
    unitX = 10 * scaleX,
    unitY = 10,
    view = {};

  // {% include_relative _options.js %}
  VS.scoreOptions.add("parts", 4, new VS.NumberSetting("parts"));
  VS.scoreOptions.add("verbose", "off", new VS.CheckboxSetting("verbose"));

  var scoreOptions = VS.scoreOptions.setFromQueryString();
  scoreOptions.parts = VS.clamp(scoreOptions.parts, 1, 16);

  var score = (function () {
    var _score = {};

    _score.totalDuration = 360; // TODO recommend length based on *total* number in ensemble, i.e. 8 parts = 600 seconds
    _score.scale = 1;
    _score.width = _score.totalDuration * unitX; // total score duration
    _score.svg = d3.select(".main").attr("width", _score.width);
    _score.wrapper = _score.svg
      .append("g")
      .attr("transform", "scale(" + _score.scale + "," + _score.scale + ")");
    _score.group = _score.wrapper.append("g");
    _score.layout = {
      group: _score.group.append("g").attr("class", "layout"),
    };
    // to help track overall part height
    _score.partLayersY = {
      timbre: -4.5 * unitY,
      pitch: -2.5 * unitY,
      // if flag without notehead, offset y position
      // TODO do not offset dot? would require a separate text element for the dot
      durations: function (d) {
        return 0 < d && d < 1 ? -0.5 * unitY : 0;
      },
      articulations: 1.25 * unitY,
      dynamics: 3.5 * unitY,
    };
    // calculated from above/rendered
    _score.partHeight = 12 * unitY;

    _score.layoutLayersY = {
      rehearsalLetters: unitY * -2,
      barlines: {
        y1: 3 * unitY,
        y2: scoreOptions.parts * _score.partHeight + 6 * unitY,
      },
      barDurations: unitY,
    };
    _score.height =
      _score.layoutLayersY.rehearsalLetters + _score.layoutLayersY.barlines.y2;
    // offset to start first part
    _score.layoutHeight = 11 * unitY;

    return _score;
  })();

  // symbol dictionary
  var dict = (function () {
    var db = VS.dictionary.Bravura;
    return {
      acc: db.accidentals,
      art: db.articulations,
      dur: db.durations.stemless,
      dyn: db.dynamics,
    };
  })();

  // generate score
  // {% include_relative _score.js %}
  function lerp(v0, v1, t) {
    return (1 - t) * v0 + t * v1;
  }
  function getPrevNextIndices(array, val) {
    for (var i = 0; i < array.length; i++) {
      if (val >= array[i - 1] && val <= array[i]) {
        return [i - 1, i];
      }
    }
  }
  function getPrevNextIndicesAndT(array, time) {
    var indices = getPrevNextIndices(array, time),
      v0 = array[indices[0]],
      v1 = array[indices[1]],
      t = (time - v0) / (v1 - v0);
    return [indices[0], indices[1], t];
  }
  function lerpEnvelope(env, iit) {
    return lerp(env[iit[0]], env[iit[1]], iit[2]);
  }
  function roundHalf(num) {
    return Math.round(num * 2) / 2;
  }

  /**
   * While scalable, the original work was timed at 300 seconds (5 minutes)
   */
  score.timeScale = score.totalDuration / 300;

  score.bars = [
    0,
    6.3858708756625,
    10.33255612459,
    16.718427000252,
    27.050983124842,
    37.383539249432,
    43.769410125095,
    47.716095374022,
    50.155281000757,
    54.101966249685,
    60.487837125347,
    66.873708001009,
    70.820393249937,
    77.206264125599,
    81.152949374527,
    87.538820250189,
    97.871376374779,
    108.20393249937,
    114.58980337503,
    124.92235949962,
    131.30823037528,
    141.64078649987,
    158.35921350013,
    175.07764050038,
    185.41019662497,
    195.74275274956,
    212.46117974981,
    229.17960675006,
    239.51216287465,
    245.89803375032,
    256.23058987491,
    262.61646075057,
    272.94901687516,
    283.28157299975,
    289.66744387541,
    293.61412912434,
    300,
  ].map(function (bar) {
    return bar * score.timeScale;
  });

  /**
   * For interpolating parameter envelopes. Scaled to 1--originally in SuperCollider as durations.
   */
  score.structure = [
    0,
    0.14586594177599999,
    0.236029032,
    0.381924,
    0.618,
    0.763970968,
    1,
  ];

  score.rehearsalLetters = [
    { letter: "A", index: 6 },
    { letter: "B", index: 12 },
    { letter: "C", index: 18 },
    { letter: "D", index: 24 },
    { letter: "E", index: 27 },
  ];

  var durations = [0.2, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8];
  var timbres = [
    "bartok",
    "(pizz.)",
    "ghost",
    "rolling (pizz.)",
    "rolling, glassy",
    "glassy",
    "flutter",
    "vib.",
    "ord.",
    "l.v.",
  ];
  var dynamics = ["f", "mf", "mp", "p", "pp", "pp", "p", "mp", "mf", "f", "ff"];

  var envelopes = {
    phraseLength: [1, 1, 2, 3, 4, 1, 1],
    timeDispersion: [0, 0, 1, 1.5, 2, 2.5, 3],
    pitch: {
      high: [0, 0, 0.5, 1, 1.5, 2, 2],
      low: [0, -0.5, -1, -1.5, -2, -2, -2],
    },
    duration: {
      high: [0.2, 0.75, 1.5, 3, 6, 4, 4],
      low: [0.2, 0.5, 0.5, 1.0, 2, 3, 3],
    },
    timbre: [0, 2, 4, 5, 6, 8, 9],
  };

  var parts = [];
  for (var p = 0; p < scoreOptions.parts; p++) {
    var part = [];
    for (
      var i = 0, nBars = score.bars.length, lastBar = nBars - 1;
      i < nBars;
      i++
    ) {
      var now = score.bars[i] / score.totalDuration,
        iit = getPrevNextIndicesAndT(score.structure, now),
        phrase = {};

      var endLastPhrase = 0;
      if (i > 0) {
        var lastIndex = i - 1,
          lastPhraseDuration = part[lastIndex].durations.reduce(function (a, b) {
            return a + b;
          }, 0);
        // TODO last dur is not incuded in sum?
        // var lastDur = part[lastIndex].durations[part[lastIndex].durations.length - 1];
        var lastDur = 0;
        if (part[lastIndex].durations.length > 1) {
          lastDur =
            part[lastIndex].durations[part[lastIndex].durations.length - 1];
        }
        endLastPhrase = part[lastIndex].startTime + lastPhraseDuration + lastDur;
      }

      var dispersion = lerpEnvelope(envelopes.timeDispersion, iit);
      dispersion = VS.getRandExcl(-dispersion, dispersion);
      dispersion *= score.timeScale;

      phrase.startTime = Math.max(score.bars[i] + dispersion, endLastPhrase);

      var timbreIndex = 0;
      if (i === 0) {
        timbreIndex = 0; // bartok
      } else if (i === lastBar) {
        timbreIndex = 9; // l.v.
      } else {
        // 1/3 chance to anticipate next timbre (and thus dynamic)
        timbreIndex = Math.round(lerpEnvelope(envelopes.timbre, iit));
        timbreIndex = VS.getWeightedItem([timbreIndex, timbreIndex + 1], [2, 1]);
      }
      phrase.timbre = timbres[timbreIndex];

      if (i === 0) {
        phrase.pitch = {
          // pitch center
          high: 0,
          low: 0,
        };
      } else if (i === lastBar) {
        phrase.pitch = {
          // full range
          high: 2,
          low: -2,
        };
      } else {
        phrase.pitch = {
          high: VS.clamp(
            roundHalf(
              lerpEnvelope(envelopes.pitch.high, iit) + VS.getRandExcl(-0.5, 0.5)
            ),
            0,
            2
          ),
          low: VS.clamp(
            roundHalf(
              lerpEnvelope(envelopes.pitch.low, iit) + VS.getRandExcl(-0.5, 0.5)
            ),
            -2,
            0
          ),
        };
      }

      var phraseLength = Math.round(lerpEnvelope(envelopes.phraseLength, iit));
      phrase.durations = [];

      if (i > 0) {
        // if not the first bar, calculate note durations
        for (var j = 0; j < phraseLength; j++) {
          var highDur = lerpEnvelope(envelopes.duration.high, iit);
          var lowDur = lerpEnvelope(envelopes.duration.low, iit);

          // find a (random) duration between these envelopes
          var randDur = VS.getRandExcl(lowDur, highDur);
          // match that to the closest durations
          var closeDurIndices = getPrevNextIndices(durations, randDur);
          // and pick one of the two
          var thisDur = durations[VS.getItem(closeDurIndices)];
          phrase.durations.push(thisDur);
        }
      } else {
        // if first bar, force x notehead
        phrase.durations.push(0);
      }
      if (phrase.timbre === "ghost") {
        phrase.durations.push(1.1); // to help space startTime, avoiding overlap
      }

      // also mapped to envelopes.timbre
      phrase.dynamics = [];
      phrase.dynamics[0] = dynamics[timbreIndex];
      if (i === lastBar) {
        phrase.dynamics[0] = "ff";
      }

      if (phrase.durations.length > 1 && phrase.timbre !== "ghost") {
        phrase.dynamics[1] = phrase.durations[0] < 1 ? ">" : "dim.";
      }

      phrase.articulations = []; // [">", /*dim.*/, "-", "l.v."]
      if (phraseLength > 1 && phrase.durations[0] > 0.75) {
        phrase.articulations[0] = ">";
      }
      if (phraseLength > 2 && phrase.durations[2] < 4) {
        phrase.articulations[2] = "-";
      }
      if (phrase.timbre === "l.v.") {
        phrase.articulations[phrase.durations.length - 1] = "l.v.";
      }

      part.push(phrase);
    }
    parts.push(part);
  }

  function getBarDuration(ndex) {
    return score.bars[ndex + 1] - score.bars[ndex];
  }
  function getBarlineX(bar) {
    return (score.width * bar) / score.totalDuration;
  }
  function decimalRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  // create barlines
  score.layout.group
    .append("g")
    .selectAll("line")
    .data(score.bars)
    .enter()
    .append("line")
    .attr("x1", 0)
    .attr("y1", score.layoutLayersY.barlines.y1)
    .attr("x2", 0)
    .attr("y2", score.layoutLayersY.barlines.y2)
    .attr("transform", function (d) {
      return "translate(" + getBarlineX(d) + ", " + 0 + ")";
    });

  // show durations over barlines
  score.layout.group
    .append("g")
    .selectAll("text")
    .data(score.bars)
    .enter()
    .append("text")
    .text(function (d, i) {
      var dur = getBarDuration(i);
      // do not display last bar's duration
      return i < score.bars.length - 1 ? decimalRound(dur, 1) + "\u2033" : "";
    })
    .classed("bar-duration", 1)
    .attr("transform", function (d) {
      return (
        "translate(" +
        getBarlineX(d) +
        ", " +
        score.layoutLayersY.barDurations +
        ")"
      );
    });

  // show rehearsal letters
  score.layout.letters = score.layout.group
    .append("g")
    .selectAll("g")
    .data(score.rehearsalLetters)
    .enter()
    .append("g")
    .attr("transform", function (d) {
      return (
        "translate(" +
        getBarlineX(score.bars[d.index]) +
        ", " +
        score.layoutLayersY.rehearsalLetters +
        ")"
      );
    });
  score.layout.letters.each(function () {
    var thisLetter = d3.select(this);

    thisLetter.append("rect").attr("y", -15).attr("width", 20).attr("height", 20);

    thisLetter
      .append("text")
      .text(function (d) {
        return d.letter;
      })
      .attr("dx", "0.25em");
  });

  /**
   * Score pointer/cue aid
   */
  function makeCueTriangle(selection) {
    selection
      .attr("class", "indicator")
      .attr("d", "M-6.928,0 L0,2 6.928,0 0,12 Z")
      .style("stroke", "black")
      .style("stroke-width", "1")
      .style("fill", "black")
      .style("fill-opacity", "0");
  }

  var cueTriangle = score.wrapper.append("path").call(makeCueTriangle);

  var cueIndicator = VS.cueBlink(cueTriangle)
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

  function cueBlink() {
    cueIndicator.start();
  }

  /**
   * Cue indicators up to section A
   */
  (function () {
    var i,
      len = score.rehearsalLetters[0].index;
    for (i = 0; i <= len; i++) {
      score.layout.group
        .append("text")
        .style("font-family", "Bravura")
        .style("text-anchor", "middle")
        .attr("x", getBarlineX(score.bars[i]))
        .attr("y", -48)
        .text("\ue890");
    }
  })();

  /**
   * Ghost beams, for use in score and in performance notes
   * Positioning of group depends on noteheads, not unitX or first note duration
   */
  function makeGhost() {
    var attackScale = 0.15,
      attackNum = VS.getItem([7, 8, 9]),
      x1 = 10, // offset to tie
      x2 = x1 + unitX * attackNum * attackScale,
      cy1 = -4,
      cy2 = -10;

    function ghostAttackSpacing(d, i) {
      return x1 + unitX * i * attackScale;
    }

    var ghostGroup = d3
      .select(this)
      .append("g")
      .attr("transform", "translate(" + 10 + ", 0)");

    ghostGroup
      .append("text")
      .text(dict.art["tie"])
      .classed("durations", true)
      .attr("y", score.partLayersY.articulations);
    ghostGroup
      .append("path")
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr(
        "d",
        "M" +
          x1 +
          " " +
          cy1 +
          " C " +
          x1 +
          " " +
          cy2 +
          " " +
          x2 +
          " " +
          cy2 +
          " " +
          x2 +
          " " +
          cy1
      );
    ghostGroup
      .append("line")
      .attr("class", "ghost-beam")
      .attr("x1", x1)
      .attr("y1", 0)
      .attr("x2", x2)
      .attr("y2", 0);
    ghostGroup
      .append("text")
      .text(dict.dyn[">"])
      .attr("class", "dynamics")
      .attr("x", x1)
      .attr("y", score.partLayersY.dynamics);

    ghostGroup
      .selectAll(".ghost-attack")
      .data(d3.range(attackNum))
      .enter()
      .append("line")
      .attr("class", "ghost-attack")
      .attr("x1", ghostAttackSpacing)
      .attr("y1", 0)
      .attr("x2", ghostAttackSpacing)
      .attr("y2", unitY);
  }

  /**
   * Draw parts
   */
  for (p = 0; p < scoreOptions.parts; p++) {
    var thisPart = parts[p],
      partYPos = score.layoutHeight + p * score.partHeight;

    var partGroup = score.group
      .append("g")
      .attr("transform", "translate(0, " + partYPos + ")");

    // for each phrase, create a group around a barline
    partGroup
      .selectAll("g")
      .data(score.bars)
      .enter()
      .append("g")
      .attr("transform", function (d, i) {
        var x = thisPart[i].startTime * unitX;
        return "translate(" + x + ", " + 0 + ")";
      })
      // add phrase content
      .each(function (d, i) {
        var thisPartGroup = d3.select(this);
        var thisPhrase = thisPart[i];
        var prevPhrase = thisPart[i - 1];
        var durations = thisPhrase.durations;
        var dynamics = thisPhrase.dynamics;
        var articulations = thisPhrase.articulations;
        var layersY = score.partLayersY;

        // wrapper to pass phrase durations and use consistent units
        function phraseSpacing(selection) {
          return VS.xByDuration(selection, durations, unitX, 0); // 1px for rect, not noteheads
        }

        function getNestedProp(prop, obj) {
          return prop.split(".").reduce(function (prev, curr) {
            return prev[curr];
          }, obj || this);
        }

        function hasNewValues(prop) {
          // TODO starting ghost notes do not have dynamics?
          var showValues = i === 0 || scoreOptions.verbose;
          return (
            showValues ||
            getNestedProp(prop, thisPhrase) !== getNestedProp(prop, prevPhrase)
          );
        }

        var hasNewPitch = hasNewValues("pitch.low") || hasNewValues("pitch.high");

        if (thisPhrase.timbre !== "bartok" && thisPhrase.timbre !== "ghost") {
          if (hasNewValues("timbre")) {
            thisPartGroup
              .append("text")
              .text(thisPhrase.timbre)
              .attr("class", "timbre")
              // stack if both pitch and timbre, otherwise save vertical space
              .attr("y", hasNewPitch ? layersY.timbre : layersY.pitch + 3);
          }
        } else if (thisPhrase.timbre === "bartok") {
          thisPartGroup
            .append("text")
            .text(dict.art["bartok"])
            .attr("class", "bartok")
            .attr("y", layersY.timbre);
        }

        var pitchDisplay, pitchDisplayClass;
        // if (scoreOptions.pitchDisplay === 'accidentals') {
        pitchDisplay = function () {
          var lo = thisPhrase.pitch.low,
            hi = thisPhrase.pitch.high;
          return (
            "\uec82 " +
            dict.acc[lo] +
            (lo !== hi ? "\u2009,\u2002" + dict.acc[hi] : "") +
            " \uec83"
          ); // tenuto as endash
        };
        pitchDisplayClass = "pitch-range";
        // } else {
        //     pitchDisplay = function() {
        //         var lo = thisPhrase.pitch.low,
        //             hi = thisPhrase.pitch.high,
        //             range = lo;
        //         if (lo !== hi) {
        //             range += ', ';
        //             range += (hi === 0) ? hi : '+' + hi;
        //         }
        //         return '[' + range + ']';
        //     };
        //     pitchDisplayClass = 'pitch-range-numeric';
        // }

        if (hasNewPitch) {
          thisPartGroup
            .append("text")
            .text(pitchDisplay)
            .attr("class", pitchDisplayClass)
            .attr("y", layersY.pitch);
        }

        thisPartGroup
          .selectAll(".durations")
          .data(durations)
          .enter()
          .append("text")
          .text(function (d) {
            if (!d) {
              return dict.art["x"]; // x notehead is an articulation, not a duration
            } else if (d === 1.1) {
              return "";
            } else {
              return dict.dur[d];
            }
          })
          .attr("class", "durations")
          .attr("y", layersY.durations)
          .call(phraseSpacing);
        // save this, could be an interesting setting to toggle
        // also, modify box height by pitch range
        // thisPartGroup.selectAll('.durations-rect')
        //     .data(durations)
        //     .enter()
        //     .append('rect')
        //         .attr('rx', 1)
        //         .call(phraseSpacing)
        //         .attr('class', 'durations-rect')
        //         .attr('y', 0)
        //         .attr('width', function(d) { return d * unitX; })
        //         .attr('height', unitY)
        //         .attr('fill', '#eee')
        //         .attr('fill-opacity', 0.5);

        if (thisPhrase.timbre === "ghost") {
          makeGhost.call(this);
        }

        // articulations
        thisPartGroup
          .selectAll(".articulations")
          .data(articulations)
          .enter()
          .append("text")
          .text(function (d) {
            return dict.art[d];
          })
          .classed("articulations", true)
          .attr("y", layersY.articulations)
          .call(phraseSpacing)
          .attr("dx", function (d) {
            return d === "l.v." ? 12 : 0;
          })
          .attr("dy", function (d) {
            return d === "l.v." ? unitY * -0.5 : 0;
          });

        // dynamics
        if (durations.length > 1 || hasNewValues("dynamics.0")) {
          thisPartGroup
            .selectAll(".dynamics")
            .data(dynamics)
            .enter()
            .append("text")
            .text(function (d) {
              return d === "dim." ? "dim." : dict.dyn[d];
            })
            .attr("class", function (d) {
              return d === "dim." ? "timbre" : "dynamics";
            })
            .attr("y", layersY.dynamics)
            .call(phraseSpacing);
        }
      }); // .each()
  }

  function scrollScore(index, dur, goToNextBar) {
    var playLastBar = goToNextBar && index === score.bars.length - 2;
    var targetIndex = goToNextBar ? index + 1 : index, // true = proceed to next bar, false = go to this bar
      targetBar = score.bars[targetIndex];

    score.group
      .transition()
      .ease(d3.easeLinear)
      .duration(dur)
      .attr(
        "transform",
        "translate(" +
          (view.center - getBarlineX(targetBar)) +
          "," +
          view.scoreY +
          ")"
      )
      // fade if playing last bar
      .style("opacity", playLastBar ? 0 : 1);
  }

  /**
   * Populate score
   */

  // add final event 30 seconds after last bar, for playback
  score.bars.push(score.bars[score.bars.length - 1] + 30);

  (function () {
    var i,
      len = score.bars.length;

    // TODO clarify: event will be scrollScore, will be undefined if i >= len - 1
    for (i = 0; i < len; i++) {
      VS.score.add(score.bars[i] * 1000, i < len - 1 && scrollScore, [
        i,
        getBarDuration(i) * 1000,
        true,
      ]);
    }
  })();

  function resize() {
    // TODO pause score if playing
    // TODO fix hard-coded Y spacing values
    view.width = parseInt(d3.select("main").style("width"), 10);
    view.height = parseInt(d3.select("main").style("height"), 10);
    score.scale = VS.clamp(
      view.height / (score.partHeight * scoreOptions.parts + 14 * unitY),
      0.1,
      2
    );

    score.svg.attr("height", view.height);
    score.wrapper.attr(
      "transform",
      "scale(" + score.scale + "," + score.scale + ")"
    );

    view.center = (view.width / score.scale) * 0.5;
    view.scoreY =
      (view.height / score.scale) * 0.5 - (score.height - 4 * unitY) * 0.5;

    cueTriangle.attr(
      "transform",
      "translate(" + view.center + "," + (view.scoreY - 6 * unitY) + ")"
    );
    // .style('opacity', 0.5);

    scrollScore(VS.score.getPointer(), [0]);
  }

  resize();

  d3.select(window).on("resize", resize);

  /**
   * Hooks
   */

  // Use a preroll so the score doesn't start scrolling immediately
  // TODO allow user to define this value? min 3 seconds
  VS.score.preroll = 3000;

  function prerollAnimateCue() {
    VS.score.schedule(VS.score.preroll - 3000, cueBlink);
  }

  VS.control.hooks.add("play", prerollAnimateCue);
  VS.WebSocket.hooks.add("play", prerollAnimateCue);

  function scrollToPointer() {
    if (!VS.score.pointerAtLastEvent()) {
      scrollScore(VS.score.getPointer(), 300, false);
    }
    // TODO else: set pointer back a step

    cueIndicator.cancel();
  }

  VS.control.hooks.add("pause", scrollToPointer);
  VS.WebSocket.hooks.add("pause", scrollToPointer);

  VS.control.hooks.add("step", scrollToPointer);
  VS.WebSocket.hooks.add("step", scrollToPointer);

  VS.score.hooks.add("stop", scrollToPointer);

  VS.WebSocket.connect();

  // {% include_relative _info.js %}
  // add cue
  var infoCue = d3
    .select(".info-cue")
    .attr("width", 14)
    .attr("height", 12)
    .append("g")
    .attr("transform", "translate(7, 0)");

  infoCue.append("path").call(makeCueTriangle);

  // add ghost
  var infoGhost = d3.select(".info-ghost").attr("width", 58).attr("height", 52);

  makeGhost.call(infoGhost.node());

  infoGhost.select("g").attr("transform", "translate(3, 13)");

}());
