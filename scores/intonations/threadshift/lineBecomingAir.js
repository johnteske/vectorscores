function makeEmptyArray(n) {
  let array = [];
  for (let i = 0; i < n; i++) {
    array.push(null);
  }
  return array;
}

const lineGenerator = d3
  .line()
  .x(d => d.x)
  .y(d => d.y);

export default function(length, selection) {
  const n = 50;

  const points = makeEmptyArray(n).map((_, i) => ({
    x: (i / n) * length,
    y: 0
  }));
  const segments = points.reduce((accumulator, point, i) => {
    const index = Math.floor(i / 5);
    const target = accumulator[index] || [];
    target.push(point);
    accumulator[index] = target;
    return accumulator;
  }, []);

  const g = selection.append("g");
  g.selectAll("path")
    .data(segments)
    .enter()
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("d", d => lineGenerator(d));
  return g;
}
