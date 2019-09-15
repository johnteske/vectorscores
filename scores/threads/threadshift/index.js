// make held tone less predictable/gated
// add stems/flags to cluster hits (subsequent hits are not cluster?)
// add accent to main hit

import { margin } from "../layout";
import { seconds, pitchRange, pitchScale } from "../scale";
import doubleBar from "../double-bar";
import cue from "../cue";
import drawDynamics from "../dynamics";
import longTone from "../longTone";
import pathAlongPath from "../pathAlongPath";
import startTimeFromDuration from "../startTimeFromDuration";
import translate from "../translate";
import makeScrollingScore from "../scrolling-score";
import noisePatch from "./noisePatch";
import lineBecomingAir from "./lineBecomingAir";

function timeScale(t) {
  return t / 200;
}

const makeCue = selection => cue(selection).attr("y", -87);

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

const { articulations, dynamics } = VS.dictionary.Bravura;

const splitDynamics = endDynamic => [
  {
    type: "symbol",
    value: "sffz", // sfffz?
    x: 0
  },
  {
    type: "symbol",
    value: "mf",
    x: 0.15
  },
  {
    type: "text",
    value: "decres.",
    x: 0.5
  },
  {
    type: "symbol",
    value: endDynamic,
    x: 1
  }
];

const score = [
  {
    startTime: null,
    duration: seconds(60),
    render: ({ x, length }) => {
      const g = longTone(scoreGroup.element, x, pitchScale(0.5), length);

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
            value: "siempre",
            x: 0.25
          }
        ],
        length,
        g
      );

      makeCue(g);
    }
  },
  {
    startTime: null,
    duration: seconds(5), // TODO 2 seconds time, more display
    render: ({ x, length }) => {
      const g = scoreGroup.element.append("g");
      translate(x, pitchScale(0.5), g);

      // cluster
      g.append("text")
        .text("\ue123")
        .attr("class", "bravura");

      drawDynamics(
        [
          {
            type: "symbol",
            value: "sffz", // sfffz?
            x: 0
          }
        ],
        length,
        g
      );

      // caesura
      g.append("text")
        .text("\ue4d2")
        .attr("class", "bravura")
        .attr("x", length)
        .attr("dy", "-1em")
        .attr("text-anchor", "end");

      makeCue(g);
    }
  },
  {
    startTime: null,
    duration: seconds(45),
    render: ({ x, length }) => {
      const g = scoreGroup.element.append("g");
      translate(x, 0, g);

      // with excessive pressure and air
      translate(
        0,
        pitchScale(0.5),
        g
          .append("text")
          //.text("\ue61b")
          .text("\ue61d")
          .attr("dy", "-1em")
          .attr("class", "bravura")
          .attr("text-anchor", "middle")
      );
      // TODO add transition to ord/norm

      // irregular tremolo
      translate(
        0,
        pitchScale(0.5),
        g
          .append("text")
          .text("\uE22B")
          .attr("dy", "-0.5em")
          .attr("class", "bravura")
          .attr("text-anchor", "middle")
      );
      // TODO add transition to ord/norm

      // top line
      const line = lineBecomingAir(length, g);
      translate(0, pitchScale(0.5), line);

      const patches = translate(0, pitchScale(0.5), g.append("g"));
      [0.2, 0.4, 0.6].forEach(x => {
        noisePatch(x * length, length * 0.1, patches);
      });

      drawDynamics(
        splitDynamics("n"),
        length,
        translate(0, -50, g.append("g"))
      );

      // bottom line
      pathAlongPath(d3.curveBasis, d3.curveBasis)(
        [
          { x: 0, y: pitchScale(0.5) },
          { x: length * 0.33, y: pitchScale(0.485) },
          { x: length * 0.66, y: pitchScale(0.265) },
          { x: length, y: pitchScale(0.25) }
        ],
        [...new Array(50)],
        (point, i, x, y) => ({ x, y: y + VS.getRandExcl(-1, 1) }),
        g
      );

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

      drawDynamics(splitDynamics("p"), length, translate(0, 50, g.append("g")));

      translate(0, pitchScale(0.5), makeCue(g));
    }
  },
  {
    startTime: null,
    duration: seconds(120),
    render: ({ x, length }) => {
      const g = scoreGroup.element.append("g");
      translate(x, 0, g);

      // bottom line
      g.append("line")
        .attr("x1", 0)
        .attr("x2", length)
        .attr("y1", pitchScale(0.25))
        .attr("y2", pitchScale(0.25));

      g.append("text").text("(solo)");

      // threads
      const makeThread = (x, y, length, selection) => {
        const group = translate(x, y, selection.append("g"));

        group
          .append("line")
          .attr("x1", 0)
          .attr("x2", length);

        drawDynamics(
          [
            {
              type: "symbol",
              value: "n",
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
          group
        );
      };

      for (let i = 0; i < 10; i++) {
        let x = VS.getRandExcl(0.25, 0.5) * length;
        let y = pitchScale(VS.getRandExcl(0, 1));
        makeThread(x, y, length - x, g);
      }

      g.append("text")
        .text("(tutti)")
        .attr("x", length * 0.25);
    }
  },
  {
    startTime: null,
    duration: 0,
    render: ({ x }) => {
      // Double bar
      const g = scoreGroup.element.append("g");
      translate(x, 0, g);

      doubleBar(g, pitchRange);

      translate(0, pitchScale(0.5), makeCue(g));
    }
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
  //const scale = h / page.height(); // TODO remove
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

VS.control.hooks.add("step", setScorePosition);
VS.WebSocket.hooks.add("step", setScorePosition);

VS.control.hooks.add("pause", setScorePosition);
VS.WebSocket.hooks.add("pause", setScorePosition);

VS.score.hooks.add("stop", setScorePosition);

VS.WebSocket.connect();

// TODO include stylesheet or inline all styles
// TODO serialize font?
//function saveSvg() {
//  var svgXML = new XMLSerializer().serializeToString(svg.node());
//  var encoded = encodeURI(svgXML);
//  var dataURI = `data:image/svg+xml;utf8,${encoded}`;
//
//  var dl = document.createElement("a");
//  document.body.appendChild(dl); // This line makes it work in Firefox.
//  dl.setAttribute("href", dataURI);
//  dl.setAttribute("download", "test.svg");
//  dl.click();
//  dl.remove();
//}
//d3.select("#save-svg").on("click", saveSvg);
