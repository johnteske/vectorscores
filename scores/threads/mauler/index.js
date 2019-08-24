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

  const durations = VS.dictionary.Bravura.durations.stemless;

  const main = d3.select(".main");
  const wrapper = main.append("g");

  drone(wrapper);

  // TODO
  [0, 1, 2, 3, 4].forEach(x => {
    wrapper
      .append("text")
      .style("font-family", "'Bravura'")
      .text(durations[0.25])
      .attr("dx", `${x}em`);
  });

}());
