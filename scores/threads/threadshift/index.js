import drone from "../drone";
import translate from "../translate";

import makePage from "./page";
import makeIndicator from "./indicator";
import drawDynamics from "./dynamics";
import noisePatch from "./noisePatch";
import longTone from "./longTone";
import lineBecomingAir from "./lineBecomingAir";

const margin = {
  top: 64
};

const pitchRange = 87;
function pitchScale(value) {
  return (1 - value) * pitchRange;
}
// function pitchScale(midi) {
//   // MIDI 21/A0 to 108/C8
//   // 64.5/Eq#4 is center
//   const [min, max] = [21, 108];
//   const range = max - min;
//
//   return 1 - midi / range;
// }

function timeScale(t) {
  return t / 20; // TODO
}

const svg = d3.select("svg.main");
const page = makePage(svg);

const scoreGroup = page.element.append("g");
// scoreGroup.style("outline", "1px dotted red");
translate(0, margin.top, scoreGroup);

const indicator = makeIndicator(svg);

// drone(scoreGroup); // TODO: how do these integrate with the ending

const { articulations, dynamics } = VS.dictionary.Bravura;

const score = [
  {
    startTime: null,
    duration: null,
    render: ({ startTime, duration }) => {
      const startX = timeScale(startTime);
      const length = timeScale(duration);

      const g = longTone(scoreGroup, startX, pitchScale(0.5), length);

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
      translate(startX, pitchScale(0.5), g);

      // cluster
      g.append("text")
        .text("\ue123")
        .attr("class", "bravura");

      // caesura
      g.append("text")
        .text("\ue4d2")
        .attr("class", "bravura")
        .attr("x", length)
        .attr("text-anchor", "end");
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

      // start as sffz
      // with excessive pressure and air TODO
      // and also irregular tremolo TODO

      // top line
      const line = lineBecomingAir(length, g);
      translate(0, pitchScale(0.5), line);

      const patches = translate(0, pitchScale(0.5), g.append("g"));
      [0.2, 0.4, 0.6].forEach(x => {
        noisePatch(x * length, length * 0.1, patches);
      });

      drawDynamics(
        [
          {
            // TODO sfzmf?
            type: "symbol",
            value: "sfz",
            x: 0
          },
          {
            type: "symbol",
            value: "mf",
            x: 0.2
          },
          {
            type: "text",
            value: "decres.",
            x: 0.5
          },
          {
            type: "symbol",
            value: "n",
            x: 1
          }
        ],
        length,
        translate(0, -50, g.append("g"))
      );

      // bottom line
      g.append("line")
        .attr("x1", 0)
        .attr("x2", length)
        .attr("y1", pitchScale(0.5))
        .attr("y2", pitchScale(0.25)); // TODO curve and draw out, for more beating--also not a linear descent, meaning this should be a path, not a line

      const bottomNoise = noisePatch(length * 0.25, length, g);
      translate(0, pitchScale(0.25), bottomNoise);

      [0.2, 0.4, 0.6].forEach(x => {
        g.append("text") // TODO also add flag
          .text("\ue123")
          .attr("x", length * x)
          .attr("y", pitchScale(0.5 - x / 4))
          .attr("dy", "1em")
          .attr("class", "bravura");
      });

      drawDynamics(
        [
          {
            // TODO sfzmf?
            type: "symbol",
            value: "sfz",
            x: 0
          },
          {
            type: "symbol",
            value: "mf",
            x: 0.2
          },
          {
            type: "text",
            value: "decres.",
            x: 0.5
          },
          {
            type: "symbol",
            value: "p",
            x: 1
          }
        ],
        length,
        translate(0, 50, g.append("g"))
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

      // bottom line
      g.append("line")
        .attr("x1", 0)
        .attr("x2", length)
        .attr("y1", pitchScale(0.25))
        .attr("y2", pitchScale(0.25));

      // threads
      for (let i = 0; i < 10; i++) {
        let halfLength = length * 0.5;
        let x = VS.getRandExcl(0, halfLength);
        let l = x + halfLength;
        let y = pitchScale(VS.getRandExcl(0, 1));
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

  // console.log(scoreGroupHeight);

  indicator.translateX(x);

  VS.score.isPlaying() && VS.score.pause();
  setScorePosition();
}

d3.select(window).on("resize", resize);
let scoreGroupHeight; // TODO
d3.select(window).on("load", () => {
  renderScore();
  scoreGroupHeight = scoreGroup.node().getBBox().height; // TODO
  resize();
  setScorePosition();
  // saveSvg(); // TODO add to info or setting modal
});

VS.control.hooks.add("stop", setScorePosition);
VS.score.hooks.add("stop", setScorePosition);
VS.control.hooks.add("step", setScorePosition);
VS.control.hooks.add("pause", setScorePosition);

// TODO include stylesheet or inline all styles
// TODO serialize font?
function saveSvg() {
  var svgXML = new XMLSerializer().serializeToString(svg.node());
  var encoded = encodeURI(svgXML);
  var dataURI = `data:image/svg+xml;utf8,${encoded}`;

  var dl = document.createElement("a");
  document.body.appendChild(dl); // This line makes it work in Firefox.
  dl.setAttribute("href", dataURI);
  dl.setAttribute("download", "test.svg");
  dl.click();
  dl.remove();
}
d3.select("#save-svg").on("click", saveSvg);
