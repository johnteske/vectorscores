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
  text.wip { fill: blue; }
  .bravura { font-family: 'Bravura'; font-size: 20px; }
  .text-dynamic {
    font-family: serif;
    font-size: 12px;
    font-style: italic;
  }
`);

const wrapper = scoreGroup.element;
const group = (selection = wrapper) => selection.append("g");

const text = (selection, str) => selection.append("text").text(str);
const bravura = (selection, str) =>
  text(selection, str).attr("class", "bravura");

const score = [
  {
    duration: 15000,
    render: ({ x, length }) => {
      const g = translate(group(), x, pitchScale(0.5));

      cue(g);

      longTone(g, 0, 0, length);
      bravura(g, articulationGlyph[">"]);
      text(g, "th");

      drawDynamics(
        [
          {
            type: "symbol",
            value: "mp",
            x: 0
          },
          {
            type: "text",
            value: "cres.",
            x: 0.5
          },
          {
            type: "symbol",
            value: "f",
            x: 1
          }
        ],
        length,
        g
      );
    }
  },
  {
    duration: 15000,
    render: ({ x }) => {
      const g = translate(group(), x, 0);

      cue(g);

      bravura(g, durationGlyph["0.5"]);
      bravura(g, articulationGlyph[">"]);
      text(g, "slap/snap"); // TODO bartok

      drawDynamics(
        [
          {
            type: "symbol",
            value: "ff",
            x: 0
          }
        ],
        length,
        g
      );
    }
  },
  {
    duration: 15000,
    render: ({ x }) => {
      const g = translate(group(), x, 0);

      // wet slaps:
      // tongue slap
      // col legno battuto

      // sloshing:
      // bow hair rotating?

      text(g, "wet slaps: tongue slap, col legno battuto, etc.");
      text(g, "sloshing: water sounds, bow hair rotating, etc.");

      text(
        g,
        "meandering lines: microtonal steps, larger skips (been slapped)"
      ); // TODO

      drawDynamics(
        [
          {
            type: "symbol",
            value: "p",
            x: 0
          }
        ],
        length,
        g
      );
    }
  },
  {
    duration: 0,
    render: ({ x }) => {
      const g = translate(group(), x, 0);
      doubleBar(g, pitchRange);
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
