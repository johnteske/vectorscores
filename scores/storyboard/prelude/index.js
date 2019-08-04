(function () {
  'use strict';

  // TODO since scenes can be cards or not cards, rename variables and CSS classes to match

  var scoreConfig = {
    totalDuration: 300, // 481 // originally timed for 481 s // NOTE does not scale chords--actual total duration may be longer
    cueBlinks: 2,
    transposeBy: 3
  };

  scoreConfig.cueDuration = 3000; // NOTE this is the max cue timing
  scoreConfig.scale = 1;

  // include_relative _card-content.js
  var chord = (function() {
    var timeSigs = {
      "2/4": "\uf589",
      "3/4": "\uf58c"
    };

    function makeChord(selection, args, x) {
      var range = [0, 1, 2, 3, 4, 5],
        rangeHalf = range.length * 0.5,
        notehead = "\uf46a";

      var stemX = x + 7.875;
      var flagX = x + 7.35;

      if (args.sustain) {
        notehead = "\uf468";
      } else if (args.duration === 1.5) {
        notehead = "\uf46a\u2009\uf477"; // &thinsp; + Bravura dot
      }

      function y(d) {
        return cardWidth * 0.5 + (d - rangeHalf) * 10 + 5;
      }

      if (args.sustain) {
        // fermata
        selection
          .append("text")
          .attr("class", "chord-fermata")
          .attr("x", x)
          .attr("y", y(0))
          .attr("dy", -15)
          .text("\ue4c6");
      } else {
        // stem
        selection
          .append("line")
          .attr("stroke", "black")
          .attr("x1", stemX)
          .attr("y1", y(5))
          .attr("x2", stemX)
          .attr("y2", y(0) - 20);

        // accent
        selection
          .append("text")
          .attr("class", "chord-art")
          .attr("x", x)
          .attr("y", y(5))
          .attr("dy", 15)
          .text("\uf475");

        // rest
        selection
          .append("text")
          .attr("class", "time-sig")
          .attr("x", args.duration ? x + 40 : x + 16)
          .attr("y", cardWidth * 0.5)
          .text("\ue4e6");
      }

      if (!args.sustain && args.duration !== 1.5) {
        // flag
        selection
          .append("text")
          .attr("class", "chord-flag")
          .attr("text-anchor", "start")
          .attr("x", flagX)
          .attr("y", y(0) - 24)
          .text("\uf48b");
        // .text("\uf48d"); // sixteenth
      }

      var text = selection
        .append("text")
        .attr("text-anchor", args.sustain ? "middle" : "start")
        .attr("class", "chord");

      text
        .selectAll("tspan")
        .data(range)
        .enter()
        .append("tspan")
        .attr("x", x)
        .attr("y", y)
        .text(notehead);
    }

    return function(selection, args) {
      var center = cardWidth * 0.5,
        marginLeft = 36,
        spacing = (cardWidth - marginLeft) / (args.n + 1);

      function x(i) {
        return marginLeft + i * spacing;
      }

      if (args.timeSig) {
        selection
          .append("text")
          .attr("class", "time-sig")
          .attr("dx", 6)
          .attr("y", cardWidth * 0.5)
          .attr("dy", 12)
          .text(timeSigs[args.timeSig]);
      }

      if (args.sustain) {
        selection.call(makeChord, args, center);
      } else {
        for (var i = 0; i < args.n; i++) {
          selection.call(makeChord, args, x(i));
        }
      }

      if (!args.sustain && args.duration !== 1.5) {
        selection
          .append("text")
          .attr("class", "time-sig")
          .attr("x", x(args.n))
          .attr("y", cardWidth * 0.5)
          .text("\ue4e5");
      }
    };
  })();

  function lnp(selection) {
    var margin = 11;

    selection
      .append("text")
      .attr("class", "lnp")
      .attr("x", 0)
      .attr("y", cardWidth)
      .attr("dx", margin)
      .attr("dy", -margin)
      .text("\ue0f4");

    selection
      .append("line")
      .attr("stroke", "black")
      .attr("stroke-width", "2")
      .attr("x1", margin + 4)
      .attr("x2", cardWidth - margin)
      .attr("y1", cardWidth - margin - 2)
      .attr("y2", cardWidth - margin - 2);
  }

  /**
   * TODO pass in margin to prevent overlap with LNP
   */
  function lines(selection, args) {
    var lineCloud = VS.lineCloud()
      .duration(args.duration || 1)
      .phrase(
        args.phrase || [{ pitch: 0, duration: 1 }, { pitch: 0, duration: 0 }]
      )
      .curve(args.curve || d3.curveLinear)
      .width(cardWidth)
      .height(cardWidth - (args.bottomMargin || 0));

    selection.call(lineCloud, { n: args.n });

    // test styling
    selection
      .selectAll(".line-cloud-path")
      .attr("stroke", "grey")
      .attr("fill", "none");
  }

  function microMelodyPhrase() {
    var notes = [{ pitch: 0, duration: 1 }, { pitch: 0, duration: 0 }];

    var dir = VS.getItem([-1, 1]);

    notes.push({ pitch: 2 * dir, duration: 1 });
    notes.push({ pitch: 2 * dir, duration: 0 });

    dir = dir === -1 ? 1 : -1;

    notes.push({ pitch: 2 * dir, duration: 1 });
    notes.push({ pitch: 2 * dir, duration: 0 });

    return notes;
  }

  function melodyPhrase() {
    var notes = [{ pitch: 0, duration: 1 }, { pitch: 0, duration: 0 }];

    function addNote() {
      var dir = VS.getItem([-1, 1]);
      notes.push({ pitch: 2 * dir, duration: 1 });
      notes.push({ pitch: 2 * dir, duration: 0 });
    }

    for (var i = 0; i < 5; i++) {
      addNote();
    }

    return notes;
  }

  function microtonalPhrase() {
    var notes = [{ pitch: 0, duration: 1 }];

    function addNote() {
      var dir = VS.getItem([-1, 1]);
      notes.push({ pitch: dir, duration: 1 });
    }

    for (var i = 0; i < 5; i++) {
      addNote();
    }

    notes.push({ pitch: 0, duration: 0 });

    return notes;
  }

  // include_relative _score.js
  // get new transposition around center but not equalling center
  function transposeInRange(center, range) {
    var t = VS.getItem([-1, 1]) * Math.floor(VS.getRandExcl(1, range + 1));
    return center + t;
  }

  var cardList = [
    {
      duration: 2,
      cue: 2,
      type: "bar",
      dynamics: [{ time: 0, value: "ff" }],
      pcSet: [0, 1, 2, 4, 7, 8],
      transpose: 0,
      content: [
        {
          type: chord,
          args: { n: 1, timeSig: "2/4" }
        }
      ]
    },
    {
      duration: 11,
      cue: 2,
      type: "card",
      dynamics: [{ time: 0, value: "n" }, { time: 0.5, value: "<" }],
      pcSet: [0, 1, 2, 4, 7, 8],
      transpose: 0,
      content: [
        {
          type: chord,
          args: { n: 1, sustain: true }
        }
      ]
    },
    {
      duration: 3,
      cue: 3,
      type: "bar",
      dynamics: [{ time: 0, value: "ff" }],
      pcSet: [0, 1, 2, 4, 7, 8],
      transpose: 0,
      content: [
        {
          type: chord,
          args: { n: 2, timeSig: "3/4" }
        }
      ]
    },
    {
      duration: 16,
      cue: 3,
      type: "card",
      dynamics: [{ time: 0, value: "n" }, { time: 0.5, value: "<" }],
      pcSet: [0, 1, 2, 4, 7, 8],
      transpose: 0,
      content: [
        {
          type: chord,
          args: { n: 1, sustain: true }
        }
      ]
    },
    {
      duration: 2,
      cue: 2,
      type: "bar",
      dynamics: [{ time: 0, value: "ff" }],
      pcSet: [0, 1, 2, 4, 7, 8],
      transpose: 0,
      content: [
        {
          type: chord,
          args: { n: 1, duration: 1.5, timeSig: "2/4" }
        }
      ]
    },
    {
      duration: 23,
      cue: 2,
      type: "card",
      dynamics: [{ time: 0, value: "mp" }],
      pcSet: [0, 1, 2, 4, 7, 8],
      transpose: 0,
      content: [
        {
          type: chord,
          args: { n: 1, sustain: true }
        }
      ]
    },
    /**
     * A
     */
    {
      duration: 25.75,
      cue: 3,
      type: "card",
      dynamics: [
        { time: 0, value: "n" },
        { time: 0.5, value: "<" },
        { time: 1, value: "p" }
      ],
      pcSet: [0, 1, 2, 4, 7, 8],
      transpose: transposeInRange(0, 2),
      content: [
        {
          type: lnp,
          args: {}
        },
        {
          type: lines,
          args: {
            n: 6,
            duration: 1,
            bottomMargin: 25
          }
        }
      ]
    },
    {
      duration: 25.75,
      cue: 1,
      type: "card",
      dynamics: [
        { time: 0, value: "p" },
        { time: 0.5, value: "<" },
        { time: 1, value: "mf" }
      ],
      pcSet: [0, 1, 2, 4, 7, 8],
      transpose: transposeInRange(0, 4),
      content: [
        {
          type: lnp,
          args: {}
        },
        {
          type: lines,
          args: {
            n: 18,
            duration: 3,
            bottomMargin: 25
          }
        }
      ]
    },
    {
      duration: 25.75,
      cue: 1,
      type: "card",
      dynamics: [
        { time: 0, value: "mf" },
        { time: 0.5, value: ">" },
        { time: 1, value: "p" }
      ],
      pcSet: [0, 1, 2, 4, 7, 8],
      transpose: transposeInRange(0, 4),
      content: [
        {
          type: lnp,
          args: {}
        },
        {
          type: lines,
          args: {
            n: 18,
            duration: 9,
            phrase: microMelodyPhrase,
            bottomMargin: 25
          }
        }
      ]
    },
    {
      duration: 25.75,
      cue: 1,
      type: "card",
      dynamics: [
        { time: 0, value: "p" },
        { time: 0.5, value: ">" },
        { time: 1, value: "n" }
      ],
      pcSet: [0, 1, 2, 4, 7, 8],
      transpose: transposeInRange(0, 2),
      content: [
        {
          type: lnp,
          args: {}
        },
        {
          type: lines,
          args: {
            n: 18,
            duration: 9,
            phrase: melodyPhrase,
            bottomMargin: 25
          }
        }
      ]
    },
    /**
     * B
     */
    {
      duration: 3,
      cue: 3,
      type: "bar",
      dynamics: [{ time: 0, value: "ff" }],
      pcSet: [0, 1, 2, 4, 7, 8],
      transpose: 0,
      content: [
        {
          type: chord,
          args: { n: 2, timeSig: "3/4" }
        }
      ]
    },
    {
      duration: 56.5,
      cue: 3,
      type: "card",
      dynamics: [
        { time: 0, value: "n" },
        { time: 0.5, value: "<" },
        { time: 1, value: "mf" }
      ],
      pcSet: [0, 1, 2, 4, 7, 8],
      transpose: transposeInRange(0, 3),
      content: [
        {
          type: lines,
          args: {
            n: 6,
            duration: 1
          }
        }
      ]
    },
    {
      duration: 76.5 * (3 / 7),
      cue: 1,
      type: "card",
      dynamics: [
        { time: 0, value: "mf" },
        { time: 0.5, value: ">" },
        { time: 1, value: "p" }
      ],
      pcSet: [0, 1, 2, 4, 7, 8],
      transpose: transposeInRange(0, 6),
      content: [
        {
          type: lines,
          args: {
            n: 18,
            duration: 9,
            phrase: microMelodyPhrase
          }
        }
      ]
    },
    {
      duration: 76.5 * (4 / 7),
      cue: 1,
      type: "card",
      dynamics: [
        { time: 0, value: "p" },
        { time: 0.5, value: ">" },
        { time: 1, value: "n" }
      ],
      pcSet: [0, 1, 2, 4, 7, 8],
      transpose: transposeInRange(0, 3),
      content: [
        {
          type: lines,
          args: {
            n: 18,
            duration: 15,
            phrase: microtonalPhrase,
            curve: d3.curveCardinal.tension(0)
          }
        }
      ]
    },
    /**
     * C
     */
    {
      duration: 2,
      cue: 2,
      type: "bar",
      dynamics: [{ time: 0, value: "ff" }],
      pcSet: [0, 1, 4, 6],
      transpose: 0,
      // pcSet: [0, 1, 3, 7]
      content: [
        {
          type: chord,
          args: { n: 1, duration: 1.5, timeSig: "2/4" }
        }
      ]
    },
    {
      duration: 180 * (3 / 7),
      cue: 2,
      type: "card",
      timbre: "glassy",
      dynamics: [
        { time: 0, value: "mp" },
        { time: 0.5, value: ">" },
        { time: 1, value: "pp" }
      ],
      pcSet: [0, 1, 4, 6],
      transpose: transposeInRange(0, 3),
      // pcSet: [0, 1, 3, 7]
      content: [
        {
          type: lines,
          args: {
            n: 12,
            duration: 6,
            phrase: microtonalPhrase,
            curve: d3.curveCardinal.tension(0)
          }
        }
      ]
    },
    {
      duration: 180 * (4 / 7),
      cue: 1,
      type: "card",
      timbre: "glassy",
      dynamics: [
        { time: 0, value: "pp" },
        { time: 0.5, value: ">" },
        { time: 1, value: "n" }
      ],
      pcSet: [0, 1, 4, 6],
      transpose: transposeInRange(0, 7),
      // pcSet: [0, 1, 3, 7]
      content: [
        {
          type: lines,
          args: {
            n: 6,
            duration: 1
          }
        }
      ]
    }
  ];

  var cues = [];

  // include_relative _options.js
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
  var dynamicsDict = VS.dictionary.Bravura.dynamics;

  // display
  var cardWidth = 120,
    cardPadding = 24,
    cardTransTime = 600,
    offset = cardWidth + cardPadding,
    offsetY = 1,
    width = cardWidth * 4 + cardPadding * 2,
    height = cardWidth * 2.5;

  var svg = d3.select(".main");

  var scaleDuration = (function() {
    var scale = scoreConfig.totalDuration / 481;

    return function(i) {
      var dur = cardList[i].duration;
      // Do not scale chords (2-3 s)
      return dur < 4 ? dur : dur * scale;
    };
  })();

  function cardX(index) {
    return index * (cardWidth + cardPadding) * scoreConfig.scale;
  }

  function makeCue(data, index) {
    var selection = d3.select(this);

    var symbols = {
      // \ue890 // cue
      1: "\ue893", // weak cue
      2: "\ue894", // 2 beat
      3: "\ue895" // 3 beat
      // \ue896 // 4 beat
      // \ue89a // free
    };

    selection
      .attr("class", "cue bravura")
      .attr("transform", "translate(" + cardX(index) + ", 100)")
      .attr("dy", "-2em")
      .style("text-anchor", data.cue ? "start" : "middle")
      .style("fill", "#888")
      .text(symbols[data.cue]);

    cues[index] = VS.cueBlink(selection)
      .beats(data.cue)
      .inactive(function(selection) {
        selection.style("fill", "#888").style("opacity", 1);
      })
      .on(function(selection) {
        selection.style("fill", "blue").style("opacity", 1);
      })
      .off(function(selection) {
        selection.style("fill", "#888").style("opacity", 0.25);
      })
      // Do not blink on downbeat--card position animation signals downbeat
      .down(function(selection) {
        selection.style("fill", "#888").style("opacity", 0.25);
      });
  }

  function makeCard(data, index) {
    var selection = d3.select(this);

    selection
      .append("text")
      .attr("class", "card-duration")
      .attr("dy", "-2.5em")
      .text(scaleDuration(index).toFixed(1) + "\u2033");

    if (data.timbre) {
      selection
        .append("text")
        .attr("class", "card-timbre")
        .attr("x", cardWidth)
        .attr("dy", "-2.5em")
        .style("text-anchor", "end")
        .text(data.timbre);
    }

    selection
      .append("text")
      .attr("dy", "-1em")
      .text(function(d) {
        var transpose =
          typeof d.transpose !== "undefined"
            ? d.transpose + scoreConfig.transposeBy
            : "random";
        var pcSet = VS.pitchClass.transpose(
          d.pcSet,
          transpose + scoreOptions.transposition
        );

        pcSet = pcSet.map(function(pc) {
          return VS.pitchClass.format(
            pc,
            scoreOptions.pitchClasses.display,
            scoreOptions.pitchClasses.preference
          );
        });

        return "{" + pcSet.join(",") + "}";
      })
      .classed("pitch-class-set", 1);

    var card = selection.append("g");

    if (data.type === "card") {
      card
        .append("rect")
        .attr("width", cardWidth)
        .attr("height", cardWidth);
    } else {
      card
        .append("line")
        .attr("class", "barline")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", cardWidth);
    }

    for (var ci = 0; ci < data.content.length; ci++) {
      var content = data.content[ci];
      card.call(content.type, content.args);
    }

    selection
      .append("g")
      .attr("class", "dynamics")
      .attr("transform", "translate(0, " + cardWidth + ")")
      .selectAll("text")
      .data(function(d) {
        return d.dynamics;
      })
      .enter()
      .append("text")
      .attr("x", function(d) {
        return d.time * cardWidth;
      })
      .attr("text-anchor", function(d) {
        var anchor = "start";

        if (d.time === 0.5) {
          anchor = "middle";
        } else if (d.time === 1) {
          anchor = "end";
        }

        return anchor;
      })
      .attr("dx", function(d) {
        return d.time === 0 ? "0.125em" : 0;
      })
      .attr("dy", "1em")
      .text(function(d) {
        return dynamicsDict[d.value];
      });
  }

  // create cards
  function translateCardGroup(pointer) {
    var i = pointer || 0;
    return (
      "translate(" +
      (offset - cardX(i)) +
      ", " +
      offsetY +
      ") scale(" +
      scoreConfig.scale +
      "," +
      scoreConfig.scale +
      ")"
    );
  }

  var cardGroup = svg.append("g").attr("transform", translateCardGroup);

  var cards = cardGroup
    .selectAll(".card")
    .data(cardList)
    .enter()
    .append("g")
    .classed("card", 1)
    .each(makeCard)
    .attr("transform", function(d, i) {
      return "translate(" + cardX(i) + ", 100)";
    })
    .style("opacity", function(d, i) {
      return 1 - i * 0.5;
    });

  // create cues
  cardGroup
    .append("g")
    .attr("class", "cues")
    .selectAll(".cue")
    .data(cardList)
    .enter()
    .append("text")
    .each(makeCue)
    .call(showNextCue, 0, 0);

  function showNextCue(selection, pointer, dur) {
    selection
      .transition()
      .duration(dur)
      .style("opacity", function(d, i) {
        return i === pointer + 1 ? 1 : 0;
      });
  }

  function fadePenultimateScene(active, dur) {
    cards
      .filter(function(d, i) {
        return i === cardList.length - 1;
      })
      .style("opacity", 1)
      .transition()
      .duration(dur)
      .style("opacity", active ? 0 : 1);
  }

  function goToCard(index, control) {
    var pointer = typeof index !== "undefined" ? index : VS.score.getPointer();
    var dur = cardTransTime;
    cardGroup
      .transition()
      .duration(dur)
      .attr("transform", function() {
        return translateCardGroup(pointer);
      });

    d3.selectAll(".cue").call(showNextCue, pointer, dur);

    cards
      .transition()
      .duration(dur)
      .style("opacity", function(d, i) {
        // if rolling back to begin play, hide previous cards
        var p = control === "play" ? pointer + 1 : pointer;

        if (p > i) {
          return 0;
        } else {
          return 0.5 * (pointer - i) + 1;
        }
      })
      .on("end", function() {
        // if penultimate scene, fade
        if (
          VS.score.getPointer() === VS.score.getLength() - 2 &&
          control === "score"
        ) {
          fadePenultimateScene(true, scaleDuration(pointer) * 1000 - dur);
        }
      });

    // if playing and not skipping, stopping
    // if (control === 'score') { updateCardIndicator(index); } // cue all
    // if (control === 'score' && cardList[pointer + 1].cue) { updateCardIndicator(index); } // only cue if set in score
    if (control === "score") {
      scheduleCue(index);
    }
  }

  function cueBlink(pointer) {
    cues[pointer + 1].start();
  }

  function cueCancelAll() {
    for (var i = 0; i < cues.length; i++) {
      cues[i].cancel();
    }
  }

  function scheduleCue(pointer) {
    // do not schedule if penultimate scene
    if (VS.score.getPointer() === VS.score.getLength() - 2) {
      return;
    }

    var cardDuration = cardList[pointer + 1].time - cardList[pointer].time,
      nextCue = cues[pointer + 1],
      cueDelay = cardDuration - nextCue.duration();

    VS.score.schedule(cueDelay, cueBlink, pointer);
  }

  // Add final event for proper timing of last card
  var cardsWithFinalEvent = [].concat(cardList, { duration: 0 });

  var score = cardsWithFinalEvent.map(function(card, i, list) {
    card.time = list.slice(0, i).reduce(function(sum, c, j) {
      return (sum += scaleDuration(j) * 1000);
    }, 0);

    return card;
  });

  score.slice(0, -1).forEach(function(card, i) {
    VS.score.add(card.time, goToCard, [i, "score"]);
  });
  VS.score.add(score[score.length - 1].time);

  VS.score.preroll = scoreConfig.cueDuration; // cardTransTime;

  VS.control.hooks.add("play", function() {
    var pointer = VS.score.getPointer();
    goToCard(pointer - 1, "play");
    // VS.score.schedule(VS.score.preroll - score.cueDuration, cueBlink);
    VS.score.schedule(
      VS.score.preroll - cues[pointer].duration(),
      cueBlink,
      pointer - 1
    );
  });

  function cancelAndGoToCard() {
    cueCancelAll();
    d3.selectAll(".cue").style("opacity", 0);
    fadePenultimateScene(false, 0);
    goToCard();
  }
  VS.control.hooks.add("pause", cancelAndGoToCard);
  VS.control.hooks.add("stop", cancelAndGoToCard);

  VS.control.hooks.add("step", goToCard);

  /**
   * Resize
   */
  function resize() {
    var main = d3.select("main");

    var w = parseInt(main.style("width"), 10);
    var h = parseInt(main.style("height"), 10);

    var scaleX = VS.clamp(w / width, 0.25, 4);
    var scaleY = VS.clamp(h / height, 0.25, 4);

    scoreConfig.scale = Math.min(scaleX, scaleY);

    offset = w * 0.5 - cardWidth * scoreConfig.scale;
    offsetY = h * 0.5 - height * 0.5 * scoreConfig.scale;

    cardGroup.attr("transform", translateCardGroup);
  }

  resize();

  d3.select(window).on("resize", resize);

}());
