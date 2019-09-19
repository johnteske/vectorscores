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
import makeResize from "../scroll-resize";
import makeScrollHelpers from "../scroll-center";
import addHooks from "../scroll-hooks";
import noisePatch from "./noisePatch";
import lineBecomingAir from "./lineBecomingAir";

function timeScale(t) {
  return t / 200;
}

const makeCue = selection => cue(selection).attr("y", -1 * pitchRange);

const ensemble = (selection, str) =>
  selection
    .append("text")
    .text(str)
    .attr("class", "text-ensemble")
    .attr("fill", "blue");

const { svg, page, scoreGroup, indicator } = makeScrollingScore();

svg.append("style").text(`
  line { stroke: black; }
  line.wip { stroke: darkred; }
  .bravura { font-family: 'Bravura'; font-size: 20px; }
  text { font-size: 12px; }
  .text-dynamic {
    font-family: serif;
    font-size: 12px;
    font-style: italic;
  }
  .text-ensemble, .text-duration {
    font-size: 12px;
  }
`);

const durations = translate(0, -24, scoreGroup.element.append("g"));
const makeDuration = (x, duration) =>
  durations
    .append("text")
    .text(`${duration / 1000}"`)
    .attr("x", x)
    .attr("class", "text-duration");

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
    render: ({ x, length, duration }) => {
      const g = longTone(scoreGroup.element, x, pitchScale(0.5), length);

      g.append("text")
        .text("tutti, on D")
        .attr("fill", "blue")
        .attr("dy", "-2em");

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

      makeDuration(x, duration);
    }
  },
  {
    startTime: null,
    duration: seconds(2),
    addPaddingAfter: true, // hack to keep dur but add visual space
    render: ({ x, length, duration }) => {
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
      makeDuration(x, duration);
    }
  },
  {
    startTime: null,
    duration: seconds(45),
    render: ({ x, length, duration }) => {
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
          .attr("dx", "0.2em")
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
          .attr("dx", "0.25em")
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
      makeDuration(x, duration);
    }
  },
  {
    startTime: null,
    duration: seconds(120),
    render: ({ x, length, duration }) => {
      const g = scoreGroup.element.append("g");
      translate(x, 0, g);

      // bottom line
      g.append("line")
        .attr("x1", 0)
        .attr("x2", length)
        .attr("y1", pitchScale(0.25))
        .attr("y2", pitchScale(0.25));

      ensemble(g, "John");

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

      ensemble(g, "tutti").attr("x", length * 0.25);
      makeDuration(x, duration);
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

const indexOfAttackBar = score
  .map((bar, index) => ({ ...bar, index }))
  .find(bar => bar.addPaddingAfter).index;

const scoreWithRenderData = score.map((bar, i) => {
  const padding = i > indexOfAttackBar ? timeScale(3000) : 0;
  return {
    ...bar,
    x: timeScale(bar.startTime) + padding,
    length: timeScale(bar.duration)
  };
});

function renderScore() {
  scoreWithRenderData.forEach(bar => {
    const { render, ...data } = bar;
    render(data);
  });
}

const { setScorePosition, scrollToNextBar } = makeScrollHelpers(
  scoreGroup,
  scoreWithRenderData.map(bar => bar.x)
);

score.forEach((bar, i) => {
  const callback = i < score.length - 1 ? scrollToNextBar : null;
  VS.score.add(bar.startTime, callback, [i, bar.duration]);
});

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
