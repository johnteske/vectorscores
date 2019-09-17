(function () {
  'use strict';

  var startTimeFromDuration = (bar, i, score) => {
    // Calculate and set startTimes
    const startTime = score
      .slice(0, i)
      .reduce((sum, b, j) => sum + b.duration, 0);
    return { ...bar, startTime };
  };

  const pitchRange = 87;

  function pitchScale(value) {
    return (1 - value) * pitchRange;
  }

  function translate(selection, x, y) {
    return selection.attr("transform", `translate(${x}, ${y})`);
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

  function makeVignetteScore() {
    const svg = d3.select("svg.main");

    const page = makePage(svg);

    return {
      svg,
      page
    };
  }

  function resize(svg, wrapper, pitchRange) {
    return function() {
      const w = parseInt(svg.style("width"), 10);
      const h = parseInt(svg.style("height"), 10);

      const scaleX = w / pitchRange;
      const scaleY = h / pitchRange;
      const scale = Math.min(scaleX, scaleY);

      const leftMargin = w * 0.5 - pitchRange * 0.5 * scale;
      const topMargin = h * 0.5 - pitchRange * 0.5 * scale;

      wrapper.attr(
        "transform",
        `translate(${leftMargin}, ${topMargin}) scale(${scale})`
      );
    };
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

  const { svg, page } = makeVignetteScore();

  svg.append("style").text(`
  .bravura { font-family: 'Bravura'; font-size: 20px; }
  .text-dynamic {
    font-family: serif;
    font-size: 12px;
    font-style: italic;
  }
`);

  const wrapper = page.element;

  const text = (selection, str) => selection.append("text").text(str);

  function makeFrame(selection) {
    return selection
      .append("rect")
      .attr("width", pitchRange)
      .attr("height", pitchRange)
      .attr("fill", "none")
      .attr("stroke", "blue");
  }

  function textureOfBones(selection) {
    const g = selection.append("g").attr("fill", "darkRed");

    // TODO these could be animated to emphasize the crushing
    for (let i = 0; i < 66; i++) {
      g.append("text")
        .text("\u2620")
        .attr("x", pitchScale(Math.random() * 1))
        .attr("y", pitchScale(Math.random() * 0.25));
    }

    g.append("text")
      .text("crushing bones")
      .attr("dy", "1em")
      .attr("fill", "black");

    drawDynamics(
      [
        {
          type: "symbol",
          value: "mf",
          x: 0
        }
      ],
      0,
      g
    ).attr("fill", "black");

    return g;
  }

  // high, cheerful, taunting
  // solo
  // TODO also needs bounding box
  const boneFlutePhraseGenerator = pathAlongPath(d3.curveBasis, d3.curveBasis);
  // take the easy path
  // take comfort in the release
  // it can be so easy
  // it can be so simple
  // it's the right thing to do
  // it's the right thing for everyone

  function boneFlute(selection) {
    const g = selection.append("g");

    boneFlutePhraseGenerator(
      [{ x: 0, y: 0 }, { x: pitchRange * 0.5, y: 20 }, { x: pitchRange, y: 10 }],
      [...new Array(10)],
      (point, i, x, y) => ({ x, y: y + VS.getRandExcl(-5, 5) }),
      g
    );

    text(g, "it can be so easy")
      .attr("dy", "1em")
      .attr("fill", "darkred");

    drawDynamics(
      [
        {
          type: "symbol",
          value: "f",
          x: 0
        }
      ],
      0,
      g
    ).attr("fill", "black");

    return g;
  }

  function drone(selection) {
    const g = selection.append("g");

    // mid-range drones
    translate(g.append("line"), 0, pitchScale(0.5))
      .attr("x2", pitchRange)
      .attr("stroke", "black");
    drawDynamics(
      [
        {
          type: "symbol",
          value: "mf",
          x: 0
        }
      ],
      0,
      g
    ).attr("fill", "black");

    return g;
  }

  const score = [
    {
      duration: 0,
      render: () => {
        return wrapper.append("g");
      }
    },
    {
      duration: 15000,
      render: () => {
        const g = wrapper.append("g");
        makeFrame(g);
        boneFlute(g);
        drone(g);
        textureOfBones(g);
        return g;
      }
    },
    {
      duration: 15000,
      render: () => {
        const g = wrapper.append("g");
        makeFrame(g);
        boneFlute(g);
        drone(g);
        textureOfBones(g);
        return g;
      }
    },
    {
      duration: 0,
      render: () => {
        return wrapper.append("g");
      }
    }
  ].map(startTimeFromDuration);

  function renderScore() {
    score.forEach((bar, i) => {
      const { render, ...data } = bar;
      render(data)
        .attr("class", `frame frame-${i}`)
        .style("opacity", 0);
    });
  }

  const showFrame = i => {
    d3.selectAll(".frame").style("opacity", 0);
    d3.selectAll(`.frame-${i}`).style("opacity", 1);
  };

  score.forEach((bar, i) => {
    const callback = () => {
      showFrame(i);
    };
    VS.score.add(bar.startTime, callback, [i, bar.duration]);
  });

  const resize$1 = resize(svg, wrapper, pitchRange);

  d3.select(window).on("resize", resize$1);

  d3.select(window).on("load", () => {
    renderScore();
    showFrame(0);
    resize$1();
  });

  const showFrameAtPointer = () => {
    const index = VS.score.getPointer();
    showFrame(index);
  };

  VS.control.hooks.add("step", showFrameAtPointer);
  VS.WebSocket.hooks.add("step", showFrameAtPointer);

  VS.control.hooks.add("pause", showFrameAtPointer);
  VS.WebSocket.hooks.add("pause", showFrameAtPointer);

  VS.score.hooks.add("stop", showFrameAtPointer);

  VS.WebSocket.connect();

}());
