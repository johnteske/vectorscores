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

function textureOfBones(selection) {
  const g = selection.append("g").attr("fill", "darkRed");

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
    [{ x: 0, y: 0 }, { x: 50, y: 20 }, { x: 100, y: 10 }],
    [...new Array(10)],
    (point, i, x, y) => ({ x, y: y + VS.getRandExcl(-5, 5) }),
    g
  );

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

function renderScore() {
  boneFlute(wrapper);
  drone(wrapper);
  textureOfBones(wrapper);
}

const resize = makeVignetteResize(svg, wrapper, pitchRange);

d3.select(window).on("resize", resize);

d3.select(window).on("load", () => {
  renderScore();
  resize();
});

VS.WebSocket.connect();
