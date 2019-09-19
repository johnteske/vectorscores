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

  const { svg, page } = makeVignetteScore();

  const wrapper = page.element;

  function phrase() {
    var notes = [{ pitch: 0, duration: 1 }, { pitch: 0, duration: 0 }];

    function addNote() {
      var dir = VS.getItem([-1, 1, -2, 2, -3, 3]);
      dir = dir * 2;
      notes.push({ pitch: 2 * dir, duration: 1 });
      notes.push({ pitch: 2 * dir, duration: 0 });
    }

    for (var i = 0; i < 8; i++) {
      addNote();
    }

    return notes;
  }

  function chant(selection, length) {
    var lineCloud = VS.lineCloud()
      .duration(10)
      .phrase(phrase())
      .curve(d3.curveLinear)
      .width(length)
      .height(pitchRange * 0.333);

    selection
      .call(lineCloud, { n: 2 })
      .attr("fill", "none")
      .attr("stroke", "black")
      .call(translate, 0, pitchScale(0.666))
      // line-cloud has issues, not to be solved now
      .select(".line-cloud-path:last-child")
      .remove();
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
