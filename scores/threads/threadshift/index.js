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

  const { dynamics } = VS.dictionary.Bravura;

  function drawDynamics(data, scale, selection) {
    data.forEach(d => {
      const text = selection.append("text").attr("x", d.x * scale);

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
  }

  function noisePatch(x, length, selection) {
    // TODO length will become path data?
    // TODO shape as path
    return selection
      .append("rect")
      .attr("x", x)
      .attr("width", length * 0.5)
      .attr("y", -10) // center
      .attr("height", 20)
      .attr("fill", "pink")
      .style("opacity", "0.5");
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
      .attr("stroke", "black")
      .attr("d", d => lineGenerator(d));
    return g;
  }

  // make held tone less predictable/gated

  const margin = {
    top: 64
  };

  const seconds = t => t * 1000;

  const pitchRange = 87;
  function pitchScale(value) {
    return (1 - value) * pitchRange;
  }
  // function pitchScale(midi) {
  //   // MIDI 21/A0 to 108/C8
  //   // 64.5/Eq#4 is center
  //   const [min, max] = [21, 108];
  //   const range = max - min;
  //
  //   return 1 - midi / range;
  // }

  function timeScale(t) {
    return t / 200;
  }

  const svg = d3.select("svg.main");
  svg.append("style").text(`
  line { stroke: black; }
  .bravura { font-family: 'Bravura'; font-size: 20px; }
  .text-dynamic {
    font-family: serif;
    font-size: 12px;
    font-style: italic;
  }
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
  //scoreGroup.element.style("outline", "1px dotted red");

  const indicator = makeIndicator(page.element);

  // drone(scoreGroup.element); // TODO: how do these integrate with the ending

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
            }
            //          {
            //            type: "text",
            //            value: "cres.",
            //            x: 0.5
            //          },
            //          {
            //            type: "symbol",
            //            value: "mf",
            //            x: 1
            //          }
          ],
          length,
          g
        );
      }
    },
    {
      startTime: null,
      duration: seconds(5), // TODO 2 seconds time, more display
      render: ({ x, length }) => {
        const g = scoreGroup.element.append("g");
        translate(x, pitchScale(0.5), g);

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
      }
    },
    {
      startTime: null,
      duration: seconds(45),
      render: ({ x, length }) => {
        const g = scoreGroup.element.append("g");
        translate(x, 0, g);

        // with excessive pressure and air
        translate(
          0,
          pitchScale(0.5),
          g
            .append("text")
            //.text("\ue61b")
            .text("\ue61d")
            .attr("dy", "-1em")
            .attr("class", "bravura")
        );

        // irregular tremolo
        translate(
          0,
          pitchScale(0.5),
          g
            .append("text")
            .text("\uE22B")
            .attr("dy", "-0.5em")
            .attr("class", "bravura")
        );

        // top line
        const line = lineBecomingAir(length, g);
        translate(0, pitchScale(0.5), line);

        const patches = translate(0, pitchScale(0.5), g.append("g"));
        [0.2, 0.4, 0.6].forEach(x => {
          noisePatch(x * length, length * 0.1, patches);
        });

        drawDynamics(
          splitDynamics("n"),
          length,
          translate(0, -50, g.append("g"))
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
        translate(0, pitchScale(0.25), bottomNoise);

        [0.2, 0.4, 0.6].forEach(x => {
          g.append("text") // TODO also add flag
            .text("\ue123")
            .attr("x", length * x)
            .attr("y", pitchScale(0.5 - x / 4))
            .attr("dy", "1em")
            .attr("class", "bravura");
        });

        drawDynamics(splitDynamics("p"), length, translate(0, 50, g.append("g")));
      }
    },
    {
      startTime: null,
      duration: seconds(120),
      render: ({ x, length }) => {
        const g = scoreGroup.element.append("g");
        translate(x, 0, g);

        // bottom line
        g.append("line")
          .attr("x1", 0)
          .attr("x2", length)
          .attr("y1", pitchScale(0.25))
          .attr("y2", pitchScale(0.25));

        // threads
        const makeThread = (x, y, length, selection) => {
          const group = translate(x, y, selection.append("g"));

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
      }
    },
    {
      startTime: null,
      duration: 0,
      render: ({ x }) => {
        // Double bar
        const g = scoreGroup.element.append("g");
        translate(x, 0, g);

        g.append("line")
          .attr("y1", 0)
          .attr("y2", pitchRange)
          .attr("stroke-width", 1);

        translate(
          3,
          0,
          g
            .append("line")
            .attr("y1", 0)
            .attr("y2", pitchRange)
            .attr("stroke-width", 2)
        );
      }
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
