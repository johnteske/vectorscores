(function () {
  'use strict';

  const margin = {
    top: 64
  };

  const seconds = t => t * 1000;

  const pitchRange = 87;

  function pitchScale(value) {
    return (1 - value) * pitchRange;
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

  function translate(selection, x, y) {
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

  function timeScale(t) {
    return t / 150;
  }

  const svg = d3.select("svg.main");
  const page = makePage(svg);

  svg.append("style").text(`
  .bravura { font-family: 'Bravura'; font-size: 20px; }
  .text-dynamic {
    font-family: serif;
    font-size: 12px;
    font-style: italic;
  }
`);

  const scoreGroup = makeScroll(page.element);
  scoreGroup.y(margin.top); // TODO allow chaining

  const wrapper = scoreGroup.element;

  const indicator = makeIndicator(page.element);

  const cues = wrapper.append("g");

  const bloodText = (selection, str) =>
    selection
      .append("text")
      .text(str)
      .attr("fill", "darkRed");

  function heavyBreath(selection) {
    const g = selection.append("g");

    const rect = g
      .append("rect")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("height", "1em");

    // g.append("text").text("\ue0b8"); // Bravura
    g.append("text")
      .attr("dy", "1em")
      .text("intense breaths")
      .attr("fill", "blue");

    const box = g.node().getBBox();
    rect.attr("width", box.width);

    return g;
  }

  function scrapeDrone(selection) {
    return selection.append("line").attr("stroke", "blue");
  }

  function growl(selection) {
    const g = selection.append("g");

    const rect = g
      .append("rect")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("height", "1em");

    g.append("text")
      .attr("dy", "1em")
      .text("LNP growl")
      //.text("trem, exp. cres. growl ->")
      .attr("fill", "blue");

    const box = g.node().getBBox();
    rect.attr("width", box.width);

    return g;
  }

  const breath = [
    // start with intense breath sounds
    {
      duration: seconds(180),
      render: ({ x, length }) => {
        const g = wrapper.append("g");

        translate(heavyBreath(g), x, 0);

        g.append("line")
          .attr("x1", 0)
          .attr("x2", length)
          .attr("stroke", "black")
          .attr("stroke-dasharray", "3")
          .call(translate, 0, 10);

        drawDynamics(
          [
            {
              type: "symbol",
              value: "p",
              x: 0
            },
            {
              type: "text",
              value: "cres.",
              x: 0.25
            },
            {
              type: "symbol",
              value: "ff",
              x: 0.5
            },
            {
              type: "text",
              value: "decres.",
              x: 0.75
            },
            {
              type: "symbol",
              value: "n",
              x: 1
            }
          ],
          length,
          g
        );
      }
    },
    {
      duration: 0,
      render: ({ x }) => {
        //const g = wrapper.append("g");
        //translate(g, x, 0);
        //appendmakeCue(x, "open");
        // TODO if all fades/moriendo, is a double bar needed?
        //doubleBar(g, pitchRange).attr("stroke", "black");
      }
    }
  ].map(startTimeFromDuration);

  const texture = [
    {
      duration: seconds(30),
      render: () => {}
    },
    // add low scrape
    {
      duration: seconds(30),
      render: ({ x, length }) => {
        const g = wrapper.append("g");
        translate(g, x, pitchScale(0.25));
        g.append("text")
          .text("scrape")
          .attr("fill", "blue");
        scrapeDrone(g).attr("x2", length);
        bloodText(g, "choke hold").attr("y", -0.75 * pitchRange); // TODO y pos
        // TODO dynamics?
        //makeCue(x); // TODO dotted line pointing to this
      }
    },
    // scrape cluster
    {
      duration: seconds(60),
      render: ({ x, length }) => {
        const g = wrapper.append("g");
        translate(g, x, pitchScale(0.25));
        scrapeDrone(g)
          .attr("x2", length)
          .call(translate, 0, -2);
        scrapeDrone(g).attr("x2", length);
        scrapeDrone(g)
          .attr("x2", length)
          .call(translate, 0, 2);
        // TODO dynamics?
      }
    },
    // TODO scrape and drone cres., more pressure
    // growl
    {
      duration: seconds(60),
      render: ({ x, length }) => {
        const g = wrapper.append("g");
        translate(g, x, pitchScale(0.25));
        growl(g);

        g.append("line")
          .attr("x1", 0)
          .attr("x2", length)
          .attr("stroke", "black")
          .attr("stroke-dasharray", "3")
          .call(translate, 0, 10);

        // TODO dynamics?
      }
    }
  ].map(startTimeFromDuration);

  const noise = [
    {
      duration: seconds(90),
      render: () => {}
    },
    {
      duration: seconds(30),
      render: ({ x, length }) => {
        const g = wrapper.append("g");
        translate(g, x, 0);
        bloodText(g, "the claws dig in");
        for (let i = 0; i < 100; i++) {
          g.append("text")
            .text("/")
            .attr("fill", "darkred")
            .attr("x", Math.random() * length)
            .attr("y", Math.random() * pitchRange);
        }
      }
    }
  ].map(startTimeFromDuration);

  // TODO wall of texture, frantic

  const score = [...noise, ...breath, ...texture];

  const scoreTiming = score
    .map(bar => bar.startTime)
    .filter((startTime, i, times) => times.indexOf(startTime) === i)
    .sort((a, b) => a - b)
    .map((startTime, i, times) => ({
      startTime,
      duration: times[i + 1] - times[i] || 0
    }));

  scoreTiming.forEach((bar, i) => {
    const callback = i < scoreTiming.length - 1 ? scrollToNextBar : null;
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
    const x = timeScale(scoreTiming[index].startTime); // TODO note this is timing
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

  VS.score.preroll = seconds(3);
  function prerollAnimateCue() {
    VS.score.schedule(0, indicator.blinker.start());
  }
  VS.control.hooks.add("play", prerollAnimateCue);
  VS.WebSocket.hooks.add("play", prerollAnimateCue);

  VS.control.hooks.add("step", setScorePosition);
  VS.WebSocket.hooks.add("step", setScorePosition);

  VS.control.hooks.add("pause", setScorePosition);
  VS.WebSocket.hooks.add("pause", setScorePosition);

  VS.score.hooks.add("stop", setScorePosition);

  VS.WebSocket.connect();

}());
