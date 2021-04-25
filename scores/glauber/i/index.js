import { margin } from "../../intonations/layout";
import { seconds, pitchRange, pitchScale } from "../../intonations/scale";
import { translate } from "../../intonations/translate";
import startTimeFromDuration from "../../intonations/startTimeFromDuration";

// cue/blink module is a dependency
import makeScrollingScore from "../../intonations/scrolling-score";
import makeResize from "../../intonations/scroll-resize";
import makeScrollHelpers from "../../intonations/scroll-center";
import addHooks from "../../intonations/scroll-hooks";

import { generate } from "../sonata-form";
console.log(generate());

function timeScale(t) {
  return t / 200;
}

const durations = VS.dictionary.Bravura.durations.stemless;

//
const makePattern = (name, contentFn) => (selection) => {
  const p = selection
    .append("pattern")
    .attr("id", name)
    .attr("patternUnits", "userSpaceOnUse")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", pitchRange) // to make it square
    .attr("height", pitchRange);

  p.call(contentFn);
};

const patterns = [
  makePattern("test", (p) => {
    p.append("text")
      .text(durations[1])
      .style("font-family", "Bravura")
      .style("font-size", 8)
      .attr("dy", "1em");
  }),
  makePattern("test2", (p) => {
    p.append("text")
      .text(durations[0.5])
      .style("font-family", "Bravura")
      .style("font-size", 8)
      .attr("dy", "1em");
  }),
];
//

// TODO VS.score events should have at least 1 event
// the current render function expects duration => startTime => x, width
const score = [
  {
    duration: 5000,
    render: (g, data) => {
      g.append("rect")
        .attr("width", data.width)
        .attr("height", pitchRange)
        // outline for debugging
        .attr("stroke", "gray")
        .attr("vector-effect", "non-scaling-stroke")
        //
        .attr("fill", "url(#test)");
    },
  },
  {
    duration: 3000,
    render: (g, data) => {
      g.append("rect")
        .attr("width", data.width)
        .attr("height", pitchRange)
        // outline for debugging
        .attr("stroke", "gray")
        .attr("vector-effect", "non-scaling-stroke")
        //
        .attr("fill", "url(#test2)");
    },
  },
  {
    duration: 0,
  },
]
  .map(startTimeFromDuration)
  .map((bar) => ({
    ...bar,
    x: timeScale(bar.startTime),
    width: timeScale(bar.duration),
  }));

function renderScore(selection, score) {
  score.forEach((bar) => {
    const { render, ...data } = bar;
    if (render == null) {
      return;
    }
    const g = selection.append("g").call(translate, data.x, 0);
    render(g, data);
  });
}

//
//
//

const { svg, page, scoreGroup, indicator } = makeScrollingScore();

const { setScorePosition, scrollToNextBar } = makeScrollHelpers(
  scoreGroup,
  score.map((_) => _.x) // score x values
);

// this feels like scroll logic
// it currently only passes duration to scrollToNextBar
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
  // where to top-level things like this go
  const defs = svg.append("defs");
  patterns.forEach((p) => {
    defs.call(p);
  });

  renderScore(scoreGroup.element, score);
  resize();
});

// this preroll logic seems more related to the cue/blink than scroll
VS.score.preroll = seconds(3);
function prerollAnimateCue() {
  VS.score.schedule(0, indicator.blinker.start());
}
VS.control.hooks.add("play", prerollAnimateCue);
VS.WebSocket.hooks.add("play", prerollAnimateCue);

addHooks(setScorePosition);
