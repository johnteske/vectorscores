(function () {
  'use strict';

  function translate(x, y, selection) {
    return selection.attr("transform", `translate(${x}, ${y})`);
  }

  const bravura = selection =>
    selection.style("font-family", "'Bravura'").style("font-size", 20);

  function makePage(parent) {
    const page = parent.append("g");
    let center = null;

    function calculateCenter() {
      const width = parseInt(parent.style("width"), 10);
      center = width * 0.5;
      return center;
    }

    function getCenter() {
      return center;
    }

    function scrollTo(x, duration) {
      page
        .transition()
        .ease(d3.easeLinear)
        .duration(duration)
        .attr("transform", `translate(${center - x},0)`);
    }

    return {
      element: page,
      calculateCenter,
      getCenter,
      scrollTo
    };
  }

  function makeIndicator(selection) {
    // TODO from dirge,,march
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
            .call(bravura)
            .attr("dy", "2em");
          break;
        case "text":
          text
            .text(d.value)
            .attr("class", "text-dynamic")
            .style("font-family", "serif")
            .style("font-size", 12)
            .style("font-style", "italic")
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
      .attr("fill", "pink");
  }

  const durations = VS.dictionary.Bravura.durations.stemless;

  function longTone(selection, x, y, length) {
    const group = selection.append("g");

    group.attr("transform", `translate(${x}, ${y})`);

    group
      .append("text")
      .call(bravura)
      .text(durations[4]);

    group
      .append("line")
      .attr("x1", "0.5em")
      .attr("x2", length);

    return group;
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
  const page = makePage(svg);

  const scoreGroup = page.element.append("g");
  // scoreGroup.style("outline", "1px dotted red");
  translate(0, margin.top, scoreGroup);

  const indicator = makeIndicator(svg);

  // drone(scoreGroup); // TODO: how do these integrate with the ending

  const { articulations, dynamics: dynamics$1 } = VS.dictionary.Bravura;

  // const score = [
  let score = [
    {
      startTime: null,
      duration: seconds(60),
      render: ({ startTime, duration }) => {
        const startX = timeScale(startTime);
        const length = timeScale(duration);

        const g = longTone(scoreGroup, startX, pitchScale(0.5), length);

        g.append("text")
          .text(articulations[">"])
          .call(bravura)
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
          g
        );
      }
    },
    {
      startTime: null,
      duration: seconds(5),
      render: ({ startTime, duration }) => {
        const startX = timeScale(startTime);
        const length = timeScale(duration);

        const g = scoreGroup.append("g");
        translate(startX, pitchScale(0.5), g);

        // cluster
        g.append("text")
          .text("\ue123")
          .call(bravura);

        // caesura
        g.append("text")
          .text("\ue4d2")
          .call(bravura)
          .attr("x", length)
          .attr("text-anchor", "end");
      }
    },
    {
      startTime: null,
      duration: seconds(45),
      render: ({ startTime, duration }) => {
        const startX = timeScale(startTime);
        const length = timeScale(duration);

        const g = scoreGroup.append("g");
        translate(startX, 0, g);

        // start as sffz
        // with excessive pressure and air TODO
        // and also irregular tremolo TODO

        // top line
        const line = lineBecomingAir(length, g);
        translate(0, pitchScale(0.5), line);

        const patches = translate(0, pitchScale(0.5), g.append("g"));
        [0.2, 0.4, 0.6].forEach(x => {
          noisePatch(x * length, length * 0.1, patches);
        });

        drawDynamics(
          [
            {
              // TODO sfzmf?
              type: "symbol",
              value: "sfz",
              x: 0
            },
            {
              type: "symbol",
              value: "mf",
              x: 0.2
            },
            {
              type: "text",
              value: "decres.",
              x: 0.5
            },
            {
              type: "symbol",
              value: "n",
              x: 1
            }
          ],
          length,
          translate(0, -50, g.append("g"))
        );

        // bottom line
        g.append("line")
          .attr("x1", 0)
          .attr("x2", length)
          .attr("y1", pitchScale(0.5))
          .attr("y2", pitchScale(0.25)); // TODO curve and draw out, for more beating--also not a linear descent, meaning this should be a path, not a line

        const bottomNoise = noisePatch(length * 0.25, length, g);
        translate(0, pitchScale(0.25), bottomNoise);

        [0.2, 0.4, 0.6].forEach(x => {
          g.append("text") // TODO also add flag
            .text("\ue123")
            .attr("x", length * x)
            .attr("y", pitchScale(0.5 - x / 4))
            .attr("dy", "1em")
            .call(bravura);
        });

        drawDynamics(
          [
            {
              // TODO sfzmf?
              type: "symbol",
              value: "sfz",
              x: 0
            },
            {
              type: "symbol",
              value: "mf",
              x: 0.2
            },
            {
              type: "text",
              value: "decres.",
              x: 0.5
            },
            {
              type: "symbol",
              value: "p",
              x: 1
            }
          ],
          length,
          translate(0, 50, g.append("g"))
        );
      }
    },
    {
      startTime: null,
      duration: seconds(120),
      render: ({ startTime, duration }) => {
        const startX = timeScale(startTime);
        const length = timeScale(duration);

        const g = scoreGroup.append("g");
        translate(startX, 0, g);

        // bottom line
        g.append("line")
          .attr("x1", 0)
          .attr("x2", length)
          .attr("y1", pitchScale(0.25))
          .attr("y2", pitchScale(0.25));

        // threads
        for (let i = 0; i < 10; i++) {
          let halfLength = length * 0.5;
          let x = VS.getRandExcl(0, halfLength);
          let l = x + halfLength;
          let y = pitchScale(VS.getRandExcl(0, 1));
          g.append("line")
            .attr("x1", x)
            .attr("x2", l)
            .attr("y1", y)
            .attr("y2", y);
        }
      }
    },
    {
      startTime: null,
      duration: 0,
      render: () => {}
    }
  ];

  const startTimes = score.reduce(
    ({ sum, times }, bar) => {
      return {
        sum: sum + bar.duration,
        times: [...times, sum]
      };
    },
    { sum: 0, times: [] }
  ).times;

  score = score.map((bar, i) => {
    return { ...bar, startTime: startTimes[i] };
  });
  // .map((bar, i) => {
  //   // TODO each bar is set to the same duration during sketching
  //   // const length = 3000;
  //   const length = bar.duration * 1000;
  //   return { ...bar, duration: length, startTime: length * i };
  // });

  score.forEach((bar, i) => {
    const callback = i < score.length - 1 ? scrollToNextBar : null;
    VS.score.add(bar.startTime, callback, [i, bar.duration]);
  });

  function renderScore() {
    score.forEach(bar => {
      const { render, ...barData } = bar;
      render(barData);
    });
  }

  function setScorePosition() {
    const index = VS.score.getPointer();
    centerScoreByIndex(index, 0);
  }

  function centerScoreByIndex(index, duration) {
    const x = timeScale(score[index].startTime);
    page.scrollTo(x, duration);
  }

  function scrollToNextBar(index, duration) {
    centerScoreByIndex(index + 1, duration);
  }

  function resize() {
    const x = page.calculateCenter();

    // console.log(scoreGroupHeight);

    indicator.translateX(x);

    VS.score.isPlaying() && VS.score.pause();
    setScorePosition();
  }

  d3.select(window).on("resize", resize);
  let scoreGroupHeight; // TODO
  d3.select(window).on("load", () => {
    renderScore();
    scoreGroupHeight = scoreGroup.node().getBBox().height; // TODO
    resize();
    setScorePosition();
    // saveSvg(); // TODO add to info or setting modal
  });

  VS.control.hooks.add("stop", setScorePosition);
  VS.score.hooks.add("stop", setScorePosition);
  VS.control.hooks.add("step", setScorePosition);
  VS.control.hooks.add("pause", setScorePosition);

  // TODO include stylesheet or inline all styles
  // TODO serialize font?
  function saveSvg() {
    var svgXML = new XMLSerializer().serializeToString(svg.node());
    var encoded = encodeURI(svgXML);
    var dataURI = `data:image/svg+xml;utf8,${encoded}`;

    var dl = document.createElement("a");
    document.body.appendChild(dl); // This line makes it work in Firefox.
    dl.setAttribute("href", dataURI);
    dl.setAttribute("download", "test.svg");
    dl.click();
    dl.remove();
  }
  d3.select("#save-svg").on("click", saveSvg);

}());
