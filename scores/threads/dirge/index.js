import drone from "../drone";

const main = d3.select(".main");
const wrapper = main.append("g");

drone(wrapper);

// as low, slow (breath, bow speed) as possible/audible
wrapper
  .append("text")
  .text("LNP ->")
  .attr("dy", "2em");

// ensemble comes in and out of LNP for highlighting threads?
