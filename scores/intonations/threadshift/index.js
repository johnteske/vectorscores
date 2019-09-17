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

  function doubleBar(selection, height) {
    const g = selection.append("g");

    g.append("line")
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke-width", 1);

    g.append("line")
      .attr("x1", 3)
      .attr("x2", 3)
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke-width", 2);

    return g;
  }

  const glyphs = {
    open: "\ue893",
    closed: "\ue890"
  };

  function cue(selection, type = "closed") {
    return selection
      .append("text")
      .attr("class", "bravura wip")
      .attr("text-anchor", "middle")
      .text(glyphs[type]);
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

  function pathAlongPath(guideCurve, pathCurve) {
    const lineGenerator = d3
      .line()
      .x(d => d.x)
      .y(d => d.y);

    const guideGenerator = lineGenerator.curve(guideCurve);
    const pathGenerator = lineGenerator.curve(pathCurve);

    return function(guidePoints, pathPoints, pathPointMap, selection) {
      const g = selection.append("g");

      const guide = g
        .append("path")
        .attr("d", guideGenerator(guidePoints))
        .attr("fill", "none")
        .attr("stroke", "none");

      const guideLength = guide.node().getTotalLength();
      const nPoints = pathPoints.length;
      const mappedPoints = pathPoints.map((point, i) => {
        const { x, y } = guide
          .node()
          .getPointAtLength(guideLength * (i / nPoints));
        return pathPointMap(point, i, x, y);
      });
      mappedPoints.push(guide.node().getPointAtLength(guideLength)); // add final point

      g.append("path")
        .attr("d", lineGenerator(mappedPoints))
        .attr("fill", "none")
        .attr("stroke", "black"); // TODO allow custom style

      return g;
    };
  }

  var startTimeFromDuration = (bar, i, score) => {
    // Calculate and set startTimes
    const startTime = score
      .slice(0, i)
      .reduce((sum, b, j) => sum + b.duration, 0);
    return { ...bar, startTime };
  };

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
      translateX,
      translateY
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

  function makeScrollingScore() {
    const svg = d3.select("svg.main");

    const page = makePage(svg);

    const scoreGroup = makeScroll(page.element);
    scoreGroup.y(margin.top);

    const indicator = makeIndicator(page.element);

    return {
      svg,
      page,
      scoreGroup,
      indicator
    };
  }

  function makeResize(
    svg,
    page,
    margin,
    pitchRange,
    indicator,
    scoreGroup,
    setScorePosition
  ) {
    return function() {
      VS.score.isPlaying() && VS.score.pause();

      const w = parseInt(svg.style("width"), 10);
      const h = parseInt(svg.style("height"), 10);

      const scale = h / (margin.top + pitchRange + margin.top);
      page.scale(scale);

      const center = (w / scale) * 0.5;
      indicator.translateX(center);
      scoreGroup.setCenter(center);
      setScorePosition();
    };
  }

  function makeScrollFunctions(scoreGroup, xValues) {
    function centerScoreByIndex(index, duration) {
      const x = xValues[index];
      scoreGroup.scrollTo(x, duration);
    }

    return {
      setScorePosition: function() {
        const index = VS.score.getPointer();
        centerScoreByIndex(index, 0);
      },
      scrollToNextBar: function(index, duration) {
        centerScoreByIndex(index + 1, duration);
      }
    };
  }

  function addHooks(setScorePosition) {
    VS.control.hooks.add("step", setScorePosition);
    VS.WebSocket.hooks.add("step", setScorePosition);

    VS.control.hooks.add("pause", setScorePosition);
    VS.WebSocket.hooks.add("pause", setScorePosition);

    VS.score.hooks.add("stop", setScorePosition);
  }

  function noisePatch(x, length, selection) {
    // TODO length will become path data?
    // TODO shape as path
    const h = 20; // TODO set height, for now
    const y = -0.5 * h; // to center

    const g = selection.append("g");

    g.append("rect")
      .attr("x", x)
      .attr("width", length * 0.5)
      .attr("y", y)
      .attr("height", h)
      .attr("stroke", "blue")
      .attr("fill", "none");

    const x2 = x + length * 0.5;
    const y2 = y + h;

    g.append("line")
      .attr("class", "wip")
      .attr("x1", x)
      .attr("x2", x2)
      .attr("y1", y)
      .attr("y2", y2);

    g.append("line")
      .attr("class", "wip")
      .attr("x1", x)
      .attr("x2", x2)
      .attr("y1", y2)
      .attr("y2", y);

    return g;
  }

  function makeEmptyArray(n) {
    let array = [];
    for (let i = 0; i < n; i++) {
      array.push(null);
    }
    return array;
  }

  const lineGenerator = d3
    .line()
    .x(d => d.x)
    .y(d => d.y);

  function lineBecomingAir(length, selection) {
    const n = 50;

    const points = makeEmptyArray(n).map((_, i) => ({
      x: (i / n) * length,
      y: 0
    }));
    const segments = points.reduce((accumulator, point, i) => {
      const index = Math.floor(i / 5);
      const target = accumulator[index] || [];
      target.push(point);
      accumulator[index] = target;
      return accumulator;
    }, []);

    const g = selection.append("g");
    g.selectAll("path")
      .data(segments)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("d", d => lineGenerator(d));
    return g;
  }

  // make held tone less predictable/gated

  function timeScale(t) {
    return t / 200;
  }

  const makeCue = selection => cue(selection).attr("y", -1 * pitchRange);

  const { svg, page, scoreGroup, indicator } = makeScrollingScore();

  svg.append("style").text(`
  line { stroke: black; }
  line.wip { stroke: blue; }
  text.wip { fill: blue; }
  .bravura { font-family: 'Bravura'; font-size: 20px; }
  .text-dynamic {
    font-family: serif;
    font-size: 12px;
    font-style: italic;
  }
`);

  const { articulations, dynamics: dynamics$1 } = VS.dictionary.Bravura;

  const splitDynamics = endDynamic => [
    {
      type: "symbol",
      value: "sffz", // sfffz?
      x: 0
    },
    {
      type: "symbol",
      value: "mf",
      x: 0.15
    },
    {
      type: "text",
      value: "decres.",
      x: 0.5
    },
    {
      type: "symbol",
      value: endDynamic,
      x: 1
    }
  ];

  const score = [
    {
      startTime: null,
      duration: seconds(60),
      render: ({ x, length }) => {
        const g = longTone(scoreGroup.element, x, pitchScale(0.5), length);

        g.append("text")
          .text(articulations[">"])
          .attr("class", "bravura")
          .attr("dy", "0.66em");

        drawDynamics(
          [
            {
              type: "symbol",
              value: "p",
              x: 0
            },
            {
              type: "text",
              value: "siempre",
              x: 0.25
            }
          ],
          length,
          g
        );

        makeCue(g);
      }
    },
    {
      startTime: null,
      duration: seconds(5), // TODO 2 seconds time, more display
      render: ({ x, length }) => {
        const g = scoreGroup.element.append("g");
        DEPRECATED_translate(x, pitchScale(0.5), g);

        // cluster
        g.append("text")
          .text("\ue123")
          .attr("class", "bravura");

        drawDynamics(
          [
            {
              type: "symbol",
              value: "sffz", // sfffz?
              x: 0
            }
          ],
          length,
          g
        );

        // caesura
        g.append("text")
          .text("\ue4d2")
          .attr("class", "bravura")
          .attr("x", length)
          .attr("dy", "-1em")
          .attr("text-anchor", "end");

        makeCue(g);
      }
    },
    {
      startTime: null,
      duration: seconds(45),
      render: ({ x, length }) => {
        const g = scoreGroup.element.append("g");
        DEPRECATED_translate(x, 0, g);

        // with excessive pressure and air
        DEPRECATED_translate(
          0,
          pitchScale(0.5),
          g
            .append("text")
            //.text("\ue61b")
            .text("\ue61d")
            .attr("dy", "-1em")
            .attr("class", "bravura")
            .attr("text-anchor", "middle")
        );
        // TODO add transition to ord/norm

        // irregular tremolo
        DEPRECATED_translate(
          0,
          pitchScale(0.5),
          g
            .append("text")
            .text("\uE22B")
            .attr("dy", "-0.5em")
            .attr("class", "bravura")
            .attr("text-anchor", "middle")
        );
        // TODO add transition to ord/norm

        // top line
        const line = lineBecomingAir(length, g);
        DEPRECATED_translate(0, pitchScale(0.5), line);

        const patches = DEPRECATED_translate(0, pitchScale(0.5), g.append("g"));
        [0.2, 0.4, 0.6].forEach(x => {
          noisePatch(x * length, length * 0.1, patches);
        });

        drawDynamics(
          splitDynamics("n"),
          length,
          DEPRECATED_translate(0, -50, g.append("g"))
        );

        // bottom line
        pathAlongPath(d3.curveBasis, d3.curveBasis)(
          [
            { x: 0, y: pitchScale(0.5) },
            { x: length * 0.33, y: pitchScale(0.485) },
            { x: length * 0.66, y: pitchScale(0.265) },
            { x: length, y: pitchScale(0.25) }
          ],
          [...new Array(50)],
          (point, i, x, y) => ({ x, y: y + VS.getRandExcl(-1, 1) }),
          g
        );

        const bottomNoise = noisePatch(length * 0.25, length, g);
        DEPRECATED_translate(0, pitchScale(0.25), bottomNoise);

        [0.2, 0.4, 0.6].forEach(x => {
          g.append("text") // TODO also add flag
            .text("\ue123")
            .attr("x", length * x)
            .attr("y", pitchScale(0.5 - x / 4))
            .attr("dy", "1em")
            .attr("class", "bravura");
        });

        drawDynamics(splitDynamics("p"), length, DEPRECATED_translate(0, 50, g.append("g")));

        DEPRECATED_translate(0, pitchScale(0.5), makeCue(g));
      }
    },
    {
      startTime: null,
      duration: seconds(120),
      render: ({ x, length }) => {
        const g = scoreGroup.element.append("g");
        DEPRECATED_translate(x, 0, g);

        // bottom line
        g.append("line")
          .attr("x1", 0)
          .attr("x2", length)
          .attr("y1", pitchScale(0.25))
          .attr("y2", pitchScale(0.25));

        g.append("text").text("(solo)");

        // threads
        const makeThread = (x, y, length, selection) => {
          const group = DEPRECATED_translate(x, y, selection.append("g"));

          group
            .append("line")
            .attr("x1", 0)
            .attr("x2", length);

          drawDynamics(
            [
              {
                type: "symbol",
                value: "n",
                x: 0
              },
              {
                type: "text",
                value: "cres.",
                x: 0.5
              },
              {
                type: "symbol",
                value: "mf",
                x: 1
              }
            ],
            length,
            group
          );
        };

        for (let i = 0; i < 10; i++) {
          let x = VS.getRandExcl(0.25, 0.5) * length;
          let y = pitchScale(VS.getRandExcl(0, 1));
          makeThread(x, y, length - x, g);
        }

        g.append("text")
          .text("(tutti)")
          .attr("x", length * 0.25);
      }
    },
    {
      startTime: null,
      duration: 0,
      render: ({ x }) => {
        // Double bar
        const g = scoreGroup.element.append("g");
        DEPRECATED_translate(x, 0, g);

        doubleBar(g, pitchRange);

        DEPRECATED_translate(0, pitchScale(0.5), makeCue(g));
      }
    }
  ].map(startTimeFromDuration);

  const scoreWithRenderData = score.map(bar => {
    return {
      ...bar,
      x: timeScale(bar.startTime),
      length: timeScale(bar.duration)
    };
  });

  function renderScore() {
    scoreWithRenderData.forEach(bar => {
      const { render, ...data } = bar;
      render(data);
    });
  }

  const { setScorePosition, scrollToNextBar } = makeScrollFunctions(
    scoreGroup,
    scoreWithRenderData.map(bar => bar.x)
  );

  score.forEach((bar, i) => {
    const callback = i < score.length - 1 ? scrollToNextBar : null;
    VS.score.add(bar.startTime, callback, [i, bar.duration]);
  });

  const resize = makeResize(
    svg,
    page,
    margin,
    pitchRange,
    indicator,
    scoreGroup,
    setScorePosition
  );

  d3.select(window).on("resize", resize);

  d3.select(window).on("load", () => {
    renderScore();
    resize();
  });

  addHooks(setScorePosition);

  VS.WebSocket.connect();

  // TODO include stylesheet or inline all styles
  // TODO serialize font?
  //function saveSvg() {
  //  var svgXML = new XMLSerializer().serializeToString(svg.node());
  //  var encoded = encodeURI(svgXML);
  //  var dataURI = `data:image/svg+xml;utf8,${encoded}`;
  //
  //  var dl = document.createElement("a");
  //  document.body.appendChild(dl); // This line makes it work in Firefox.
  //  dl.setAttribute("href", dataURI);
  //  dl.setAttribute("download", "test.svg");
  //  dl.click();
  //  dl.remove();
  //}
  //d3.select("#save-svg").on("click", saveSvg);

}());
