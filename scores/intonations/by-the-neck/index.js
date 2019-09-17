import { margin } from "../layout";
import doubleBar from "../double-bar";
import { seconds, pitchRange, pitchScale } from "../scale";
import drawDynamics from "../dynamics";
import makeIndicator from "../indicator";
import cue from "../cue";
import makePage from "../page";
import makeScroll from "../scroll";
import startTimeFromDuration from "../startTimeFromDuration";
import { translate } from "../translate";

function timeScale(t) {
  return t / 50;
}

const svg = d3.select("svg.main");
const page = makePage(svg);

svg.append("style").text(`
  .bravura { font-family: 'Bravura'; font-size: 20px; }
  .text-dynamic {
    font-family: serif;
    font-size: 12px;
    font-style: italic;
  }
`);

const scoreGroup = makeScroll(page.element);
scoreGroup.y(margin.top); // TODO allow chaining

const wrapper = scoreGroup.element;

const indicator = makeIndicator(page.element);

const cues = wrapper.append("g");
const makeCue = (x, type) => cue(cues, type).attr("x", x);

const bloodText = (selection, str) =>
  selection
    .append("text")
    .text(str)
    .attr("fill", "darkRed");

// taking hold
// the claw digs in
// hot, abrasive breath

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
    .text("intense breaths ->")
    .attr("fill", "blue");

  const box = g.node().getBBox();
  rect.attr("width", box.width);

  return g;
}

function scrapeDrone(selection) {
  return selection.append("line").attr("stroke", "blue");
}

function growl(selection) {
  const g = selection.append("g");

  const rect = g
    .append("rect")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("height", "1em");

  g.append("text")
    .attr("dy", "1em")
    .text("trem, exp. cres. growl ->")
    .attr("fill", "blue");

  const box = g.node().getBBox();
  rect.attr("width", box.width);

  return g;
}

const breath = [
  // start with intense breath sounds
  {
    duration: 30000,
    render: ({ x, length }) => {
      const g = wrapper.append("g");

      translate(heavyBreath(g), x, 0);

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
      const g = wrapper.append("g");
      translate(g, x, 0);
      makeCue(x, "open");
      // TODO if all fades/moriendo, is a double bar needed?
      doubleBar(g, pitchRange).attr("stroke", "black");
    }
  }
].map(startTimeFromDuration);

const texture = [
  {
    duration: 5000,
    render: () => {}
  },
  // add low scrape
  {
    duration: 5000,
    render: ({ x, length }) => {
      const g = wrapper.append("g");
      translate(g, x, pitchScale(0.25));
      g.append("text")
        .text("scrape")
        .attr("fill", "blue");
      scrapeDrone(g).attr("x2", length);
      bloodText(g, "choke hold").attr("y", -0.75 * pitchRange); // TODO y pos
      // TODO dynamics?
      makeCue(x); // TODO dotted line pointing to this
    }
  },
  // scrape cluster
  {
    duration: 5000,
    render: ({ x, length }) => {
      const g = wrapper.append("g");
      translate(g, x, pitchScale(0.25));
      scrapeDrone(g)
        .attr("x2", length)
        .call(translate, 0, -2);
      scrapeDrone(g).attr("x2", length);
      scrapeDrone(g)
        .attr("x2", length)
        .call(translate, 0, 2);
      // TODO dynamics?
      bloodText(g, "the claws dig in").attr("y", -0.75 * pitchRange); // TODO y pos
    }
  },
  // TODO scrape and drone cres., more pressure
  // growl
  {
    duration: 5000,
    render: ({ x, length }) => {
      const g = wrapper.append("g");
      translate(g, x, pitchScale(0.25));
      growl(g);
      // TODO dynamics?
    }
  }
].map(startTimeFromDuration);

const noise = [
  {
    duration: 15000,
    render: () => {}
  },
  {
    duration: 5000,
    render: ({ x, length }) => {
      const g = wrapper.append("g");
      translate(g, x, 0);
      for (let i = 0; i < 50; i++) {
        g.append("text")
          .text("/")
          .attr("fill", "darkred")
          .attr("x", Math.random() * length)
          .attr("y", Math.random() * pitchRange);
      }
    }
  }
].map(startTimeFromDuration);

// TODO wall of texture, frantic

const score = [...noise, ...breath, ...texture];

const scoreTiming = score
  .map(bar => bar.startTime)
  .filter((startTime, i, times) => times.indexOf(startTime) === i)
  .sort((a, b) => a - b)
  .map((startTime, i, times) => ({
    startTime,
    duration: times[i + 1] - times[i] || 0
  }));

scoreTiming.forEach((bar, i) => {
  const callback = i < scoreTiming.length - 1 ? scrollToNextBar : null;
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
  const x = timeScale(scoreTiming[index].startTime); // TODO note this is timing
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

VS.score.preroll = seconds(3);

VS.control.hooks.add("step", setScorePosition);
VS.WebSocket.hooks.add("step", setScorePosition);

VS.control.hooks.add("pause", setScorePosition);
VS.WebSocket.hooks.add("pause", setScorePosition);

VS.score.hooks.add("stop", setScorePosition);

VS.WebSocket.connect();
