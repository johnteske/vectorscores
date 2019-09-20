(function () {
  'use strict';

  const seconds = t => t * 1000;

  const pitchRange = 87;

  function pitchScale(value) {
    return (1 - value) * pitchRange;
  }

  const durations = VS.dictionary.Bravura.durations.stemless;

  function longTone(selection, x, y, length) {
    const group = selection.append("g");

    group.attr("transform", `translate(${x}, ${y})`);

    group
      .append("text")
      .attr("class", "bravura")
      .text(durations[4]);

    group
      .append("line")
      .attr("x1", "0.5em")
      .attr("x2", length);

    return group;
  }

  function addHooks(setScorePosition) {
    VS.control.hooks.add("step", setScorePosition);
    VS.WebSocket.hooks.add("step", setScorePosition);

    VS.control.hooks.add("pause", setScorePosition);
    VS.WebSocket.hooks.add("pause", setScorePosition);

    VS.score.hooks.add("stop", setScorePosition);
  }

  const { dynamics } = VS.dictionary.Bravura;

  function drawDynamics(data, scale, selection) {
    const g = selection.append("g");

    data.forEach(d => {
      const text = g.append("text").attr("x", d.x * scale);

      switch (d.x) {
        case 0:
          text.attr("text-anchor", "start");
          break;
        case 1:
          text.attr("text-anchor", "end");
          break;
        default:
          text.attr("text-anchor", "middle");
      }

      switch (d.type) {
        case "symbol":
          text
            .text(dynamics[d.value])
            .attr("class", "bravura")
            .attr("dy", "2em");
          break;
        case "text":
          text
            .text(d.value)
            .attr("class", "text-dynamic")
            .attr("dy", "3.5em");
          break;
      }
    });

    return g;
  }

  function DEPRECATED_translate(x, y, selection) {
    return selection.attr("transform", `translate(${x}, ${y})`);
  }

  function makeIndicator(selection) {
    // TODO from dirge,,march AND ad;sr
    const indicator = selection
      .append("path")
      .attr("class", "indicator")
      .attr("d", "M-6.928,0 L0,2 6.928,0 0,12 Z")
      .style("stroke", "black")
      .style("stroke-width", "1")
      .style("fill", "black")
      .style("fill-opacity", "0");

    let x = 0;
    let y = 0;

    function translateX(_) {
      x = _;
      DEPRECATED_translate(x, y, indicator);
    }

    function translateY(_) {
      y = _;
      DEPRECATED_translate(x, y, indicator);
    }

    return {
      element: indicator,
      blinker: blinker(indicator),
      translateX,
      translateY
    };
  }

  function blinker(selection) {
    return VS.cueBlink(selection)
      .beats(3)
      .inactive(function(selection) {
        selection.style("fill-opacity", 0);
      })
      .on(function(selection) {
        selection.style("fill-opacity", 1);
      })
      .off(function(selection) {
        selection.style("fill-opacity", 0);
      })
      .down(function(selection) {
        selection.style("fill-opacity", 1);
      });
  }

  function makePage(selection) {
    const page = selection.append("g");

    let _scale = 1;

    function scale(_) {
      _scale = _;
      page.attr("transform", `scale(${_scale})`);
    }

    return {
      element: page,
      scale
    };
  }

  const glyphs = {
    open: "\ue893",
    closed: "\ue890"
  };

  function cue(selection, type = "closed") {
    return selection
      .append("text")
      .attr("class", "bravura")
      .attr("text-anchor", "middle")
      .text(glyphs[type]);
  }

  function makeScroll(selection) {
    const scroll = selection.append("g");

    let _center = null;
    let _y = 0;

    function setCenter(_) {
      _center = _;
    }

    function scrollTo(x, duration) {
      scroll
        .transition()
        .ease(d3.easeLinear)
        .duration(duration)
        .attr("transform", `translate(${_center - x},${_y})`);
    }

    function y(_) {
      _y = _;
    }

    return {
      element: scroll,
      setCenter,
      scrollTo,
      y
    };
  }

  var startTimeFromDuration = (bar, i, score) => {
    // Calculate and set startTimes
    const startTime = score
      .slice(0, i)
      .reduce((sum, b, j) => sum + b.duration, 0);
    return { ...bar, startTime };
  };

  const stemHeight = 10;
  const spacing = 5;

  function stems(selection, pcs) {
    pcs.forEach((pc, i) => {
      const x = i * spacing;
      const y = -1 * pc;

      selection
        .append("line")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", y)
        .attr("y2", y - stemHeight);
    });
  }

  function doubleBeam(selection, pcs) {
    const n = pcs.length - 1;
    const pc1 = pcs[0];
    const pc2 = pcs[n];

    selection
      .append("line")
      .attr("x1", 0)
      .attr("x2", n * spacing)
      .attr("y1", -stemHeight - pc1)
      .attr("y2", -stemHeight - pc2)
      .attr("stroke-width", 2);

    selection
      .append("line")
      .attr("x1", 0)
      .attr("x2", n * spacing)
      .attr("y1", 0)
      .attr("y1", -stemHeight + 3 - pc1)
      .attr("y2", -stemHeight + 3 - pc2)
      .attr("stroke-width", 2);
  }

  function sixteenths(selection) {
    const g = selection.append("g").attr("stroke", "black");

    stems(g, [0, -1, 0, 2, 3]);
    doubleBeam(g, [0, -1, 0, 2]);

    return g;
  }

  function variations(selection) {
    const g = selection.append("g").attr("stroke", "black");

    const pcs = [0, -1, 0, 2, 0, -1, 0, 2]
      .sort(() => Math.random() - 0.5)
      .slice(0, VS.getRandIntIncl(5, 8));
    stems(g, pcs);
    pcs.pop();
    doubleBeam(g, pcs);

    return g;
  }

  function tremoloLongTone(selection, length) {
    const g = longTone(selection, 0, 0, length).attr("stroke", "black");

    g.append("text")
      .text("\ue227")
      .attr("dx", "0.25em")
      .attr("dy", "-0.5em")
      .attr("class", "bravura");

    return g;
  }

  function maul(selection, w, h) {
    const g = selection.append("g");

    for (let i = 0; i < 50; i++) {
      g.append("text")
        .text("/")
        .attr("fill", "darkred")
        .attr("x", Math.random() * Math.random() * w)
        .attr("y", Math.random() * h);
    }

    return g;
  }

  // sixteenths are not proportional to real time

  const durations$1 = VS.dictionary.Bravura.durations.stemless;

  const margin = {
    top: 64
  };

  function durationInBeats(beats) {
    const bpm = 140;
    return beats * (60 / bpm) * 1000;
  }

  function timeScale(t) {
    return t / 20;
  }

  function callTranslate(selection, x, y) {
    return DEPRECATED_translate(x, y, selection);
  }

  const dynamic = (selection, type, value) =>
    drawDynamics([{ type, value, x: 0 }], 0, selection);

  const bloodText = (selection, str) =>
    selection
      .append("text")
      .text(str)
      .attr("fill", "darkRed");

  const svg = d3.select("svg.main");
  svg.append("style").text(`
  text.wip { fill: blue }
  .bravura { font-family: 'Bravura'; font-size: 30px; }
`);

  const page = makePage(svg);

  const scoreGroup = makeScroll(page.element);
  scoreGroup.y(margin.top); // TODO allow chaining
  const wrapper = scoreGroup.element;

  const indicator = makeIndicator(page.element);
  indicator.blinker = indicator.blinker
    .interval(durationInBeats(1))
    .offDuration(durationInBeats(0.5));

  const makeCue = selection => cue(selection).attr("y", -1 * pitchRange);

  const score = [
    {
      startTime: null,
      duration: durationInBeats(3),
      render: ({ x, length }) => {
        const beatLength = length / 3;
        const g = DEPRECATED_translate(x, pitchScale(0.5), wrapper.append("g"));

        // 3/4 time signature
        g.append("text")
          .text("\uf58c")
          .attr("dx", "-1em")
          .attr("dy", "0.5em")
          .attr("class", "bravura");

        sixteenths(g).attr("transform", "scale(1)");

        g.append("text")
          .attr("class", "bravura")
          .attr("dx", "0.25em")
          .text("\ue4e6")
          .call(callTranslate, beatLength * 1, 0);

        g.append("text")
          .attr("class", "bravura")
          .text("\ue4e5")
          .call(callTranslate, beatLength * 2, 0);

        dynamic(g, "symbol", "ff");

        makeCue(g);
      }
    },
    {
      startTime: null,
      duration: seconds(0.25), // TODO
      render: ({ x, length }) => {
        const g = DEPRECATED_translate(x, 0, wrapper.append("g"));

        // spike
        g.append("path").attr("d", `M-5,0 L5,0 L0,${pitchRange} Z`);
        DEPRECATED_translate(0, pitchScale(0.5), dynamic(g, "symbol", "sffz"));

        maul(g, 87, pitchRange);

        DEPRECATED_translate(0, pitchScale(0.5), makeCue(g));
      }
    },
    {
      startTime: null,
      duration: seconds(60),
      render: ({ x, length }) => {
        const g = DEPRECATED_translate(x, 0, wrapper.append("g"));

        bloodText(g, "MAUL").attr("dy", "-2em");

        g.append("text")
          .attr("dy", "-1em")
          .text("col legno, slapping");

        for (let i = 0; i < 25; i++) {
          DEPRECATED_translate(
            Math.random() * length * 0.25,
            Math.random() * pitchRange,
            tremoloLongTone(g, timeScale(seconds(3)))
          );
          DEPRECATED_translate(
            Math.random() * length * 0.25,
            Math.random() * pitchRange,
            variations(g)
          );
          DEPRECATED_translate(
            Math.random() * length * 0.25,
            Math.random() * pitchRange,
            variations(g)
          );
        }

        for (let i = 0; i < 25; i++) {
          DEPRECATED_translate(
            Math.random() * length,
            Math.random() * pitchRange,
            tremoloLongTone(g, timeScale(seconds(3)))
          );
          DEPRECATED_translate(
            Math.random() * length,
            Math.random() * pitchRange,
            variations(g)
          );
        }

        for (let i = 0; i < 25; i++) {
          longTone(
            g,
            VS.getRandExcl(length * 0.75, length),
            Math.random() * pitchRange,
            timeScale(5000)
          ).attr("stroke", "black");
        }

        DEPRECATED_translate(
          0,
          pitchScale(0.5),

          drawDynamics([{ x: 0.5, type: "text", value: "decres." }], length, g)
        );
      }
    },
    {
      startTime: null,
      duration: seconds(60),
      render: ({ x, length }) => {
        const g = DEPRECATED_translate(x, 0, wrapper.append("g"));

        const makeThread = (x, y, selection, durations) => {
          const x2 = x + timeScale(durations[0]);

          selection
            .append("line")
            .attr("stroke", "darkred")
            .attr("x1", x)
            .attr("x2", x2)
            .attr("y1", y - 1)
            .attr("y2", y - 1);

          selection
            .append("line")
            .attr("stroke", "black")
            .attr("x1", x2)
            .attr("x2", x2 + timeScale(durations[1]))
            .attr("y1", y)
            .attr("y2", y);
        };

        for (let i = 0; i < 25; i++) {
          let durations = [VS.getRandIntIncl(2, 4), VS.getRandIntIncl(1, 2)].map(
            durationInBeats
          );
          let x = VS.getRandExcl(0, length - timeScale(seconds(4))); // minus 4 seconds
          let y = pitchScale(VS.getRandExcl(0, 1));
          makeThread(x, y, g, durations);
        }

        bloodText(g, "(weep)").attr("dy", "-2em");

        DEPRECATED_translate(
          0,
          pitchScale(0.5),

          drawDynamics(
            [
              { x: 0, type: "symbol", value: "mp" },
              { x: 0.5, type: "text", value: "decres." },
              { x: 1, type: "symbol", value: "n" }
            ],
            length,
            g
          )
        );
      }
    },
    {
      startTime: 0,
      duration: 0,
      render: () => {}
    }
  ].map(startTimeFromDuration);

  score.forEach((bar, i) => {
    const callback = i < score.length - 1 ? scrollToNextBar : null;
    VS.score.add(bar.startTime, callback, [i, bar.duration]);
  });

  function renderScore() {
    score.forEach(bar => {
      const { render, ...meta } = bar;
      const renderData = {
        x: timeScale(bar.startTime),
        length: timeScale(bar.duration)
      };
      render({ ...meta, ...renderData });
    });
  }

  function setScorePosition() {
    const index = VS.score.getPointer();
    centerScoreByIndex(index, 0);
  }

  function centerScoreByIndex(index, duration) {
    const x = timeScale(score[index].startTime);
    scoreGroup.scrollTo(x, duration);
  }

  function scrollToNextBar(index, duration) {
    centerScoreByIndex(index + 1, duration);
  }

  function resize() {
    VS.score.isPlaying() && VS.score.pause();

    const w = parseInt(svg.style("width"), 10);
    const h = parseInt(svg.style("height"), 10);

    const scale = h / (64 + 87 + 64);
    page.scale(scale);

    const center = (w / scale) * 0.5;
    indicator.translateX(center);
    scoreGroup.setCenter(center);
    setScorePosition();
  }

  d3.select(window).on("resize", resize);

  d3.select(window).on("load", () => {
    renderScore();
    resize();
  });

  VS.score.preroll = durationInBeats(3);
  function prerollAnimateCue() {
    VS.score.schedule(0, indicator.blinker.start());
  }
  VS.control.hooks.add("play", prerollAnimateCue);
  VS.WebSocket.hooks.add("play", prerollAnimateCue);

  addHooks(setScorePosition);

  VS.WebSocket.connect();

}());
