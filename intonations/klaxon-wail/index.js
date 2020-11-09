(function () {
  'use strict';

  var startTimeFromDuration = (bar, i, score) => {
    // Calculate and set startTimes
    const startTime = score
      .slice(0, i)
      .reduce((sum, b, j) => sum + b.duration, 0);
    return { ...bar, startTime };
  };

  const seconds = (t) => t * 1000;

  const pitchRange = 87;

  function pitchScale(value) {
    return (1 - value) * pitchRange;
  }

  function translate(selection, x, y) {
    return selection.attr("transform", `translate(${x}, ${y})`);
  }

  function makePage (selection) {
    const page = selection.append("g");

    let _scale = 1;

    function scale(_) {
      _scale = _;
      page.attr("transform", `scale(${_scale})`);
    }

    return {
      element: page,
      scale,
    };
  }

  function makeVignetteScore () {
    const svg = d3.select("svg.main");

    const page = makePage(svg);

    return {
      svg,
      page,
    };
  }

  function resize(svg, wrapper, pitchRange) {
    return function () {
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

  function drawDynamics (data, scale, selection) {
    const g = selection.append("g");

    data.forEach((d) => {
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
          text.text(dynamics[d.value]).attr("class", "bravura").attr("dy", "2em");
          break;
        case "text":
          text.text(d.value).attr("class", "text-dynamic").attr("dy", "3.5em");
          break;
      }
    });

    return g;
  }

  // noise in the middle?

  const articulationGlyph = VS.dictionary.Bravura.articulations;
  const durationGlyph = VS.dictionary.Bravura.durations.stemless;

  const { svg, page } = makeVignetteScore();

  svg.append("style").text(`
  line { stroke: black }
  .bravura { font-family: 'Bravura'; font-size: 20px; }
  .text-dynamic {
    font-family: serif;
    font-size: 12px;
    font-style: italic;
  }
`);

  const wrapper = page.element;
  const group = (selection = wrapper) => selection.append("g");

  const line = (selection, length) => selection.append("line").attr("x2", length);
  const text = (selection, str) => selection.append("text").text(str);
  const bravura = (selection, str) =>
    text(selection, str).attr("class", "bravura");

  const dynamic = (selection, type, value) =>
    drawDynamics([{ type, value, x: 0 }], 0, selection);

  function wail(selection) {
    const g = group(selection).call(translate, 0, pitchScale(0.75));

    text(g, "wail").attr("dy", "1.66em").style("font-size", 10);
    //text(g, "growl/scream though instrument");
    //bravura(g, articulationGlyph[">"]);

    dynamic(g, "symbol", "f").call(translate, 0, -12);

    // long, periodic TODO how many seconds? how much rest?
    // TODO add line
    return g;
  }

  function alarm(selection) {
    // shorter, periodic
    // TODO how many seconds? how much rest?

    const g = group(selection).call(translate, 0, pitchScale(1));

    //text(g, "alarm").attr("dy", "1em");
    text(g, "0").attr("dy", "1em").style("font-size", 8);
    text(g, "2").attr("dy", "1em").attr("dx", 16).style("font-size", 8);
    bravura(g, durationGlyph[2]).attr("dy", "0.8em");
    bravura(g, durationGlyph[1]).attr("dy", "0.7em").attr("dx", 16);

    dynamic(g, "symbol", "mf").call(translate, 0, -12);

    return g;
  }

  function droneCluster(selection, length) {
    const g = group(selection).call(translate, 0, pitchScale(0.25));

    const p = [-2, -1, 0, 1, 2].sort(() => Math.random() - 0.5);

    line(g, length).call(translate, 0, p.pop());
    line(g, length).call(translate, 0, p.pop());
    line(g, length).call(translate, 0, p.pop());

    dynamic(g, "symbol", "mp").call(translate, 0, -24);

    return g;
  }

  const score = [
    {
      duration: 0,
      render: () => group(),
    },
    {
      duration: seconds(20),
      render: ({ length }) => {
        const g = group();

        alarm(g);
        // wail(g);
        droneCluster(g, length);

        return g;
      },
    },
    {
      duration: seconds(20),
      render: ({ length }) => {
        const g = group();

        alarm(g);
        wail(g);
        droneCluster(g, length);

        return g;
      },
    },
    {
      duration: seconds(20),
      render: ({ length }) => {
        const g = group();

        //alarm(g);
        wail(g);
        droneCluster(g, length);

        return g;
      },
    },
    {
      duration: 0,
      render: () => group(),
    },
  ]
    .map(startTimeFromDuration)
    .map((bar) => ({ ...bar, length: pitchRange }));

  function renderScore() {
    score.forEach((bar, i) => {
      const { render, ...data } = bar;
      render(data).attr("class", `frame frame-${i}`).style("opacity", 0);
    });
  }

  const showFrame = (i) => {
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
