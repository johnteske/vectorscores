var width = 480,
    maxwidth = 480,
    margin = 20,
    boxwidth = width + (margin * 2);

var main = d3.select(".main")
    .style('width', boxwidth + 'px')
    .style('height', boxwidth + 'px');

globWidth = 120; // fixed, for this test

globject = {
    rangeEnv: {
        type: 'midi',
        hi: [68, 119, 104, 70],
        lo: [20, 25, 42, 23]
    },
    pitches: {
        classes: [0, 2, 6],
        weight: [0.5, 0.25, 0.25]
    },
    duration: {
        values: [0.5, 0.75, 1],
        weights: [0.5, 0.25, 0.25]
    },
    articulation: {
        values: [">", "_", "."],
        weights: [0.5, 0.25, 0.25]
    },
    dynamics: { // global
        values: ["mp", "cres.", "f"],
        dur: [0, 0.5, 1] //
    }
};

var glob = main.append("g");

var lineData = [
    { "x": 0, "y": globject.rangeEnv.hi[0]},
    { "x": globWidth * 0.5, "y": globject.rangeEnv.hi[1]},
    { "x": globWidth, "y": globject.rangeEnv.hi[2]}];
var lowData = [
    { "x": 0, "y": globject.rangeEnv.lo[0]},
    { "x": globWidth * 0.5, "y": globject.rangeEnv.lo[1]},
    { "x": globWidth, "y": globject.rangeEnv.lo[2]}];

// draw the top, back around the bottom, then connect back to the first point
var datLine = lineData.concat(lowData.reverse());
// .concat(lineData[0]);

var lineFunction = d3.svg.line()
     .x(function(d) { return d.x + 10; }) // a little offset
     .y(function(d) { return 127 - d.y; }) // pitch is bottom-up, not pixel top2bottom
     .tension(0.8)
     .interpolate("cardinal-closed");

//The line SVG Path we draw
var lineGraph = glob.append("path")
    .attr("d", lineFunction(datLine))
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("fill", "none");

// var textarr = [
//     { "x": 0, "y": 10},
//     { "x": 0, "y": 20},
//     { "x": 0, "y": 50}
// ];
// var texts = glob.append("text")
//     .attr("d", textarr);

glob.append("text")
    .attr("y", 127 + 12)
    .text("[" + globject.pitches.classes + "]");

var dataset = globject.dynamics.values;

var textline = glob.append("g");

textline.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .attr("x", function(d, i) {
            // evenly spaced, for now
            var l = dataset.length - 1;
            return i * (globWidth / l);
        })
    .attr("y", 127 + 32)
    .text(function(d) { return d; });

// glob.attr("transform", "translate(" + ((width * 0.5) - globWidth) + "," + 127 + ")");

// resize

d3.select(window).on('resize', resize);

function resize() {
    // update width
    boxwidth = Math.min( parseInt(d3.select('main').style('width'), 10), maxwidth);
    center = boxwidth * 0.5;
    width = boxwidth - (margin * 2);

    main
        .style('width', boxwidth + 'px')
        .style('height', boxwidth + 'px');
    glob.attr("transform", "translate(" + (center - (globWidth*0.5)) + "," + (center - (globWidth*0.5)) + ")");

    // debug
    d3.select('rect')
        .attr("width", width)
        .attr("height", width);
    d3.select('circle')
        .attr("transform", "translate(" + center + ", " + center + ")");
}
//
resize();
//
main.classed("debug", true);
main.append("rect")
    .attr("width", width)
    .attr("height", width)
    .attr("transform", "translate(" + margin + ", " + margin + ")");
main.append("circle")
    .attr("r", 5)
    .attr("transform", "translate(" + center + ", " + center + ")");
