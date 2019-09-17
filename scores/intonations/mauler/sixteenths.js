const stemHeight = 10;
const spacing = 5;

function stems(selection, pcs) {
  pcs.forEach((pc, i) => {
    const x = i * spacing;
    const y = -1 * pc;

    selection
      .append("line")
      .attr("x1", x)
      .attr("x2", x)
      .attr("y1", y)
      .attr("y2", y - stemHeight);
  });
}

function doubleBeam(selection, pcs) {
  const n = pcs.length - 1;
  const pc1 = pcs[0];
  const pc2 = pcs[n];

  selection
    .append("line")
    .attr("x1", 0)
    .attr("x2", n * spacing)
    .attr("y1", -stemHeight - pc1)
    .attr("y2", -stemHeight - pc2)
    .attr("stroke-width", 2);

  selection
    .append("line")
    .attr("x1", 0)
    .attr("x2", n * spacing)
    .attr("y1", 0)
    .attr("y1", -stemHeight + 3 - pc1)
    .attr("y2", -stemHeight + 3 - pc2)
    .attr("stroke-width", 2);
}

export default function sixteenths(selection) {
  const g = selection.append("g").attr("stroke", "black");

  stems(g, [0, -1, 0, 2, 3]);
  doubleBeam(g, [0, -1, 0, 2]);

  return g;
}

export function repeated(selection) {
  const g = selection.append("g").attr("stroke", "black");

  const pcs = [0, -1, 0, 2, 0, -1, 0, 2];
  stems(g, pcs);
  doubleBeam(g, pcs);

  return g;
}
