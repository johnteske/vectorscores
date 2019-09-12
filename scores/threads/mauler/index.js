(function () {
  'use strict';

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

  function translate(x, y, selection) {
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
      translate(x, y, indicator);
    }

    function translateY(_) {
      y = _;
      translate(x, y, indicator);
    }

    return {
      element: indicator,
      translateX,
      translateY
    };
  }

  const durations = VS.dictionary.Bravura.durations.stemless;

  function makePage(selection) {
    const page = selection.append("g");

    let _height = null;
    let _scale = 1;

    function calculateHeight() {
      _height = page.node().getBBox().height;
    }

    function height() {
      return _height;
    }

    function scale(_) {
      _scale = _;
      page.attr("transform", `scale(${_scale})`);
    }

    return {
      element: page,
      calculateHeight,
      height,
      scale
    };
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

  function repeated(selection) {
    const g = selection.append("g").attr("stroke", "black");

    const pcs = [0, -1, 0, 2, 0, -1, 0, 2];
    stems(g, pcs);
    doubleBeam(g, pcs);

    return g;
  }

  function tremoloLongTone(selection) {
    const g = selection.append("g");

    g.append("text")
      .text("\ue227")
      .attr("dy", "-0.5em")
      .attr("class", "bravura wip");

    g.append("line")
      .attr("stroke", "black")
      .attr("x2", 100); // TODO

    return g;
  }

  const durations$1 = VS.dictionary.Bravura.durations.stemless;

  const margin = {
    top: 64
  };

  const pitchRange = 87;
  function pitchScale(value) {
    return (1 - value) * pitchRange;
  }

  function durationInBeats(beats) {
    const bpm = 120;
    return beats * (60 / bpm) * 1000;
  }

  function durationInSeconds(seconds) {
    return seconds * 1000;
  }

  function timeScale(t) {
    return t / 20;
  }

  function callTranslate(selection, x, y) {
    return translate(x, y, selection);
  }

  const svg = d3.select("svg.main");
  svg.append("style").text(`
  text.wip { fill: blue }
  .bravura { font-family: 'Bravura'; font-size: 30px; }
`);

  const page = makePage(svg);
  // Create hidden line to ensure page fits margins
  page.element
    .append("line")
    .attr("y1", 0)
    .attr("y2", margin.top + pitchRange + 32) // TODO
    //.attr("y2", margin.top + pitchRange + margin.top)
    .style("visibility", "hidden");

  const scoreGroup = makeScroll(page.element);
  scoreGroup.y(margin.top); // TODO allow chaining
  const wrapper = scoreGroup.element;

  //// TODO for alignment only
  //wrapper
  //  .append("line")
  //  .attr("stroke", "red")
  //  .attr("x1", -9999)
  //  .attr("x2", 9999)
  //  .attr("y1", pitchScale(0.5))
  //  .attr("y2", pitchScale(0.5));

  const indicator = makeIndicator(page.element);

  const makeCue = function(selection) {
    return selection
      .append("text")
      .attr("class", "bravura wip")
      .attr("text-anchor", "middle")
      .attr("y", -87)
      .text("\ue890");
  };

  const score = [
    {
      startTime: null,
      duration: durationInBeats(3),
      render: ({ x, length }) => {
        const beatLength = length / 3;
        const g = translate(x, pitchScale(0.5), wrapper.append("g"));

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

        drawDynamics([{ x: 0, type: "symbol", value: "ff" }], length, g);

        makeCue(g);
      }
    },
    {
      startTime: null,
      duration: durationInSeconds(30),
      render: ({ x, length }) => {
        const g = translate(x, 0, wrapper.append("g"));
        // spike
        g.append("path").attr("d", `M-5,0 L5,0 L0,${pitchRange} Z`);
        // wall/tremolo--is it around the pitch center?

        g.append("text")
          .attr("class", "wip")
          .attr("dy", "-2em")
          .text("col legno, slapping");

        for (let i = 0; i < 25; i++) {
          translate(
            Math.random() * length * 0.25,
            Math.random() * pitchRange,
            tremoloLongTone(g)
          );
          translate(
            Math.random() * length * 0.25,
            Math.random() * pitchRange,
            repeated(g)
          );
          translate(
            Math.random() * length * 0.25,
            Math.random() * pitchRange,
            sixteenths(g)
          );
        }

        for (let i = 0; i < 25; i++) {
          translate(
            Math.random() * length,
            Math.random() * pitchRange,
            tremoloLongTone(g)
          );
          translate(
            Math.random() * length,
            Math.random() * pitchRange,
            sixteenths(g)
          );
        }

        // drone(g);
        const makeThread = (x, y, length, selection) => {
          selection
            .append("line")
            .attr("stroke", "black")
            .attr("x1", x)
            .attr("x2", x + length)
            .attr("y1", y)
            .attr("y2", y);
        };

        for (let i = 0; i < 10; i++) {
          let x = VS.getRandExcl(0.25, 0.5) * length;
          let y = pitchScale(VS.getRandExcl(0, 1));
          makeThread(x, y, length * 0.5, g);
        }

        g.append("text")
          .attr("class", "wip")
          .attr("dy", "-1em")
          .text("semitone falls around long tones")
          .attr("x", length * 0.25);

        translate(
          0,
          pitchScale(0.5),

          drawDynamics(
            [
              { x: 0, type: "symbol", value: "sffz" },
              { x: 0.5, type: "text", value: "decres." },
              { x: 1, type: "text", value: "mp" }
            ],
            length,
            g
          )
        );

        translate(0, pitchScale(0.5), makeCue(g));
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

    // const scale = h / page.height(); // TODO remove
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
    page.calculateHeight();
    resize();
  });

  VS.control.hooks.add("stop", setScorePosition);
  VS.score.hooks.add("stop", setScorePosition);
  VS.control.hooks.add("step", setScorePosition);
  VS.control.hooks.add("pause", setScorePosition);

}());
