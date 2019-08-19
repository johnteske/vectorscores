(function () {
  'use strict';

  function translate(x, y, selection) {
    return selection.attr("transform", `translate(${x}, ${y})`);
  }

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
    const indicator = selection
      .append("line")
      .attr("y1", 0)
      .attr("y2", 100);

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
      .attr("d", d => console.log(d) || lineGenerator(d));
  }

  const margin = {
    top: 100
  };

  function timeScale(t) {
    return t / 20; // TODO
  }

  const svg = d3.select("svg.main");
  const page = makePage(svg);

  const scoreGroup = page.element.append("g");
  translate(0, margin.top, scoreGroup);

  const indicator = makeIndicator(svg);
  indicator.translateY(margin.top - 50);

  // drone(scoreGroup); // TODO: how do these integrate with the ending

  const { articulations, dynamics: dynamics$1 } = VS.dictionary.Bravura;

  const score = [
    {
      startTime: null,
      duration: null,
      render: ({ startTime, duration }) => {
        const startX = timeScale(startTime);
        const length = timeScale(duration);

        const g = longTone(scoreGroup, startX, 0, length);

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
      duration: null,
      render: ({ startTime, duration }) => {
        const startX = timeScale(startTime);
        const length = timeScale(duration);

        const g = scoreGroup.append("g");
        translate(startX, 0, g);

        // cluster
        g.append("text")
          .text("\ue123")
          .attr("class", "bravura");

        // caesura
        g.append("text")
          .text("\ue4d2")
          .attr("class", "bravura")
          .attr("x", length)
          .attr("text-anchor", "end");
      }
    },
    {
      startTime: null,
      duration: null,
      render: ({ startTime, duration }) => {
        const startX = timeScale(startTime);
        const length = timeScale(duration);

        const g = scoreGroup.append("g");

        translate(startX, 0, g);

        // start as sffz
        // with excessive pressure and air TODO
        // and also irregular tremolo TODO

        // top line
        lineBecomingAir(length, g);
        g.append("text")
          .text("becoming airy, three noisy patches")
          .attr("dy", "-2em");
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
          .attr("y2", 50); // TODO curve and draw out, for more beating--also not a linear descent, meaning this should be a path, not a line
        g.append("text")
          .text("texture, three cluster hits")
          .attr("y", 50)
          .attr("dy", "2em");
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
      duration: null,
      render: ({ startTime, duration }) => {
        const startX = timeScale(startTime);
        const length = timeScale(duration);

        const g = scoreGroup.append("g");

        translate(startX, 0, g);

        // bottom line
        g.append("line")
          .attr("x1", 0)
          .attr("x2", length)
          .attr("y1", 50)
          .attr("y2", 50);

        // threads
        for (let i = 0; i < 10; i++) {
          let halfLength = length * 0.5;
          let x = Math.random() * halfLength;
          let l = x + halfLength;
          let y = Math.random() * 50;
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
      duration: null,
      render: () => {}
    }
  ].map((bar, i) => {
    // TODO each bar is set to the same duration during sketching
    const length = 3000;
    return { ...bar, duration: length, startTime: length * i };
  });

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

    indicator.translateX(x);

    VS.score.isPlaying() && VS.score.pause();
    setScorePosition();
  }

  d3.select(window).on("resize", resize);
  d3.select(window).on("load", () => {
    resize();
    setScorePosition();
    renderScore();
  });

  VS.control.hooks.add("stop", setScorePosition);
  VS.score.hooks.add("stop", setScorePosition);
  VS.control.hooks.add("step", setScorePosition);
  VS.control.hooks.add("pause", setScorePosition);

}());
