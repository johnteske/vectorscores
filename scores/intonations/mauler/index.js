import addHooks from "../scroll-hooks";
import drawDynamics from "../dynamics";
import makeIndicator from "../indicator";
import makePage from "../page";
import cue from "../cue";
import makeScroll from "../scroll";
import startTimeFromDuration from "../startTimeFromDuration";
import translate from "../translate";

import sixteenths from "./sixteenths";
import { repeated } from "./sixteenths";
import tremoloLongTone from "./tremoloLongTone";

const durations = VS.dictionary.Bravura.durations.stemless;

const margin = {
  top: 64
};

const pitchRange = 87;
function pitchScale(value) {
  return (1 - value) * pitchRange;
}

function durationInBeats(beats) {
  const bpm = 120;
  return beats * (60 / bpm) * 1000;
}

function durationInSeconds(seconds) {
  return seconds * 1000;
}

function timeScale(t) {
  return t / 20;
}

function callTranslate(selection, x, y) {
  return translate(x, y, selection);
}

const bloodText = (selection, str) =>
  selection
    .append("text")
    .text(str)
    .attr("fill", "darkRed");

const svg = d3.select("svg.main");
svg.append("style").text(`
  text.wip { fill: blue }
  .bravura { font-family: 'Bravura'; font-size: 30px; }
`);

const page = makePage(svg);
// Create hidden line to ensure page fits margins
page.element
  .append("line")
  .attr("y1", 0)
  .attr("y2", margin.top + pitchRange + 32) // TODO
  //.attr("y2", margin.top + pitchRange + margin.top)
  .style("visibility", "hidden");

const scoreGroup = makeScroll(page.element);
scoreGroup.y(margin.top); // TODO allow chaining
const wrapper = scoreGroup.element;

//// TODO for alignment only
//wrapper
//  .append("line")
//  .attr("stroke", "red")
//  .attr("x1", -9999)
//  .attr("x2", 9999)
//  .attr("y1", pitchScale(0.5))
//  .attr("y2", pitchScale(0.5));

const indicator = makeIndicator(page.element);

const makeCue = selection => cue(selection).attr("y", -1 * pitchRange);

const score = [
  {
    startTime: null,
    duration: durationInBeats(3),
    render: ({ x, length }) => {
      const beatLength = length / 3;
      const g = translate(x, pitchScale(0.5), wrapper.append("g"));

      // 3/4 time signature
      g.append("text")
        .text("\uf58c")
        .attr("dx", "-1em")
        .attr("dy", "0.5em")
        .attr("class", "bravura");

      sixteenths(g).attr("transform", "scale(1)");

      g.append("text")
        .attr("class", "bravura")
        .attr("dx", "0.25em")
        .text("\ue4e6")
        .call(callTranslate, beatLength * 1, 0);

      g.append("text")
        .attr("class", "bravura")
        .text("\ue4e5")
        .call(callTranslate, beatLength * 2, 0);

      drawDynamics([{ x: 0, type: "symbol", value: "ff" }], length, g);

      makeCue(g);
    }
  },
  {
    startTime: null,
    duration: durationInSeconds(60),
    render: ({ x, length }) => {
      const g = translate(x, 0, wrapper.append("g"));
      // spike
      g.append("path").attr("d", `M-5,0 L5,0 L0,${pitchRange} Z`);
      // wall/tremolo--is it around the pitch center?

      bloodText(g, "MAUL").attr("dy", "-2em");

      g.append("text")
        .attr("dy", "-1em")
        .text("col legno, slapping");

      for (let i = 0; i < 25; i++) {
        translate(
          Math.random() * length * 0.25,
          Math.random() * pitchRange,
          tremoloLongTone(g)
        );
        translate(
          Math.random() * length * 0.25,
          Math.random() * pitchRange,
          repeated(g)
        );
        translate(
          Math.random() * length * 0.25,
          Math.random() * pitchRange,
          sixteenths(g)
        );
      }

      for (let i = 0; i < 25; i++) {
        translate(
          Math.random() * length,
          Math.random() * pitchRange,
          tremoloLongTone(g)
        );
        translate(
          Math.random() * length,
          Math.random() * pitchRange,
          sixteenths(g)
        );
      }

      const makeThread = (x, y, length, selection) => {
        selection
          .append("line")
          .attr("stroke", "darkred")
          .attr("x1", x)
          .attr("x2", x + length * 0.5)
          .attr("y1", y - 1)
          .attr("y2", y - 1);

        selection
          .append("line")
          .attr("stroke", "black")
          .attr("x1", x + length * 0.5)
          .attr("x2", x + length)
          .attr("y1", y)
          .attr("y2", y);
      };

      for (let i = 0; i < 10; i++) {
        let x = VS.getRandExcl(0.25, 0.5) * length;
        let y = pitchScale(VS.getRandExcl(0, 1));
        makeThread(x, y, length * 0.5, g);
      }

      bloodText(g, "weep")
        .attr("dy", "-2em")
        .attr("x", length * 0.25);

      translate(
        0,
        pitchScale(0.5),

        drawDynamics(
          [
            { x: 0, type: "symbol", value: "sffz" },
            { x: 0.5, type: "text", value: "decres." },
            { x: 1, type: "symbol", value: "mp" }
          ],
          length,
          g
        )
      );

      translate(0, pitchScale(0.5), makeCue(g));
    }
  },
  {
    startTime: 0,
    duration: 0,
    render: () => {}
  }
].map(startTimeFromDuration);

score.forEach((bar, i) => {
  const callback = i < score.length - 1 ? scrollToNextBar : null;
  VS.score.add(bar.startTime, callback, [i, bar.duration]);
});

function renderScore() {
  score.forEach(bar => {
    const { render, ...meta } = bar;
    const renderData = {
      x: timeScale(bar.startTime),
      length: timeScale(bar.duration)
    };
    render({ ...meta, ...renderData });
  });
}

function setScorePosition() {
  const index = VS.score.getPointer();
  centerScoreByIndex(index, 0);
}

function centerScoreByIndex(index, duration) {
  const x = timeScale(score[index].startTime);
  scoreGroup.scrollTo(x, duration);
}

function scrollToNextBar(index, duration) {
  centerScoreByIndex(index + 1, duration);
}

function resize() {
  VS.score.isPlaying() && VS.score.pause();

  const w = parseInt(svg.style("width"), 10);
  const h = parseInt(svg.style("height"), 10);

  const scale = h / (64 + 87 + 64);
  page.scale(scale);

  const center = (w / scale) * 0.5;
  indicator.translateX(center);
  scoreGroup.setCenter(center);
  setScorePosition();
}

d3.select(window).on("resize", resize);

d3.select(window).on("load", () => {
  renderScore();
  resize();
});

addHooks(setScorePosition);

VS.WebSocket.connect();
