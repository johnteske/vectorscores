(function () {
  'use strict';

  var startTimeFromDuration = (bar, i, score) => {
    // Calculate and set startTimes
    const startTime = score
      .slice(0, i)
      .reduce((sum, b, j) => sum + b.duration, 0);
    return { ...bar, startTime };
  };

  const seconds = t => t * 1000;

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

  // add repeats to edges

  const articulationGlyph = VS.dictionary.Bravura.articulations;
  const durationGlyph = VS.dictionary.Bravura.durations.stemless;

  const { svg, page } = makeVignetteScore();

  svg.append("style").text(`
  line { stroke: black }
  .blood { fill: darkred; }
  text { font-size: 8px }
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
  const bloodText = (selection, str) =>
    text(selection, str).attr("class", "blood");
  const bravura = (selection, str) =>
    text(selection, str).attr("class", "bravura");

  const dynamic = (selection, type, value) =>
    drawDynamics([{ type, value, x: 0 }], 0, selection);

  // musicians move from supporting texture to attacks and return
  // control the density and rate of this balance of the piece

  function supportingTexture(selection, length) {
    const g = group(selection).call(translate, 0, pitchScale(0.25)); // TODO giving more room for other gestures
    //const g = group(selection).call(translate, 0, pitchScale(0.33));

    text(g, "open, consonant").attr("fill", "blue");

    // TODO map the pitches to prevent y overlaps
    for (let i = 0; i < 6; i++) {
      line(g, VS.getRandExcl(length * 0.25, length * 0.5)).call(
        translate,
        Math.random() * length * 0.25,
        VS.getItem([-7, -5, 0, 5, 7])
      );
    }

    dynamic(g, "symbol", "p").call(translate, 0, -24); //TODO
  }

  function cell(selection) {
    // TODO resize to bounding box
    return selection
      .append("rect")
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", "none")
      .attr("stroke", "black");
  }

  function flutter(selection) {
    const g = group(selection);

    cell(g);
    bravura(g, "\ue227").attr("x", 8);
    bravura(g, "\ue0b8")
      .attr("x", 5)
      .attr("dy", "0.5em");
    //bloodText(g, "delicate flutter").attr("dy", "1em");
    bloodText(g, "flutter")
      .attr("dy", "1em")
      .attr("text-anchor", "end");
    text(g, "1-3x")
      .attr("dy", "2em")
      .attr("text-anchor", "end"); // or show repeats?
    bravura(g, "\ue53f")
      .attr("x", 3)
      .attr("y", 20); // dim.
    //  drawDynamics(
    //    [
    //      // { type: "symbol", value: "p", x: 0 },
    //      { type: "text", value: "decres.", x: 0.5 },
    //      { type: "symbol", value: "n", x: 1 }
    //    ],
    //    length,
    //    g
    //  );
    return g;
  }
  function papercuts(selection) {
    // one to three times each phrase
    // metal scrape: sfz gliss up
    // other scrapes: nients cres., gliss up, end with accented release
    const g = group(selection);
    const length = 20;

    cell(g);
    bloodText(g, "papercut")
      .attr("dy", "1em")
      .attr("text-anchor", "end");
    text(g, "1-3x")
      .attr("dy", "2em")
      .attr("text-anchor", "end"); // or show repeats?

    // attack // TODO separate the attack and articulated release
    //  g.append("line")
    //    .attr("x2", length)
    //    .attr("y2", -10); //

    bravura(g, "\ue53e")
      .attr("x", 3)
      .attr("y", 20); // cres.
    //  drawDynamics(
    //    [
    //      { type: "symbol", value: "sfz", x: 0 },
    //      { type: "text", value: "decres.", x: 0.5 }
    //    ],
    //    length,
    //    g
    //  );

    // articulated release
    g.append("line")
      .attr("x1", 2)
      .attr("x2", length - 2)
      .attr("y1", 14)
      .attr("y2", 2);
    //  bravura(g, articulationGlyph[">"]);
    //  bravura(g, durationGlyph[0.5]);
    //  drawDynamics(
    //    [
    //      { type: "symbol", value: "n", x: 0 },
    //      { type: "text", value: "cres.", x: 0.5 }
    //    ],
    //    length,
    //    g
    //  );
    return g;
  }

  const score = [
    {
      duration: 0,
      render: () => group()
    },
    {
      duration: seconds(20),
      render: ({ length }) => {
        const g = group();

        // flutter(g);
        // papercuts(g);

        supportingTexture(g, length);
        return g;
      }
    },
    {
      duration: seconds(20),
      render: ({ length }) => {
        const g = group();

        flutter(g).call(translate, length * 0.5, 1);
        //     papercuts(g);

        supportingTexture(g, length);
        return g;
      }
    },
    {
      duration: seconds(20),
      render: ({ length }) => {
        const g = group();

        flutter(g).call(translate, length * 0.5, 1);
        papercuts(g).call(translate, length * 0.5, 23);

        supportingTexture(g, length);
        return g;
      }
    },
    {
      duration: seconds(20),
      render: ({ length }) => {
        const g = group();

        //flutter(g).call(translate, length * 0.5, 1);
        papercuts(g).call(translate, length * 0.5, 23);

        //supportingTexture(g, length);
        return g;
      }
    },
    {
      duration: 0,
      render: () => group()
    }
  ]
    .map(startTimeFromDuration)
    .map(bar => ({ ...bar, length: pitchRange }));

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
