import longTone from "../longTone";
import { margin } from "../layout";
import { seconds, pitchRange, pitchScale } from "../scale";
import doubleBar from "../double-bar";
import makeCue from "../cue";
import drawDynamics from "../dynamics";
import startTimeFromDuration from "../startTimeFromDuration";
import { translate } from "../translate";
import makeScrollingScore from "../scrolling-score";
import makeResize from "../scroll-resize";
import makeScrollHelpers from "../scroll-center";
import addHooks from "../scroll-hooks";

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
const group = () => wrapper.append("g");

const articulationGlyph = VS.dictionary.Bravura.articulations;
const durationGlyph = VS.dictionary.Bravura.durations.stemless;

const dynamic = (selection, type, value, length) =>
  drawDynamics([{ type, value, x: 0 }], length, selection);

const score = [
  {
    duration: 15000,
    render: ({ x, length }) => {
      const g = translate(wrapper.append("g"), x, pitchScale(0.5));

      longTone(g, 0, 0, length);

      g.append("text").text("solo");

      dynamic(g, "symbol", "pp", length);
    }
  },
  {
    duration: 15000,
    render: ({ x, length }) => {
      const g = translate(wrapper.append("g"), x, pitchScale(0.5));

      makeCue(g);

      g.append("text").text("bell-like");
      g.append("text").text("tutti");
      g.append("text").text("let vibrate");

      g.append("text")
        .text(articulationGlyph[">"])
        .attr("class", "bravura wip")
        .attr("dy", "0.66em");

      g.append("text")
        .text(durationGlyph[1])
        .attr("class", "bravura wip")
        .attr("y", 5);

      g.append("text")
        .text(durationGlyph[1])
        .attr("class", "bravura wip")
        .attr("y", 2);

      g.append("text")
        .text(durationGlyph[1])
        .attr("class", "bravura wip")
        .attr("y", -2);

      g.append("text")
        .text(durationGlyph[1])
        .attr("class", "bravura wip")
        .attr("y", -5);

      dynamic(g, "symbol", "mf", length);
    }
  },
  // dissonant cluster, within an octave or octave and a half
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
