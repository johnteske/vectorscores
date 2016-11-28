var width = 480,
    maxwidth = 480,
    margin = 20,
    boxwidth = width + (margin * 2),
    center = boxwidth * 0.5;

var main = d3.select(".main")
    .style("width", boxwidth + "px")
    .style("height", boxwidth + "px");

var globWidth = 120; // fixed, for this test

var debug = VS.getQueryString("debug") == 1 ? true : false;

//
// range generators
//
function rangeGen(length, min, max) {
    var pcs = [];
    for (var i = 0; i < length; i++) {
        pcs.push(Math.floor(Math.random() * (max - min)) + min);
    }
    return pcs;
}

function wedgeRangeGen(length, min, max) {
    var pcs = [];
    var band = (max - min) / length;
    for (var i = 0; i < length; i++) {
        pcs.push(Math.floor(Math.random() * band) + (min + (band * i)));
    }
    return pcs;
}

function stepRangeGen(length, min, max) {
    var pcs = [];
    var disp = 10;
    min += disp;
    max -= disp;
    var lmax,
        lmin;
    var thispc = Math.floor(Math.random() * (max - min)) + min; // initial selection
    for (var i = 0; i < length; i++) {
        lmax = Math.min(thispc + disp, max);
        lmin = Math.max(thispc - disp, min);
        thispc = Math.floor(Math.random() * (lmax - lmin)) + lmin;
        pcs.push(thispc);
    }
    return pcs;
}

//
// make Globject
//
var glob = main.append("g");
function transformGlob() {
    glob.attr("transform", "translate(" + (center - (globWidth*0.5)) + "," + (center - (globWidth*0.5)) + ")");
}

function drawGlobject(this_glob){
    glob = main.append("g");
    var lineData = [];
    for (var i = 0; i < this_glob.rangeEnv.times.length; i++) {
        lineData.push({ "x": this_glob.rangeEnv.times[i], "y": this_glob.rangeEnv.hi[i]});
    }
    var lowData = [];
    for (var i = 0; i < this_glob.rangeEnv.times.length; i++) {
        lowData.push({ "x": this_glob.rangeEnv.times[i], "y": this_glob.rangeEnv.lo[i]});
    }
    // draw the top, back around the bottom, then connect back to the first point
    var datLine = lineData.concat(lowData.reverse());

    var lineFunction = d3.svg.line()
         .x(function(d) { return d.x * globWidth; })
         .y(function(d) { return 127 - d.y; }) // pitch is bottom-up, not pixel top2bottom
         .tension(0.8)
         .interpolate("cardinal-closed");

    var lineGraph = glob.append("path")
        .attr("d", lineFunction(datLine))
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("fill", "none");

    glob.append("text")
        .attr("y", 127 + 24)
        .text("[" + this_glob.pitches.classes + "]");

    var dataset = this_glob.dynamics.values;

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
        .attr("y", 127 + 42)
        .text(function(d) { return d; });
    transformGlob();
}
drawGlobject(new Globject());

//
// resize
//
d3.select(window).on("resize", resize);

function resize() {
    // update width
    boxwidth = Math.min( parseInt(d3.select("main").style("width"), 10), maxwidth);
    center = boxwidth * 0.5;
    width = boxwidth - (margin * 2);

    main
        .style("width", boxwidth + "px")
        .style("height", boxwidth + "px");
    transformGlob();

    if(debug){
        d3.select("rect")
            .attr("width", width)
            .attr("height", width);
        d3.select("circle")
            .attr("transform", "translate(" + center + ", " + center + ")");
    }
}
//
resize();

//
//
//
d3.select("main").on("click", function() { glob.remove(); drawGlobject(new Globject()); });

//
// debug
//
if(debug){
    main.classed("debug", true);
    main.append("rect")
        .attr("width", width)
        .attr("height", width)
        .attr("transform", "translate(" + margin + ", " + margin + ")");
    main.append("circle")
        .attr("r", 5)
        .attr("transform", "translate(" + center + ", " + center + ")");
}
