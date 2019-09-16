import makeVignetteScore from "../vignette-score";
import translate from "../translate";
import pathAlongPath from "../pathAlongPath";

const { svg, page, scoreGroup } = makeVignetteScore();
const wrapper = scoreGroup;

function textureOfBones(selection) {
  for (let i = 0; i < 666; i++) {
    selection
      .append("text")
      .text("\u2620")
      .attr("fill", "darkRed")
      //.attr("fill", "#8B0000")
      .attr("dx", `${Math.random() * 33}em`)
      .attr("dy", `${Math.random() * 2}em`);
  }
}

textureOfBones(wrapper.append("g").attr("transform", "translate(0, 100)"));

const boneFlutePhraseGenerator = pathAlongPath(d3.curveBasis, d3.curveBasis);

function boneFlute(selection) {
  return boneFlutePhraseGenerator(
    [{ x: 0, y: 0 }, { x: 50, y: 20 }, { x: 100, y: 10 }],
    [...new Array(10)],
    (point, i, x, y) => ({ x, y: y + VS.getRandExcl(-5, 5) }),
    selection
  );
}

translate(50, 50, boneFlute(wrapper));
