// noise in the middle?
// delay alarm sound?
// offset klaxon (exit before alarm)
// tight drone becomes chaotic and noisy
import startTimeFromDuration from "../startTimeFromDuration";
import { seconds, pitchRange, pitchScale } from "../scale";
import makeVignetteScore from "../vignette-score";
import makeVignetteResize from "../vignette-resize";
import drawDynamics from "../dynamics";
import { translate } from "../translate";

const articulationGlyph = VS.dictionary.Bravura.articulations;
const durationGlyph = VS.dictionary.Bravura.durations.stemless;

const { svg, page } = makeVignetteScore();

svg.append("style").text(`
  line { stroke: black }
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
const bravura = (selection, str) =>
  text(selection, str).attr("class", "bravura");

const dynamic = (selection, type, value) =>
  drawDynamics([{ type, value, x: 0 }], 0, selection);

function wail(selection) {
  const g = group(selection).call(translate, 0, pitchScale(0.75));

  text(g, "wail")
    .attr("dy", "1.66em")
    .style("font-size", 10);
  //text(g, "growl/scream though instrument");
  //bravura(g, articulationGlyph[">"]);

  dynamic(g, "symbol", "f").call(translate, 0, -12);

  // long, periodic TODO how many seconds? how much rest?
  // TODO add line
  return g;
}

function alarm(selection) {
  // shorter, periodic
  // TODO how many seconds? how much rest?

  const g = group(selection).call(translate, 0, pitchScale(1));

  //text(g, "alarm").attr("dy", "1em");
  text(g, "0")
    .attr("dy", "1em")
    .style("font-size", 8);
  text(g, "2")
    .attr("dy", "1em")
    .attr("dx", 16)
    .style("font-size", 8);
  bravura(g, durationGlyph[2]).attr("dy", "0.8em");
  bravura(g, durationGlyph[1])
    .attr("dy", "0.7em")
    .attr("dx", 16);

  dynamic(g, "symbol", "mf").call(translate, 0, -12);

  return g;
}

function droneCluster(selection, length) {
  const g = group(selection).call(translate, 0, pitchScale(0.25));

  const p = [-2, -1, 0, 1, 2].sort(() => Math.random() - 0.5);

  line(g, length).call(translate, 0, p.pop());
  line(g, length).call(translate, 0, p.pop());
  line(g, length).call(translate, 0, p.pop());

  dynamic(g, "symbol", "mp").call(translate, 0, -24);

  return g;
}

const score = [
  {
    duration: 0,
    render: () => group()
  },
  {
    duration: seconds(20),
    render: ({ length }) => {
      const g = group();

      alarm(g);
      // wail(g);
      droneCluster(g, length);

      return g;
    }
  },
  {
    duration: seconds(20),
    render: ({ length }) => {
      const g = group();

      alarm(g);
      wail(g);
      droneCluster(g, length);

      return g;
    }
  },
  {
    duration: seconds(20),
    render: ({ length }) => {
      const g = group();

      //alarm(g);
      wail(g);
      droneCluster(g, length);

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
