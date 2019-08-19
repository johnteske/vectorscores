import drone from "../drone";
import translate from "../translate";

import makePage from "./page";
import makeIndicator from "./indicator";
import drawDynamics from "./dynamics";
import longTone from "./longTone";

const margin = {
  top: 100
};

function timeScale(t) {
  return t / 20; // TODO
}

const svg = d3.select("svg.main");
const page = makePage(svg);

const scoreGroup = page.element.append("g");
translate(0, margin.top, scoreGroup);

const indicator = makeIndicator(svg);
indicator.translateY(margin.top - 50);

// drone(scoreGroup); // TODO: how do these integrate with the ending

const { articulations, dynamics } = VS.dictionary.Bravura;

const score = [
  {
    startTime: null,
    duration: null,
    render: ({ startTime, duration }) => {
      const startX = timeScale(startTime);
      const length = timeScale(duration);

      const g = longTone(scoreGroup, startX, 0, length);

      g.append("text")
        .text(articulations[">"])
        .attr("class", "bravura")
        .attr("dy", "0.66em");

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
            x: 0.5
          },
          {
            type: "symbol",
            value: "mf",
            x: 1
          }
        ],
        length,
        g
      );
    }
  },
  {
    startTime: null,
    duration: null,
    render: ({ startTime, duration }) => {
      const startX = timeScale(startTime);
      const length = timeScale(duration);

      const g = scoreGroup.append("g");
      translate(startX, 0, g);

      // cluster
      g.append("text")
        .text("\ue123")
        .attr("class", "bravura");

      // caesura
      g.append("text")
        .text("\ue4d2")
        .attr("class", "bravura")
        .attr("x", length)
        .attr("dx", "-2em");
    }
  },
  {
    startTime: null,
    duration: null,
    render: ({ startTime, duration }) => {
      const startX = timeScale(startTime);
      const length = timeScale(duration);

      const g = scoreGroup.append("g");

      translate(startX, 0, g);

      // should this start as sffz \ue53b, with excessive pressure?
      // and also irregular tremolo?

      // top line
      g.append("line")
        .attr("x1", 0)
        .attr("x2", length);
      g.append("text")
        .text("sfz, decres. to niente")
        .attr("dy", "-1em");
      g.append("text")
        .text("becoming airy, three noisy patches")
        .attr("dy", "-2em");

      // bottom line
      g.append("line")
        .attr("x1", 0)
        .attr("x2", length)
        .attr("y2", 50); // TODO curve and draw out, for more beating--also not a linear descent, meaning this should be a path, not a line
      g.append("text")
        .text("sfz, mf, decres. to p")
        .attr("y", 50)
        .attr("dy", "1em");
      g.append("text")
        .text("texture, three cluster hits")
        .attr("y", 50)
        .attr("dy", "2em");
    }
  },
  {
    startTime: null,
    duration: null,
    render: ({ startTime, duration }) => {
      const startX = timeScale(startTime);
      const length = timeScale(duration);

      const g = scoreGroup.append("g");

      translate(startX, 0, g);

      // bottom line
      g.append("line")
        .attr("x1", 0)
        .attr("x2", length)
        .attr("y1", 50)
        .attr("y2", 50);

      // threads
      for (let i = 0; i < 10; i++) {
        let halfLength = length * 0.5;
        let x = Math.random() * halfLength;
        let l = x + halfLength;
        let y = Math.random() * 50;
        g.append("line")
          .attr("x1", x)
          .attr("x2", l)
          .attr("y1", y)
          .attr("y2", y);
      }
    }
  },
  {
    startTime: null,
    duration: null,
    render: () => {}
  }
].map((bar, i) => {
  // TODO each bar is set to the same duration during sketching
  const length = 3000;
  return { ...bar, duration: length, startTime: length * i };
});

score.forEach((bar, i) => {
  const callback = i < score.length - 1 ? scrollToNextBar : null;
  VS.score.add(bar.startTime, callback, [i, bar.duration]);
});

function renderScore() {
  score.forEach(bar => {
    const { render, ...barData } = bar;
    render(barData);
  });
}

function setScorePosition() {
  const index = VS.score.getPointer();
  centerScoreByIndex(index, 0);
}

function centerScoreByIndex(index, duration) {
  const x = timeScale(score[index].startTime);
  page.scrollTo(x, duration);
}

function scrollToNextBar(index, duration) {
  centerScoreByIndex(index + 1, duration);
}

function resize() {
  const x = page.calculateCenter();

  indicator.translateX(x);

  VS.score.isPlaying() && VS.score.pause();
  setScorePosition();
}

d3.select(window).on("resize", resize);
d3.select(window).on("load", () => {
  resize();
  setScorePosition();
  renderScore();
});

VS.control.hooks.add("stop", setScorePosition);
VS.score.hooks.add("stop", setScorePosition);
VS.control.hooks.add("step", setScorePosition);
VS.control.hooks.add("pause", setScorePosition);
