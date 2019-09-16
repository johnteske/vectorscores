import { pitchRange, pitchScale } from "../scale";
import makeVignetteScore from "../vignette-score";
import makeVignetteResize from "../vignette-resize";
import { translate } from "../translate";
import pathAlongPath from "../pathAlongPath";

const { svg, page } = makeVignetteScore();
const wrapper = page.element;

function textureOfBones(selection) {
  const g = selection.append("g").attr("fill", "darkRed");

  g.append("text")
    .text("crushing bones")
    .attr("dy", "1em")
    .attr("fill", "black");
  // TODO mf

  for (let i = 0; i < 66; i++) {
    g.append("text")
      .text("\u2620")
      .attr("x", pitchScale(Math.random() * 1))
      .attr("y", pitchScale(Math.random() * 0.25));
  }

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
  return boneFlutePhraseGenerator(
    [{ x: 0, y: 0 }, { x: 50, y: 20 }, { x: 100, y: 10 }],
    [...new Array(10)],
    (point, i, x, y) => ({ x, y: y + VS.getRandExcl(-5, 5) }),
    selection
  );
}

function renderScore() {
  boneFlute(wrapper);

  // mid-range drones
  translate(wrapper.append("line"), 0, pitchScale(0.5))
    .attr("x2", pitchRange)
    .attr("stroke", "black");

  textureOfBones(wrapper);
}

const resize = makeVignetteResize(svg, wrapper, pitchRange);

d3.select(window).on("resize", resize);

d3.select(window).on("load", () => {
  renderScore();
  resize();
});
