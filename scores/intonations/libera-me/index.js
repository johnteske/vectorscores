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

  const lcg = seed => () =>
    ((seed = Math.imul(741103597, seed)) >>> 0) / 2 ** 32;

  const { svg, page } = makeVignetteScore();

  const wrapper = page.element;

  const prng = lcg(1234);

  const steps = [-1, 1, -2, 2, -3, 3];

  function phrase() {
    let notes = [{ pitch: 0, duration: 1 }];

    function addNote() {
      const pitch = Math.floor(prng() * steps.length) * 2;
      notes.push({ pitch, duration: 1 });
    }

    for (let i = 0; i < 8; i++) {
      addNote();
    }

    return notes;
  }

  const lineGen = d3
    .line()
    .x(d => d.x)
    .y(d => d.y);

  function chant(selection, length) {
    const notes = phrase();
    const points = notes.reduce(
      (acc, note) => {
        const t = acc.t + note.duration;
        return {
          t,
          points: [
            ...acc.points,
            { x: acc.t, y: note.pitch },
            { x: t, y: note.pitch }
          ]
        };
      },
      { t: 0, points: [] }
    ).points;
    const xScale = length / notes.length;
    const scaledPoints = points.map(({ x, y }) => ({ x: x * xScale, y }));

    selection
      .append("path")
      .attr("d", lineGen(scaledPoints))
      .attr("fill", "none")
      .attr("stroke", "black")
      .call(translate, 0, pitchScale(0.5));

    return selection;
  }

  const group = (selection = wrapper) => selection.append("g");
  const phraseLength = seconds(20);

  const score = [
    {
      duration: 0,
      render: () => group()
    },
    {
      duration: phraseLength,
      render: ({ length }) => {
        const g = wrapper.append("g");
        chant(g, length);
        return g;
      }
    },
    {
      duration: phraseLength,
      render: ({ length }) => {
        const g = wrapper.append("g");
        chant(g, length);
        return g;
      }
    },
    {
      duration: phraseLength,
      render: ({ length }) => {
        const g = wrapper.append("g");
        chant(g, length);
        return g;
      }
    },
    {
      duration: phraseLength,
      render: ({ length }) => {
        const g = wrapper.append("g");
        chant(g, length);
        return g;
      }
    },
    {
      duration: phraseLength,
      render: ({ length }) => {
        const g = wrapper.append("g");
        chant(g, length);
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
