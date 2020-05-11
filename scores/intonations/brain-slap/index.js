import { margin } from "../layout";
import { seconds, pitchRange, pitchScale } from "../scale";
import doubleBar from "../double-bar";
import cue from "../cue";
import longTone from "../longTone";
import drawDynamics from "../dynamics";
import startTimeFromDuration from "../startTimeFromDuration";
import { translate } from "../translate";
import makeScrollingScore from "../scrolling-score";
import makeResize from "../scroll-resize";
import makeScrollHelpers from "../scroll-center";
import addHooks from "../scroll-hooks";

const articulationGlyph = VS.dictionary.Bravura.articulations;
const durationGlyph = VS.dictionary.Bravura.durations.stemless;

function timeScale(t) {
  return t / 200;
}

const { svg, page, scoreGroup, indicator } = makeScrollingScore();

svg.append("style").text(`
  line { stroke: black; }
  line.wip { stroke: blue; }
  text {
    font-size: 10px;
  }
  text.wip { fill: blue; }
  .bravura { font-family: 'Bravura'; font-size: 20px; }
  .text-dynamic {
    font-family: serif;
    font-size: 12px;
    font-style: italic;
  }
  .text-duration {
    font-size: 12px;
  }
`);

const wrapper = scoreGroup.element;
const group = (selection = wrapper) => selection.append("g");

const cues = wrapper.append("g");
const makeCue = (x, type) => cue(cues, type).attr("x", x);

const text = (selection, str) => selection.append("text").text(str);
const wip = (selection, str) => text(selection, str).attr("class", "wip");
const bravura = (selection, str) =>
  text(selection, str).attr("class", "bravura");

const durations = translate(group(), 0, -24);
const makeDuration = (x, duration) =>
  durations
    .append("text")
    .text(`${duration / 1000}"`)
    .attr("x", x)
    .attr("class", "text-duration");

const score = [
  {
    duration: seconds(30),
    render: ({ x, length, duration }) => {
      const g = translate(group(), x, pitchScale(0.5));

      makeCue(x);
      makeDuration(x, duration);

      longTone(g, 0, 0, length);
      bravura(g, articulationGlyph[">"]).attr("dy", "0.5em");
      wip(g, '"th"').attr("dy", "2em");

      drawDynamics(
        [
          {
            type: "symbol",
            value: "mp",
            x: 0,
          },
          {
            type: "text",
            value: "cres.",
            x: 0.5,
          },
        ],
        length,
        g
      );
    },
  },
  {
    duration: seconds(3),
    render: ({ x, duration }) => {
      const g = translate(group(), x, pitchScale(0.5));

      makeCue(x);
      makeDuration(x, duration);

      bravura(g, durationGlyph["0.5"]).attr("dy", "-0.666em");
      bravura(g, articulationGlyph[">"]).attr("dy", "0.5em");
      bravura(g, articulationGlyph["bartok"]).attr("dy", "-1em");

      drawDynamics(
        [
          {
            type: "symbol",
            value: "ff",
            x: 0,
          },
        ],
        length,
        g
      );
    },
  },
  {
    duration: seconds(60),
    render: ({ x, duration }) => {
      const g = translate(group(), x, 0);

      makeDuration(x, duration);

      // wet slaps:
      // tongue slap
      // col legno battuto

      // sloshing:
      // bow hair rotating?

      wip(g, "wet slaps: tongue slap, col legno battuto)").attr("dy", "1em");
      wip(g, "sloshing: water sounds, bow hair rotating)").attr("dy", "2em");
      wip(g, "meandering lines (microtonal steps, larger skips/got slapped)")
        //TODO show
        .attr("dy", "3em");

      drawDynamics(
        [
          {
            type: "symbol",
            value: "p",
            x: 0,
          },
        ],
        length,
        g
      ).call(translate, 0, 20);
    },
  },
  {
    duration: 0,
    render: ({ x }) => {
      const g = translate(group(), x, 0);
      doubleBar(g, pitchRange);
    },
  },
].map(startTimeFromDuration);

const scoreWithRenderData = score.map((bar) => {
  return {
    ...bar,
    x: timeScale(bar.startTime),
    length: timeScale(bar.duration),
  };
});

const { setScorePosition, scrollToNextBar } = makeScrollHelpers(
  scoreGroup,
  scoreWithRenderData.map((bar) => bar.x)
);

score.forEach((bar, i) => {
  const callback = i < score.length - 1 ? scrollToNextBar : null;
  VS.score.add(bar.startTime, callback, [i, bar.duration]);
});

function renderScore() {
  scoreWithRenderData.forEach((bar) => {
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

VS.score.preroll = seconds(3);
function prerollAnimateCue() {
  VS.score.schedule(0, indicator.blinker.start());
}
VS.control.hooks.add("play", prerollAnimateCue);
VS.WebSocket.hooks.add("play", prerollAnimateCue);

addHooks(setScorePosition);

VS.WebSocket.connect();
