import startTimeFromDuration from "../startTimeFromDuration";
import { seconds, pitchRange, pitchScale } from "../scale";
import makeVignetteScore from "../vignette-score";
import makeVignetteResize from "../vignette-resize";
import { translate } from "../translate";
import { lcg } from "../prng";

const { svg, page } = makeVignetteScore();

const wrapper = page.element;

const prng = lcg(1234);

const steps = [-1, 1, -2, 2, -3, 3];

function phrase() {
  let notes = [{ pitch: 0, duration: 1 }];

  function addNote() {
    const pitch = Math.floor(prng() * steps.length) * 2;
    notes.push({ pitch, duration: 1 });
  }

  for (let i = 0; i < 8; i++) {
    addNote();
  }

  return notes;
}

const lineGen = d3
  .line()
  .x((d) => d.x)
  .y((d) => d.y);

function chant(selection, length) {
  const notes = phrase();
  const points = notes.reduce(
    (acc, note) => {
      const t = acc.t + note.duration;
      return {
        t,
        points: [
          ...acc.points,
          { x: acc.t, y: note.pitch },
          { x: t, y: note.pitch },
        ],
      };
    },
    { t: 0, points: [] }
  ).points;
  const xScale = length / notes.length;
  const scaledPoints = points.map(({ x, y }) => ({ x: x * xScale, y }));

  selection
    .append("path")
    .attr("d", lineGen(scaledPoints))
    .attr("fill", "none")
    .attr("stroke", "black")
    .call(translate, 0, pitchScale(0.5));

  return selection;
}

const group = (selection = wrapper) => selection.append("g");
const phraseLength = seconds(20);

const score = [
  {
    duration: 0,
    render: () => group(),
  },
  {
    duration: phraseLength,
    render: ({ length }) => {
      const g = wrapper.append("g");
      chant(g, length);
      return g;
    },
  },
  {
    duration: phraseLength,
    render: ({ length }) => {
      const g = wrapper.append("g");
      chant(g, length);
      return g;
    },
  },
  {
    duration: phraseLength,
    render: ({ length }) => {
      const g = wrapper.append("g");
      chant(g, length);
      return g;
    },
  },
  {
    duration: phraseLength,
    render: ({ length }) => {
      const g = wrapper.append("g");
      chant(g, length);
      return g;
    },
  },
  {
    duration: phraseLength,
    render: ({ length }) => {
      const g = wrapper.append("g");
      chant(g, length);
      return g;
    },
  },
  {
    duration: 0,
    render: () => group(),
  },
]
  .map(startTimeFromDuration)
  .map((bar) => ({ ...bar, length: pitchRange }));

function renderScore() {
  score.forEach((bar, i) => {
    const { render, ...data } = bar;
    render(data).attr("class", `frame frame-${i}`).style("opacity", 0);
  });
}

const showFrame = (i) => {
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

VS.saveSVG.hooks.add("save", function () {
  // A4 at 96dpi
  svg.attr("width", 794);
  svg.attr("height", 1123);
  resize();
});
