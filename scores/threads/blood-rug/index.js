import { margin } from "../layout";
import { seconds, pitchRange, pitchScale } from "../scale";
import doubleBar from "../double-bar";
import cue from "../cue";
// import drawDynamics from "../dynamics";
import startTimeFromDuration from "../startTimeFromDuration";
import translate from "../translate";
import makeScrollingScore from "../scrolling-score";
import makeResize from "../scroll-resize";
import makeScrollHelpers from "../scroll-center";
import addHooks from "../scroll-hooks";

function timeScale(t) {
  return t / 200;
}

const { svg, page, scoreGroup, indicator } = makeScrollingScore();
const wrapper = scoreGroup.element;

const score = [
  // small, single note
  // accented "ding", like a bell--maybe a split chord, l.v.
  // dissonant cluster, within an octave or octave and a half
  {
    duration: 5000,
    render: () => {}
  },
  {
    duration: 0,
    render: ({ x }) => {
      doubleBar(wrapper, pitchRange);
    }
  }
].map(startTimeFromDuration);

const scoreWithRenderData = score.map(bar => {
  return {
    ...bar,
    x: timeScale(bar.startTime),
    length: timeScale(bar.duration)
  };
});

const { setScorePosition, scrollToNextBar } = makeScrollHelpers(
  scoreGroup,
  scoreWithRenderData.map(bar => bar.x)
);

score.forEach((bar, i) => {
  const callback = i < score.length - 1 ? scrollToNextBar : null;
  VS.score.add(bar.startTime, callback, [i, bar.duration]);
});

function renderScore() {
  scoreWithRenderData.forEach(bar => {
    const { render, ...data } = bar;
    render(data);
  });
}

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
  renderScore();
  resize();
});

addHooks(setScorePosition);

VS.WebSocket.connect();
