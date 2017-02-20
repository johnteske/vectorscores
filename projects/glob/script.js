---
layout: compress-js
---
var radius = 48, // relative to glob.width?
    margin = 20,
    innerwidth = 240, // placeholder name
    maxwidth = 400,
    width = innerwidth + (margin * 2),
    center = width * 0.5,
    tLong = 3000,
    tShort = 1500,
    scoreLength = 10,
    textoffset = 5,
    debug = VS.getQueryString("debug") == 1 || false;

var main = d3.select(".main")
    .style("width", width + "px")
    .style("height", width + "px");

{% include_relative _glob.js %}

function newPoint() {
    var angle = Math.random() * Math.PI * 2,
        dist = Math.random() - Math.random();
    return {
        x: Math.cos(angle) * radius * dist,
        y: Math.sin(angle) * radius * dist
    };
}

var glob = new Glob(main, 20);
glob.width = 240;
glob.group.selectAll("text")
    .data(glob.data).enter()
    .append("text")
    .classed("glob-child", 1)
    .text(function() { return VS.getItem(["\uf46a", "\uf46a\u2009\uf477", "\uf469"]) });
glob.children = d3.selectAll("text");

main.append("text")
    .classed("pc-set", 1)
    .style("opacity", "0") // init value
    .attr("x", center)
    .attr("y", width - textoffset);

function moveIt(){
    var newPitchClassSet = "[0, " + Math.floor(Math.random() * 2 + 1) + ", " + Math.floor(Math.random() * 2 + 3) + "]";

    d3.select(".pc-set")
        .transition(tLong)
        .style("opacity", 0)
        .remove();
    main.append("text")
        .classed("pc-set", 1)
        .style("opacity", 0)
        .attr("x", center)
        .attr("y", width - textoffset)
        .text(newPitchClassSet)
        .transition(tLong)
        .style("opacity", 1);

    glob.children
        .transition()
        .duration(tLong)
        .attr("transform", function() {
            var point = newPoint();
            return "translate(" + point.x + ", " + point.y + ")";
        });
}

for(var i = 0; i < scoreLength; i++) {
    VS.score.add([i * tLong, moveIt]);
}
// final event
VS.score.add([scoreLength * tLong, function() {
    d3.selectAll(".pc-set")
        .transition()
        .duration(tShort)
        .style("opacity", "0");
}]);

VS.score.stopCallback = function() {
    d3.selectAll(".pc-set")
        .transition()
        .duration(tShort)
        .style("opacity", "0");
    glob.children
        .transition()
        .duration(tShort)
        .attr("transform", "translate(0, 0)");
};


// resize

d3.select(window).on("resize", resize);

function resize() {
    // update width
    width = Math.min( parseInt(d3.select("main").style("width"), 10), maxwidth);
    center = width * 0.5;
    innerwidth = width - (margin * 2);

    main
        .style("width", width + "px")
        .style("height", width + "px");
    glob.group.attr("transform",
        "translate(" + center + ", " + center + ")" +
        "scale(" + (width / glob.width) + "," + (width / glob.width) + ")"
        );
    d3.select(".pc-set")
        .attr("x", center)
        .attr("y", width - textoffset);

    if(debug){
        d3.select("rect")
            .attr("width", innerwidth)
            .attr("height", innerwidth);
        d3.select("circle")
            .attr("transform", "translate(" + center + ", " + center + ")");
    }
}

resize();

if(debug) {
    main.classed("debug", true);
    main.append("rect")
        .attr("width", width - (margin * 2))
        .attr("height", width - (margin * 2))
        .attr("transform", "translate(" + margin + ", " + margin + ")");
    main.append("circle")
        .attr("r", 5)
        .attr("transform", "translate(" + center + ", " + center + ")");
}
