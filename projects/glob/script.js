---
layout: compress-js
---
// initial values
var globWidth = 240,
    radius = 48,
    // radius = globWidth * 5, // should be relative to width somehow
    margin = 20,
    innerwidth = 240, // placeholder name
    maxwidth = 400,
    width = innerwidth + (margin * 2),
    center = width * 0.5,
    scale = (width / 9600),
    tLong = 3000,
    tShort = 1500;
var textoffset = 5;
var noteheads = [
    // "M397 -1597q0 12 6 30q49 131 49 305t-56 302t-179 285t-217 173v490q0 31 20 30q53 0 62 -45q43 -254 223 -534q236 -375 236 -703q0 -143 -41 -301l-13 -53q-6 -25 -26 -35t-31 -4q-33 23 -33 60z", // eighth flag
    "M223 -289q-96 0 -160 52q-63 52 -63 141q0 152 134 268t321 117q100 0 162 -53t63 -140q0 -143 -150 -264t-307 -121z", // quarter
    // "M625 96q0 28 -15 54q-30 49 -98 49t-227 -93q-215 -123 -215 -210q0 -23 14 -48q31 -53 107 -53t219 96q215 141 215 205zM234 -297q-106 0 -170 52t-64 153t98 235q50 66 146 110t210 44t180 -54q64 -54 64 -139t-43 -161t-91 -124t-136 -82t-194 -34z" // half
];
var halfNoteheadWidth = 340;
var debug = VS.getQueryString("debug") == 1 || false;

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

var glob = new Glob(main, 12, "ellipse");
glob.children
    .attr("cx", 5)
    .attr("cy", 5)
    .attr("rx", 5) // 4, rotate(60) to approx quarter notehead
    .attr("ry", 5);

function centerNotehead() {
    return "translate(0, 0)";
    // return "scale(" + scale + ", " + (-1 * scale) + ") translate(-" + halfNoteheadWidth + ", 0)";
}
function transformNotehead() {
    var point = newPoint();
    return "translate(" + (point.x) + ", " + point.y + ")";
    // return "scale(" + scale + ", " + (-1 * scale) + ") translate(" + (point.x - halfNoteheadWidth) + ", " + point.y + ")";
}

main.append("text")
    .style("opacity", "0") // init value
    .attr("x", center)
    .attr("y", width - textoffset);

function moveIt(){
    var newPitchClassSet = "[0, " + Math.floor(Math.random() * 2 + 1) + ", " + Math.floor(Math.random() * 2 + 3) + "]";

    d3.select("text")
        .transition(tLong)
        .style("opacity", 0)
        .remove();
    main.append("text")
        .style("opacity", 0)
        .attr("x", center)
        .attr("y", width - textoffset)
        .text(newPitchClassSet)
        .transition(tLong)
        .style("opacity", 1);

    d3.selectAll("ellipse")
        .transition()
        .duration(tLong)
        .attr("transform", transformNotehead);
}

for(i = 0; i < 10; i++) {
    VS.score.add([i * tLong, moveIt]);
}
// final event
VS.score.add([i * tLong, function() {
    d3.selectAll("text")
        .transition()
        .duration(tShort)
        .style("opacity", "0");
}]);

VS.score.stopCallback = function() {
    d3.selectAll("text")
        .transition()
        .duration(tShort)
        .style("opacity", "0");
    d3.selectAll("ellipse")
        .transition()
        .duration(tShort)
        .attr("transform", centerNotehead);
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
        "scale(" + (width / globWidth) + "," + (width / globWidth) + ")"
        );
    d3.select("text")
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
