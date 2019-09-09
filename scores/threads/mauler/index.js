import drone from "../drone";
import makeIndicator from "../indicator";
import longTone from "../longTone";
import makePage from "../page";
import makeScroll from "../scroll";
import startTimeFromDuration from "../startTimeFromDuration";
import translate from "../translate";

import sixteenths from "./sixteenths";
import tremoloLongTone from "./tremoloLongTone";

const durations = VS.dictionary.Bravura.durations.stemless;

const margin = {
  top: 64
};

const pitchRange = 87;
function pitchScale(value) {
  return (1 - value) * pitchRange;
}

function timeScale(t) {
  return t / 80;
}

function callTranslate(selection, x, y) {
  return translate(x, y, selection);
}

const svg = d3.select("svg.main");
svg.append("style").text(`
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

const indicator = makeIndicator(page.element);

const score = [
  {
    startTime: null,
    duration: 3000,
    render: ({ x }) => {
      const g = translate(x, pitchScale(0.5), wrapper.append("g"));

      // 3/4 time signature
      g.append("text")
        .text("\uf58c")
        .attr("dx", "-1em")
        .attr("class", "bravura");

      sixteenths(g).attr("transform", "scale(1.5)");

      g.append("text")
        .attr("class", "bravura")
        .text("\ue4e6")
        .call(callTranslate, timeScale(1500), 0);

      g.append("text")
        .attr("class", "bravura")
        .text("\ue4e5")
        .call(callTranslate, timeScale(2000), 0);
    }
  },
  {
    startTime: null,
    duration: 3000,
    render: ({ x }) => {
      const g = translate(x, 0, wrapper.append("g"));
      // spike
      g.append("path").attr("d", "M-5,0 L5,0 L0,60 Z");
      // wall/tremolo--is it around the pitch center?

      for (let i = 0; i < 25; i++) {
        translate(i, pitchScale(0.33), tremoloLongTone(g));
        translate(i, pitchScale(0.66), sixteenths(g));
      }
    }
  },
  // drone(wrapper);
  // semitone falls around drones, maybe the wall/texture fades over time
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

  const scale = h / page.height();
  page.scale(scale);

  const center = (w / scale) * 0.5;
  indicator.translateX(center);
  scoreGroup.setCenter(center);
  setScorePosition();
}

d3.select(window).on("resize", resize);

d3.select(window).on("load", () => {
  renderScore();
  page.calculateHeight();
  resize();
});

VS.control.hooks.add("stop", setScorePosition);
VS.score.hooks.add("stop", setScorePosition);
VS.control.hooks.add("step", setScorePosition);
VS.control.hooks.add("pause", setScorePosition);
