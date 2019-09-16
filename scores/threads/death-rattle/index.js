import startTimeFromDuration from "../startTimeFromDuration";
import { pitchRange, pitchScale } from "../scale";
import makeVignetteScore from "../vignette-score";
import makeVignetteResize from "../vignette-resize";
import drawDynamics from "../dynamics";
import { translate } from "../translate";
import pathAlongPath from "../pathAlongPath";

const articulationGlyph = VS.dictionary.Bravura.articulations;
const durationGlyph = VS.dictionary.Bravura.durations.stemless;

const { svg, page } = makeVignetteScore();

svg.append("style").text(`
  line { stroke: black }
  .blood { fill: darkred; }
  .bravura { font-family: 'Bravura'; font-size: 20px; }
  .text-dynamic {
    font-family: serif;
    font-size: 12px;
    font-style: italic;
  }
`);

const wrapper = page.element;

const group = (selection = wrapper) => selection.append("g");
const line = (selection, length) => selection.append("line").attr("x2", length);
const text = (selection, str) => selection.append("text").text(str);
const bloodText = (selection, str) =>
  text(selection, str).attr("class", "blood");
const bravura = (selection, str) =>
  text(selection, str).attr("class", "bravura");

const dynamic = (selection, type, value) =>
  drawDynamics([{ type, value, x: 0 }], 0, selection);

function centerDrone(selection, length) {
  const g = group(selection).call(translate, 0, pitchScale(0.5));

  // TODO map the pitches to prevent y overlaps
  for (let i = 0; i < 6; i++) {
    line(g, VS.getRandExcl(length * 0.25, length * 0.75)).call(
      translate,
      0,
      VS.getItem([-3, -2, -1, 0, 1, 2, 3])
    );
  }

  dynamic(g, "symbol", "mp").call(translate, 0, -20); //TODO
}

function cell(selection) {
  // TODO resize to bounding box
  return selection
    .append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", "none")
    .attr("stroke", "black");
}

// shiver--or shudder?
function shiver(selection) {
  const g = group(selection);
  const length = 20;

  cell(g);

  bravura(g, "\ue0b8");
  bravura(g, "\ue227");
  bloodText(g, "shiver");

  drawDynamics(
    [
      { type: "text", value: "n cres.", x: 0 },
      { type: "text", value: "decres. n", x: 1 }
    ],
    length,
    g
  );
}

function moan(selection) {
  const g = group(selection);

  cell(g);

  bloodText(g, "moan");

  // TODO fall away dotted line
  // mf
  // how long?
  selection
    .append("text")
    .text("LNP, subharmonic")
    .attr("dy", "2em");
}

const score = [
  //   {
  //    duration: 0,
  //    render: () => group()
  //  },
  {
    duration: 15000,
    render: ({ length }) => {
      const g = group();

      shiver(g);
      moan(g);

      centerDrone(g, length);
      return g;
    }
  },
  {
    duration: 0,
    render: () => group()
  }
]
  .map(startTimeFromDuration)
  .map(bar => ({ ...bar, length: pitchRange }));

function renderScore() {
  score.forEach((bar, i) => {
    const { render, ...data } = bar;
    render(data)
      .attr("class", `frame frame-${i}`)
      .style("opacity", 0);
  });
}

const showFrame = i => {
  d3.selectAll(".frame").style("opacity", 0);
  d3.selectAll(`.frame-${i}`).style("opacity", 1);
};

score.forEach((bar, i) => {
  const callback = () => {
    showFrame(i);
  };
  VS.score.add(bar.startTime, callback, [i, bar.duration]);
});

const resize = makeVignetteResize(svg, wrapper, pitchRange);

d3.select(window).on("resize", resize);

d3.select(window).on("load", () => {
  renderScore();
  showFrame(0);
  resize();
});

const showFrameAtPointer = () => {
  const index = VS.score.getPointer();
  showFrame(index);
};

VS.control.hooks.add("step", showFrameAtPointer);
VS.WebSocket.hooks.add("step", showFrameAtPointer);

VS.control.hooks.add("pause", showFrameAtPointer);
VS.WebSocket.hooks.add("pause", showFrameAtPointer);

VS.score.hooks.add("stop", showFrameAtPointer);

VS.WebSocket.connect();
