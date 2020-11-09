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

  const { svg, page } = makeVignetteScore();

  const wrapper = page.element;
  const group = (selection = wrapper) => selection.append("g");
  const text = (selection, str) =>
    selection
      .append("text")
      .text(str)
      .style("font-size", "monospace")
      .style("font-size", 20);

  //

  VS.scoreOptions.add(
    "pitchClasses",
    { "pitch-classes": "numbers", prefer: "te" },
    new VS.PitchClassSettings()
  );
  VS.scoreOptions.add("transposition", 0, new VS.NumberSetting("transposition"));

  var scoreOptions = VS.scoreOptions.setFromQueryString();

  // TODO working with old property names in score, for now
  scoreOptions.pitchClasses.display = scoreOptions.pitchClasses["pitch-classes"];
  scoreOptions.pitchClasses.preference = scoreOptions.pitchClasses["prefer"];

  // TODO should coerce internally
  scoreOptions.transposition = +scoreOptions.transposition;

  //

  const transposeSet = (set) =>
    VS.pitchClass.transpose(set, scoreOptions.transposition);

  const formatSet = (set) => {
    const formatted = set.map((pc) =>
      VS.pitchClass.format(
        pc,
        scoreOptions.pitchClasses.display,
        scoreOptions.pitchClasses.preference
      )
    );

    return "{" + formatted.join(",") + "}";
  };
  //

  const pitchClassSequence = [
    // TODO add empty start
    [[2], [], [], []],
    [[2], [0], [], []],
    [[2], [0], [5], []],
    [[0, 2, 5], [0], [5], [2]],
    [[0, 2, 7], [2, 5, 7], [5], [2]],
    [[0, 2, 5], [2, 5, 9], [5, 7, 9], [2]],
    // A
    [
      [11, 7, 9],
      [2, 5, 7],
      [11, 5, 9],
      [0, 2, 7],
    ],
    [
      [11, 1, 5],
      [1, 2, 9],
      [5, 7, 9],
      [0, 2, 7],
    ],
    [
      [11, 7, 9],
      [0, 5, 6],
      [1, 2, 6],
      [1, 5, 7],
    ],
    [
      [0, 1, 4],
      [2, 6, 7],
      [11, 4, 5],
      [1, 7, 9],
    ],
    [
      [0, 2, 3],
      [1, 2, 5],
      [11, 6, 7],
      [3, 4, 9],
    ],
    [
      [1, 4, 5],
      [11, 0, 2],
      [6, 7, 8],
      [3, 8, 9],
    ],
    [
      [7, 8, 9],
      [1, 4, 5],
      [3, 6, 10],
      [11, 0, 2],
    ],
    // B
    [
      [6, 7, 8],
      [11, 0, 2],
      [1, 4, 5],
      [3, 8, 9],
    ],
    [
      [11, 6, 7],
      [1, 2, 5],
      [0, 2, 3],
      [3, 4, 9],
    ],
    [
      [11, 4, 5],
      [2, 6, 7],
      [0, 1, 4],
      [1, 7, 9],
    ],
    [
      [1, 2, 6],
      [0, 5, 6],
      [11, 7, 9],
      [1, 5, 7],
    ],
    [
      [5, 7, 9],
      [1, 2, 9],
      [11, 1, 5],
      [0, 2, 7],
    ],
    [
      [11, 5, 9],
      [2, 5, 7],
      [11, 7, 9],
      [0, 2, 7],
    ],
    // C
    [[5, 7, 9], [2, 7, 9], [0, 2, 5], [2]],
    [[5], [2, 5, 7], [0, 2, 7], [2]],
    [[5], [0], [0, 2, 5], [2]],
    [[5], [0], [2], []],
    [[], [0], [2], []],
    [[], [], [2], []],
    // TODO add empty end
  ];

  const emptyBar = { duration: 0, render: () => group() };

  const score = [
    emptyBar,
    ...pitchClassSequence.map((staves) => ({
      duration: seconds(20),
      render: () => {
        const g = group(); // .call(translate, 0, pitchScale(0.5));

        staves.forEach((pitchClasses, i) => {
          text(g, formatSet(transposeSet(pitchClasses))).attr("dy", `${i + 1}em`);
        });

        return g;
      },
    })),
    emptyBar,
  ].map(startTimeFromDuration);

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
