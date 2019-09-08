(function () {
  'use strict';

  const data = [{ x: 0, y: 50 }, { x: 0, y: 100 }];

  function drone(selection) {
    selection
      .selectAll(".drone")
      .data(data)
      .enter()
      .append("line")
      .attr("class", "drone")
      .attr("x1", 0)
      .attr("x2", 100)
      .attr("y1", d => d.y)
      .attr("y2", d => d.y);
  }

  function translate(x, y, selection) {
    return selection.attr("transform", `translate(${x}, ${y})`);
  }

  function pathAlongPath(guideCurve, pathCurve) {
    const lineGenerator = d3
      .line()
      .x(d => d.x)
      .y(d => d.y);

    const guideGenerator = lineGenerator.curve(guideCurve);
    const pathGenerator = lineGenerator.curve(pathCurve);

    return function(guidePoints, pathPoints, pathPointMap, selection) {
      const g = selection.append("g");

      const guide = g
        .append("path")
        .attr("d", guideGenerator(guidePoints))
        .attr("fill", "none")
        .attr("stroke", "none");

      const guideLength = guide.node().getTotalLength();
      const nPoints = pathPoints.length;
      const mappedPoints = pathPoints.map((point, i) => {
        const { x, y } = guide
          .node()
          .getPointAtLength(guideLength * (i / nPoints));
        return pathPointMap(point, i, x, y);
      });
      mappedPoints.push(guide.node().getPointAtLength(guideLength)); // add final point

      g.append("path")
        .attr("d", lineGenerator(mappedPoints))
        .attr("fill", "none")
        .attr("stroke", "black"); // TODO allow custom style

      return g;
    };
  }

  const main = d3.select(".main");
  const wrapper = main.append("g");

  drone(wrapper);

  function textureOfBones(selection) {
    for (let i = 0; i < 666; i++) {
      selection
        .append("text")
        .text("\u2620")
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

}());
