const data = [
  { x: 0, y: 50 },
  { x: 0, y: 100 },
];

export default function (selection) {
  selection
    .selectAll(".drone")
    .data(data)
    .enter()
    .append("line")
    .attr("class", "drone")
    .attr("x1", 0)
    .attr("x2", 100)
    .attr("y1", (d) => d.y)
    .attr("y2", (d) => d.y);
}
