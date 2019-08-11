import drone from "../drone";

const main = d3.select(".main");
const wrapper = main.append("g");

drone(wrapper);

wrapper
  .append("text")
  .text("LNP ->")
  .attr("dy", "2em");
