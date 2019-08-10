const main = d3.select(".main");
const wrapper = main.append("g");

// initial drone, to become module for this suite
const data = [ {x:0, y:50}, {x:0, y:100} ]

wrapper
  .selectAll(".drone")
  .data(data)
  .enter()
  .append("line")
  .attr("class", "drone")
  .attr("x1", 0)
  .attr("x2", 100)
  .attr("y1", d => d.y)
  .attr("y2", d => d.y);
