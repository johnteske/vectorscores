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
          .attr("class", "bravura")
          .attr("dy", "2em");
        break;
      case "text":
        text
          .text(d.value)
          .attr("class", "text-dynamic")
          .attr("dy", "3.5em");
        break;
    }
  });
}
