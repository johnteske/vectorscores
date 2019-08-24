import bravura from "./bravura";

const { dynamics } = VS.dictionary.Bravura;

export default function(data, scale, selection) {
  data.forEach(d => {
    const text = selection.append("text").attr("x", d.x * scale);

    switch (d.x) {
      case 0:
        text.attr("text-anchor", "start");
        break;
      case 1:
        text.attr("text-anchor", "end");
        break;
      default:
        text.attr("text-anchor", "middle");
    }

    switch (d.type) {
      case "symbol":
        text
          .text(dynamics[d.value])
          .call(bravura)
          .attr("dy", "2em");
        break;
      case "text":
        text
          .text(d.value)
          .attr("class", "text-dynamic")
          .style("font-family", "serif")
          .style("font-size", 12)
          .style("font-style", "italic")
          .attr("dy", "3.5em");
        break;
    }
  });
}
