import { margin } from "../layout";
import doubleBar from "../double-bar";
import { pitchRange } from "../scale";
import drawDynamics from "../dynamics";
import makeIndicator from "../indicator";
import makePage from "../page";
import makeScroll from "../scroll";
import startTimeFromDuration from "../startTimeFromDuration";
import translate from "../translate";

function timeScale(t) {
  return t / 200;
}

const svg = d3.select("svg.main");
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

// what does it sound like when
// Satan grabs the back of your neck
// with his right hand, with nails, and
// leans over your left shoulder?
// you can feel his breath in your
// ear, never words. never seeing,
// only feeling

function heavyBreath(selection) {
  const g = selection.append("g");

  const rect = g
    .append("rect")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("height", "1em");

  // g.append("text").text("\ue0b8"); // Bravura
  g.append("text")
    .attr("dy", "1em")
    .text("intense breaths")
    .attr("fill", "blue");

  const box = g.node().getBBox();
  rect.attr("width", box.width);

  return g;
}

function lowDrone() {
  // LNP, trem.
}

function growl() {
  // exponential cres.
}

const breath = [
  // start with intense breath sounds
  {
    duration: 30000,
    render: ({ x, length }) => {
      const g = wrapper.append("g");

      translate(x, 0, heavyBreath(g));
      drawDynamics(
        [
          {
            type: "symbol",
            value: "p",
            x: 0
          },
          {
            type: "text",
            value: "cres.",
            x: 0.25
          },
          {
            type: "symbol",
            value: "ff",
            x: 0.5
          },
          {
            type: "text",
            value: "decres.",
            x: 0.75
          },
          {
            type: "symbol",
            value: "n",
            x: 1
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
      translate(x, 0, doubleBar(wrapper, pitchRange).attr("stroke", "black"));
    }
  }
  // double bar
].map(startTimeFromDuration);

const texture = [
  // add low scrape
  // add low drone
  // scrape and drone cres., more pressure
  // wall of texture, frantic, growling
  // double bar
].map(startTimeFromDuration);

const score = [...breath, ...texture];

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
