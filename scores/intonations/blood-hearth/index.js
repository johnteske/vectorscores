import longTone from "../longTone";
import { margin } from "../layout";
import { seconds, pitchRange, pitchScale } from "../scale";
import doubleBar from "../double-bar";
import cue from "../cue";
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
  .cluster .bravura {
    font-size: 16px;
  }
   .text-dynamic {
    font-family: serif;
    font-size: 12px;
    font-style: italic;
  }
  text {
    font-size: 10px;
  }
  .text-ensemble, .text-duration {
    font-size: 12px;
  }
`);

const wrapper = scoreGroup.element;
const group = () => wrapper.append("g");

const articulationGlyph = VS.dictionary.Bravura.articulations;
const durationGlyph = VS.dictionary.Bravura.durations.stemless;

const ensemble = (selection, str) =>
  selection
    .append("text")
    .text(str)
    .attr("dy", "-3em") // TODO
    .attr("class", "text-ensemble");

const dynamic = (selection, type, value, length) =>
  drawDynamics([{ type, value, x: 0 }], length, selection);

const cues = wrapper.append("g").call(translate, 0, -24);
const makeCue = (x, type) => cue(cues, type).attr("x", x);

const durations = translate(group(), 0, -12);
const makeDuration = (x, duration) =>
  durations
    .append("text")
    .text(`${duration / 1000}"`)
    .attr("x", x)
    .attr("class", "text-duration");

const score = [
  {
    duration: seconds(12),
    render: ({ x, length, duration }) => {
      const g = translate(wrapper.append("g"), x, pitchScale(0.5));

      makeDuration(x, duration);

      g.append("line").attr("x2", length).attr("class", "wip");

      ensemble(g, "solo");

      dynamic(g, "symbol", "pp", length);
    },
  },
  {
    duration: seconds(8),
    render: ({ x, length, duration }) => {
      const g = translate(wrapper.append("g"), x, pitchScale(0.5)).attr(
        "class",
        "cluster"
      );

      makeCue(x);
      makeDuration(x, duration);

      ensemble(g, "tutti");
      g.append("text").text("bell-like").attr("dy", "-2.5em");
      g.append("text").text("let vibrate").attr("dy", "-1.5em");

      g.append("text")
        .text(articulationGlyph[">"])
        .attr("class", "bravura")
        .attr("dy", "1.25em");

      g.append("text")
        .text(durationGlyph[1])
        .attr("class", "bravura")
        .attr("y", 10);

      g.append("text")
        .text(durationGlyph[1])
        .attr("class", "bravura")
        .attr("y", 4);

      g.append("text")
        .text(durationGlyph[1])
        .attr("class", "bravura")
        .attr("y", -4);

      g.append("text")
        .text(durationGlyph[1])
        .attr("class", "bravura")
        .attr("y", -10);

      dynamic(g, "symbol", "mf", length);
    },
  },
  {
    duration: seconds(36),
    render: ({ x, length, duration }) => {
      const g = translate(group(), x, pitchScale(0.5)).attr("class", "cluster");

      makeCue(x);
      makeDuration(x, duration);

      // g.append("text").text("tutti");

      // dissonant cluster, within an octave or octave and a half
      function cluster(selection, x, yOffset, length) {
        const relativePitches = [-6, -3, 0, 3].map((y) => 2 * y + yOffset);

        relativePitches.forEach((y) => {
          longTone(g, x, y, VS.getRandExcl(length, length * 1.5)); // up to 1.5x length // TODO set min bounds
        });
      }

      cluster(g, 0, 0, length);
      cluster(g, 9, 3, length);

      dynamic(g, "symbol", "mf", length);
    },
  },
  {
    // more open long tones
    // TODO give space around pitches/y values from previous bar?
    duration: seconds(64),
    render: ({ x, length, duration }) => {
      const g = translate(group(), x, 0);

      makeDuration(x, duration);

      for (let i = 0; i < 8; i++) {
        let y = pitchScale(Math.random());
        g.append("line")
          .attr("x1", VS.getRandExcl(0, length * 0.25))
          .attr("x2", VS.getRandExcl(length * 0.75, length))
          .attr("y1", y)
          .attr("y2", y)
          .attr("class", "wip");
      }
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
