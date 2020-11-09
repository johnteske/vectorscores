(function () {
  'use strict';

  function rangeGen(length, min, max) {
    var pcs = [];
    for (var i = 0; i < length; i++) {
      pcs.push(Math.floor(Math.random() * (max - min)) + min);
    }
    return pcs;
  }

  function wedgeRangeGen(length, min, max) {
    var pcs = [],
      band = (max - min) / length;
    for (var i = 0; i < length; i++) {
      pcs.push(Math.floor(Math.random() * band) + (min + band * i));
    }
    return pcs;
  }

  function stepRangeGen(length, min, max) {
    var pcs = [],
      thispc,
      lmax,
      lmin,
      disp = 10;
    min += disp;
    max -= disp;
    thispc = Math.floor(Math.random() * (max - min)) + min; // initial selection
    for (var i = 0; i < length; i++) {
      lmax = Math.min(thispc + disp, max);
      lmin = Math.max(thispc - disp, min);
      thispc = Math.floor(Math.random() * (lmax - lmin)) + lmin;
      pcs.push(thispc);
    }
    return pcs;
  }

  function randRangeGenerator() {
    return VS.getItem([rangeGen, wedgeRangeGen, stepRangeGen]);
  }

  function makeGlobject() {
    var globject = {},
      hiRangeGen = randRangeGenerator(),
      loRangeGen = randRangeGenerator(),
      dynamics = ["ppp", "pp", "p", "mp", "mf", "f", "ff", "fff"],
      newDynamics = ["", "", ""];

    globject.width = Math.round(VS.getRandExcl(100, 200));

    globject.rangeEnvelope = {
      type: "midi",
      hi: hiRangeGen(4, 64, 127),
      lo: loRangeGen(4, 0, 63),
      times: [0, 0.3, 0.5, 1],
    };

    var pcset = VS.pitchClass.transpose(VS.getItem(VS.trichords), "random");

    globject.pitches = [
      {
        classes: pcset.slice(0, 2),
        time: 0,
      },
      {
        classes: pcset,
        time: 0.5,
      },
    ];

    // globject.duration = {
    //     values: [0.5, 0.75, 1],
    //     weights: [0.5, 0.25, 0.25]
    // };
    // globject.articulation = {
    //     values: [">", "_", "."],
    //     weights: [0.5, 0.25, 0.25]
    // };

    newDynamics[0] = VS.getItem(dynamics);
    newDynamics[2] = VS.getItem(dynamics);
    if (dynamics.indexOf(newDynamics[0]) > dynamics.indexOf(newDynamics[2])) {
      newDynamics[1] = "dim.";
    } else if (
      dynamics.indexOf(newDynamics[0]) < dynamics.indexOf(newDynamics[2])
    ) {
      newDynamics[1] = "cres.";
    } else {
      newDynamics[1] = "subito " + VS.getItem(dynamics);
      newDynamics[2] = "";
    }

    globject.dynamics = [
      { value: newDynamics[0], time: 0 },
      { value: newDynamics[1], time: 0.5 },
      { value: newDynamics[2], time: 1 },
    ];

    var durs = [0.5, 1, 1.5, 2];

    globject.phraseTexture = [
      VS.getItem(durs),
      VS.getItem(durs),
      VS.getItem(durs),
    ];

    return globject;
  }

  var score = (function () {
    var _score = [];
    for (var i = 0; i < 8; i++) {
      _score.push([makeGlobject()]);
    }
    return _score;
  })();

  var width = 480,
    maxwidth = 480,
    margin = 20,
    boxwidth = width + margin * 2,
    center = boxwidth * 0.5,
    debug = +VS.getQueryString("debug") === 1 || false;

  var noteheads = VS.dictionary.Bravura.durations.stemless;

  var main = d3
    .select(".main")
    .classed("debug", debug)
    .style("width", boxwidth + "px")
    .style("height", boxwidth + "px");

  var globjectContainer = main.append("g").attr("class", "globjects");

  function update(index) {
    d3.selectAll(".globject").remove();

    var globject = VS.globject()
      .width(function (d) {
        return d.width;
      })
      .height(127);

    globjectContainer
      .selectAll(".globject")
      .data(score[index])
      .enter()
      .append("g")
      .each(globject)
      .each(centerGlobject);

    globjectContainer.selectAll(".globject-content").each(function (d) {
      var selection = d3.select(this),
        w = d.width;

      function phraseSpacing(selection) {
        var durations = d.phraseTexture;
        return VS.xByDuration(selection, durations, 18, 0) + 64;
      }

      // 127 / ~10px notehead height = 13 y layers
      for (var phrase = 0, phrases = 13; phrase < phrases; phrase++) {
        selection
          .append("g")
          .attr("transform", function () {
            var halfWidth = w * 0.5,
              x = Math.random() * halfWidth + halfWidth * (phrase % 2),
              y = (127 / phrases) * phrase;
            return "translate(" + x + "," + y + ")";
          })
          .selectAll("text")
          .data(d.phraseTexture)
          .enter()
          .append("text")
          .text(function (d) {
            return noteheads[d];
          })
          .call(phraseSpacing);
      }
    });

    globjectContainer.selectAll(".globject").each(function (d) {
      var selection = d3.select(this),
        w = d.width;

      selection
        .append("g")
        .selectAll("text")
        .data(function (d) {
          return d.pitches;
        })
        .enter()
        .append("text")
        .attr("x", function (d) {
          return d.time * w;
        })
        .attr("y", 127 + 24)
        .text(function (d) {
          var pcSet = d.classes.map(function (pc) {
            return VS.pitchClass.format(pc);
          });
          return "{" + pcSet.join(", ") + "}";
        });

      selection
        .append("g")
        .selectAll("text")
        .data(d.dynamics)
        .enter()
        .append("text")
        .attr("x", function (d) {
          return d.time * w;
        })
        .attr("y", 127 + 42)
        .text(function (d) {
          return d.value;
        });
    });
  }

  function centerGlobject(d) {
    d3.select(this).attr(
      "transform",
      "translate(" + (center - d.width * 0.5) + "," + (center - 120 * 0.5) + ")"
    );
  }

  /**
   * Resize
   */
  function resize() {
    // update width
    boxwidth = Math.min(parseInt(d3.select("main").style("width"), 10), maxwidth);
    center = boxwidth * 0.5;
    width = boxwidth - margin * 2;

    main.style("width", boxwidth + "px").style("height", boxwidth + "px");

    d3.selectAll(".globject").each(centerGlobject);
  }

  resize();

  d3.select(window).on("resize", resize);

  /**
   * Populate score
   */
  for (var i = 0; i < score.length; i++) {
    VS.score.add(i * (16000 + VS.getRandExcl(-2000, 2000)), update, [i]);
  }

  /**
   * Initialize score
   */
  update(0);

  /**
   * Score controls
   */
  VS.control.hooks.add("stop", function () {
    update(0);
  });
  VS.control.hooks.add("step", function () {
    update(VS.score.getPointer());
  });

}());
