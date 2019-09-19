// sixteenths are not proportional to real time
import { seconds, pitchRange, pitchScale } from "../scale";
import longTone from "../longTone";
import addHooks from "../scroll-hooks";
import drawDynamics from "../dynamics";
import makeIndicator from "../indicator";
import makePage from "../page";
import cue from "../cue";
import makeScroll from "../scroll";
import startTimeFromDuration from "../startTimeFromDuration";
import translate from "../translate";

import sixteenths from "./sixteenths";
import { variations } from "./sixteenths";
import tremoloLongTone from "./tremoloLongTone";
import maul from "./maul";

const durations = VS.dictionary.Bravura.durations.stemless;

const margin = {
  top: 64
};

function durationInBeats(beats) {
  const bpm = 140;
  return beats * (60 / bpm) * 1000;
}

function timeScale(t) {
  return t / 20;
}

function callTranslate(selection, x, y) {
  return translate(x, y, selection);
}

const dynamic = (selection, type, value) =>
  drawDynamics([{ type, value, x: 0 }], 0, selection);

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

const scoreGroup = makeScroll(page.element);
scoreGroup.y(margin.top); // TODO allow chaining
const wrapper = scoreGroup.element;

const indicator = makeIndicator(page.element);
indicator.blinker = indicator.blinker
  .interval(durationInBeats(1))
  .offDuration(durationInBeats(0.5));

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

      dynamic(g, "symbol", "ff");

      makeCue(g);
    }
  },
  {
    startTime: null,
    duration: seconds(0.25), // TODO
    render: ({ x, length }) => {
      const g = translate(x, 0, wrapper.append("g"));

      // spike
      g.append("path").attr("d", `M-5,0 L5,0 L0,${pitchRange} Z`);
      translate(0, pitchScale(0.5), dynamic(g, "symbol", "sffz"));

      maul(g, 87, pitchRange);

      translate(0, pitchScale(0.5), makeCue(g));
    }
  },
  {
    startTime: null,
    duration: seconds(60),
    render: ({ x, length }) => {
      const g = translate(x, 0, wrapper.append("g"));

      bloodText(g, "MAUL").attr("dy", "-2em");

      g.append("text")
        .attr("dy", "-1em")
        .text("col legno, slapping");

      for (let i = 0; i < 25; i++) {
        translate(
          Math.random() * length * 0.25,
          Math.random() * pitchRange,
          tremoloLongTone(g, timeScale(seconds(3)))
        );
        translate(
          Math.random() * length * 0.25,
          Math.random() * pitchRange,
          variations(g)
        );
        translate(
          Math.random() * length * 0.25,
          Math.random() * pitchRange,
          variations(g)
        );
      }

      for (let i = 0; i < 25; i++) {
        translate(
          Math.random() * length,
          Math.random() * pitchRange,
          tremoloLongTone(g, timeScale(seconds(3)))
        );
        translate(
          Math.random() * length,
          Math.random() * pitchRange,
          variations(g)
        );
      }

      for (let i = 0; i < 25; i++) {
        longTone(
          g,
          VS.getRandExcl(length * 0.75, length),
          Math.random() * pitchRange,
          timeScale(5000)
        ).attr("stroke", "black");
      }

      translate(
        0,
        pitchScale(0.5),

        drawDynamics([{ x: 0.5, type: "text", value: "decres." }], length, g)
      );
    }
  },
  {
    startTime: null,
    duration: seconds(60),
    render: ({ x, length }) => {
      const g = translate(x, 0, wrapper.append("g"));

      const makeThread = (x, y, selection) => {
        const x2 = x + timeScale(seconds(3));

        selection
          .append("line")
          .attr("stroke", "darkred")
          .attr("x1", x)
          .attr("x2", x2)
          .attr("y1", y - 1)
          .attr("y2", y - 1);

        selection
          .append("line")
          .attr("stroke", "black")
          .attr("x1", x2)
          .attr("x2", x2 + timeScale(seconds(1)))
          .attr("y1", y)
          .attr("y2", y);
      };

      for (let i = 0; i < 25; i++) {
        let x = VS.getRandExcl(0, length - timeScale(seconds(4))); // minus 4 seconds
        let y = pitchScale(VS.getRandExcl(0, 1));
        makeThread(x, y, g);
      }

      bloodText(g, "(weep)").attr("dy", "-2em");

      translate(
        0,
        pitchScale(0.5),

        drawDynamics(
          [
            { x: 0, type: "symbol", value: "mp" },
            { x: 0.5, type: "text", value: "decres." },
            { x: 1, type: "symbol", value: "n" }
          ],
          length,
          g
        )
      );
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

VS.score.preroll = durationInBeats(3);
function prerollAnimateCue() {
  VS.score.schedule(0, indicator.blinker.start());
}
VS.control.hooks.add("play", prerollAnimateCue);
VS.WebSocket.hooks.add("play", prerollAnimateCue);

addHooks(setScorePosition);

VS.WebSocket.connect();
