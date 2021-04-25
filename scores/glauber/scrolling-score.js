import { margin } from "../intonations/layout";
import { seconds, pitchRange } from "../intonations/scale";

// cue/blink module is a dependency
import makeScrollingScore from "../intonations/scrolling-score";
import makeResize from "../intonations/scroll-resize";
import makeScrollHelpers from "../intonations/scroll-center";
import addHooks from "../intonations/scroll-hooks";

export function render(renderFn, score) {
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
    renderFn(svg, scoreGroup.element, score);
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
}
