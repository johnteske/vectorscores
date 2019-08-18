import drone from "../drone";
import makePage from "./page";
import makeIndicator from "./indicator";
import longTone from "./longTone";

function timeScale(t) {
  return t / 20; // TODO
}

const svg = d3.select(".main");
const page = makePage(svg);
const scoreGroup = page.element.append("g");

const indicator = makeIndicator(svg);

// drone(scoreGroup); // TODO: how do these integrate with the ending

const score = [
  {
    startTime: null,
    duration: null,
    render: ({ startTime, duration }) => {
      const startX = timeScale(startTime);
      const length = timeScale(duration);

      const g = longTone(scoreGroup, startX, 50, length);
      g.append("text")
        .text(">")
        .attr("dy", "1em");
      g.append("text")
        .text("p, cres., mf")
        .attr("dy", "2em");
    }
  },
  {
    startTime: null,
    duration: null,
    render: ({ startTime, duration }) => {
      const startX = timeScale(startTime);
      const length = timeScale(duration);

      const g = scoreGroup
        .append("g")
        .attr("transform", `translate(${startX},50)`);

      g.append("text").text("cluster");
      g.append("text")
        .text("//")
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

      const g = scoreGroup
        .append("g")
        .attr("transform", `translate(${startX},50)`);

      // should this start as sffz, with excessive pressure?
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

      const g = scoreGroup
        .append("g")
        .attr("transform", `translate(${startX},50)`);

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

  page.scrollTo(x);
}

function scrollToNextBar(index, duration) {
  centerScoreByIndex(index + 1, duration);
}

function resize() {
  const x = page.calculateCenter();
  indicator.translateX(x);
  // TODO need to center score--how to deal with playing/not playing?
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
