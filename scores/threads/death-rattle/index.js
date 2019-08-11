import drone from "../drone";

const main = d3.select(".main");
const wrapper = main.append("g");

drone(wrapper);

// shiver--or shudder?
function shiver(selection) {
  const group = selection.append("g").attr("transform", "translate(50,50)");

  group
    .append("text")
    .text("cres.")
    .attr("x", 0);

  group
    .append("text")
    .text("///")
    .attr("x", 50);

  group
    .append("text")
    .text("decres.")
    .attr("x", 100);
}

shiver(wrapper);

function moan(selection) {
  selection
    .append("text")
    .text("LNP, subharmonic")
    .attr("dy", "2em");
}

moan(wrapper);
