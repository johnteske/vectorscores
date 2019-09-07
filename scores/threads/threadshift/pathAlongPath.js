export default function(guideCurve, pathCurve) {
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
  };
}
