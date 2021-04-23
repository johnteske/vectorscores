import { margin } from "../../intonations/layout";
import { seconds, pitchRange, pitchScale } from "../../intonations/scale";

// cue/blink module is a dependency
import makeScrollingScore from "../../intonations/scrolling-score";
import makeResize from "../../intonations/scroll-resize";
import makeScrollHelpers from "../../intonations/scroll-center";
import addHooks from "../../intonations/scroll-hooks";

//TODO VS.score events should have at least 1 event
const score = [1, 2, 3];

const { svg, page, scoreGroup, indicator } = makeScrollingScore();

const { setScorePosition, scrollToNextBar } = makeScrollHelpers(
  scoreGroup,
  score.map((_) => _) // score x values
);

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
  console.log("todo");
  //  renderScore();
  resize();
});

VS.score.preroll = seconds(3);
function prerollAnimateCue() {
  VS.score.schedule(0, indicator.blinker.start());
}
VS.control.hooks.add("play", prerollAnimateCue);
VS.WebSocket.hooks.add("play", prerollAnimateCue);

addHooks(setScorePosition);
