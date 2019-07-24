d3.select("svg").remove();
var group = d3.select("main");

for (var i = 57344; i < 65535; i++) {
  group
    .append("div")
    .classed("codepoint", true)
    .append("p")
    .classed("symbol", true)
    .text(String.fromCharCode(i))
    .append("p")
    .classed("unicode", true)
    .text("\\u" + i.toString(16));
}

// h = 0xE000;
// console.log(h.toString(10)); //57344
// h = 0xE00A;
// console.log(h.toString(10)); //57354
// h = 0xFFFF;
// console.log(h.toString(10)); //65535
