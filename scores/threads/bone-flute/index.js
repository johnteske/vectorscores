import { pitchRange, pitchScale } from "../scale";
import makeVignetteScore from "../vignette-score";
import makeVignetteResize from "../vignette-resize";
import translate from "../translate";
import pathAlongPath from "../pathAlongPath";

const { svg, page, scoreGroup } = makeVignetteScore();
const wrapper = scoreGroup;

function textureOfBones(selection) {
  const g = selection.append("g").attr("fill", "darkRed");
  for (let i = 0; i < 666; i++) {
    g.append("text")
      .text("\u2620")
      .attr("x", pitchScale(Math.random() * 1))
      .attr("y", pitchScale(Math.random() * 0.25));
  }
  return g;
}

textureOfBones(wrapper);

const boneFlutePhraseGenerator = pathAlongPath(d3.curveBasis, d3.curveBasis);

function boneFlute(selection) {
  return boneFlutePhraseGenerator(
    [{ x: 0, y: 0 }, { x: 50, y: 20 }, { x: 100, y: 10 }],
    [...new Array(10)],
    (point, i, x, y) => ({ x, y: y + VS.getRandExcl(-5, 5) }),
    selection
  );
}

translate(0, 0, boneFlute(wrapper));

const resize = makeVignetteResize(svg, wrapper, pitchRange);

d3.select(window).on("resize", resize);

d3.select(window).on("load", () => {
  // renderScore();
  resize();
});
