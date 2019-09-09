(function () {
  'use strict';

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

  function sixteenths(selection) {
    const g = selection.append("g").attr("stroke", "black");

    const stemHeight = 10;
    const spacing = 5;

    [0, -1, 0, 2, 3].forEach((y, i) => {
      const x = i * spacing;

      g.append("line")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", -1 * y)
        .attr("y2", -1 * y - stemHeight);
    });

    g.append("line")
      .attr("x1", 0)
      .attr("x2", 3 * spacing)
      .attr("y1", -stemHeight)
      .attr("y2", -stemHeight - 2)
      .attr("stroke-width", 2);

    g.append("line")
      .attr("x1", 0)
      .attr("x2", 3 * spacing)
      .attr("y1", 0)
      .attr("y1", -stemHeight + 3)
      .attr("y2", -stemHeight + 3 - 2)
      .attr("stroke-width", 2);

    return g;
  }

  function tremoloLongTone(selection) {
    const g = selection.append("g");

    g.append("text").text("///");

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

  function timeScale(t) {
    return t / 80;
  }

  function callTranslate(selection, x, y) {
    return translate(x, y, selection);
  }

  const svg = d3.select("svg.main");
  svg.append("style").text(`
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

  const indicator = makeIndicator(page.element);

  const score = [
    {
      startTime: null,
      duration: 3000,
      render: ({ x }) => {
        const g = translate(x, pitchScale(0.5), wrapper.append("g"));

        // 3/4 time signature
        g.append("text")
          .text("\uf58c")
          .attr("dx", "-1em")
          .attr("class", "bravura");

        sixteenths(g).attr("transform", "scale(1)");

        g.append("text")
          .attr("class", "bravura")
          .text("\ue4e6")
          .call(callTranslate, timeScale(1500), 0);

        g.append("text")
          .attr("class", "bravura")
          .text("\ue4e5")
          .call(callTranslate, timeScale(2000), 0);
      }
    },
    {
      startTime: null,
      duration: 30000,
      render: ({ x, length }) => {
        const g = translate(x, 0, wrapper.append("g"));
        // spike
        g.append("path").attr("d", "M-5,0 L5,0 L0,60 Z");
        // wall/tremolo--is it around the pitch center?

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
      }
    },
    // drone(wrapper);
    // semitone falls around drones, maybe the wall/texture fades over time
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

    const scale = h / page.height();
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
