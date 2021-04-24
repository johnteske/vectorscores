import { margin } from "../../intonations/layout";
import { seconds, pitchRange, pitchScale } from "../../intonations/scale";
import { translate } from "../../intonations/translate";
import startTimeFromDuration from "../../intonations/startTimeFromDuration";

// cue/blink module is a dependency
import makeScrollingScore from "../../intonations/scrolling-score";
import makeResize from "../../intonations/scroll-resize";
import makeScrollHelpers from "../../intonations/scroll-center";
import addHooks from "../../intonations/scroll-hooks";

function timeScale(t) {
  return t / 200;
}

// TODO VS.score events should have at least 1 event
// the current render function expects duration => startTime => x, width
const score = [
  {
    duration: 5000,
    render: (g, data) => {
      g.append("rect").attr("width", data.width).attr("height", pitchRange);
      return g;
    },
  },
  {
    duration: 3000,
    render: (g, data) => {
      g.append("rect")
        .attr("fill", "red")
        .attr("width", data.width)
        .attr("height", pitchRange);
      return g;
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
