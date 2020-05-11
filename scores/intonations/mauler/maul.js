export default function (selection, w, h) {
  const g = selection.append("g");

  for (let i = 0; i < 50; i++) {
    g.append("text")
      .text("/")
      .attr("fill", "darkred")
      .attr("x", Math.random() * Math.random() * w)
      .attr("y", Math.random() * h);
  }

  return g;
}
