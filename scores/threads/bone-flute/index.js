import startTimeFromDuration from "../startTimeFromDuration";
import { pitchRange, pitchScale } from "../scale";
import makeVignetteScore from "../vignette-score";
import makeVignetteResize from "../vignette-resize";
import drawDynamics from "../dynamics";
import { translate } from "../translate";
import pathAlongPath from "../pathAlongPath";

const { svg, page } = makeVignetteScore();

svg.append("style").text(`
  .bravura { font-family: 'Bravura'; font-size: 20px; }
  .text-dynamic {
    font-family: serif;
    font-size: 12px;
    font-style: italic;
  }
`);

const wrapper = page.element;

const text = (selection, str) => selection.append("text").text(str);

function makeFrame(selection) {
  return selection
    .append("rect")
    .attr("width", pitchRange)
    .attr("height", pitchRange)
    .attr("fill", "none")
    .attr("stroke", "blue");
}

function textureOfBones(selection) {
  const g = selection.append("g").attr("fill", "darkRed");

  // TODO these could be animated to emphasize the crushing
  for (let i = 0; i < 66; i++) {
    g.append("text")
      .text("\u2620")
      .attr("x", pitchScale(Math.random() * 1))
      .attr("y", pitchScale(Math.random() * 0.25));
  }

  g.append("text")
    .text("crushing bones")
    .attr("dy", "1em")
    .attr("fill", "black");

  drawDynamics(
    [
      {
        type: "symbol",
        value: "mf",
        x: 0
      }
    ],
    0,
    g
  ).attr("fill", "black");

  return g;
}

// high, cheerful, taunting
// solo
// TODO also needs bounding box
const boneFlutePhraseGenerator = pathAlongPath(d3.curveBasis, d3.curveBasis);
// take the easy path
// take comfort in the release
// it can be so easy
// it can be so simple
// it's the right thing to do
// it's the right thing for everyone

function boneFlute(selection) {
  const g = selection.append("g");

  boneFlutePhraseGenerator(
    [{ x: 0, y: 0 }, { x: pitchRange * 0.5, y: 20 }, { x: pitchRange, y: 10 }],
    [...new Array(10)],
    (point, i, x, y) => ({ x, y: y + VS.getRandExcl(-5, 5) }),
    g
  );

  text(g, "it can be so easy")
    .attr("dy", "1em")
    .attr("fill", "darkred");

  drawDynamics(
    [
      {
        type: "symbol",
        value: "f",
        x: 0
      }
    ],
    0,
    g
  ).attr("fill", "black");

  return g;
}

function drone(selection) {
  const g = selection.append("g");

  // mid-range drones
  translate(g.append("line"), 0, pitchScale(0.5))
    .attr("x2", pitchRange)
    .attr("stroke", "black");
  drawDynamics(
    [
      {
        type: "symbol",
        value: "mf",
        x: 0
      }
    ],
    0,
    g
  ).attr("fill", "black");

  return g;
}

const score = [
  {
    duration: 0,
    render: () => {
      return wrapper.append("g");
    }
  },
  {
    duration: 15000,
    render: () => {
      const g = wrapper.append("g");
      makeFrame(g);
      boneFlute(g);
      drone(g);
      textureOfBones(g);
      return g;
    }
  },
  {
    duration: 15000,
    render: () => {
      const g = wrapper.append("g");
      makeFrame(g);
      boneFlute(g);
      drone(g);
      textureOfBones(g);
      return g;
    }
  },
  {
    duration: 0,
    render: () => {
      return wrapper.append("g");
    }
  }
].map(startTimeFromDuration);

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
