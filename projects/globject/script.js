---
---
var width = 480,
    maxwidth = 480,
    margin = 20,
    boxwidth = width + (margin * 2),
    center = boxwidth * 0.5;

var main = d3.select(".main")
    .style("width", boxwidth + "px")
    .style("height", boxwidth + "px");

var glob,
    globWidth = 120; // fixed size, for this test

var debug = VS.getQueryString("debug") == 1 ? true : false;

{% include_relative globject.js %}

{% include_relative rangeGen.js %}


// make Globject

var glob = main.append("g");

function transformGlob() {
    glob.attr("transform", "translate(" +
      (center - (globWidth * 0.5)) + "," +
      (center - (globWidth * 0.5)) + ")");
}

function randRangeGenerator() {
    return VS.getItem([rangeGen, wedgeRangeGen, stepRangeGen]);
}

function makeGlobject() {
    var _newGlob = new Globject(),
        hiRangeGen = randRangeGenerator(),
        loRangeGen = randRangeGenerator();
    _newGlob.rangeEnv =  {
        type: "midi",
        hi: hiRangeGen(4, 64, 127),
        lo: loRangeGen(4, 0, 63),
        times: [0, 0.3, 0.5, 1] // may want independent times for hi and lo
    };
    _newGlob.pitches = {
        classes: [0, 2, 6],
        weight: [0.5, 0.25, 0.25]
    };
    _newGlob.duration = {
        values: [0.5, 0.75, 1],
        weights: [0.5, 0.25, 0.25]
    };
    _newGlob.articulation = {
        values: [">", "_", "."],
        weights: [0.5, 0.25, 0.25]
    };
    _newGlob.dynamics = { // global
        values: ["mp", "cres.", "f"],
        dur: [0, 0.5, 1] //
    };
    return _newGlob;
}

function drawGlobject(this_glob){
    glob = main.append("g");
    var lineData = [],
        lowData = [];

    for (var i = 0; i < this_glob.rangeEnv.times.length; i++) {
        lineData.push({ "x": this_glob.rangeEnv.times[i], "y": this_glob.rangeEnv.hi[i]});
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
drawGlobject(makeGlobject());

// resize

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

// d3.select("main").on("click", function() { glob.remove(); drawGlobject(new Globject()); });
function refreshGlobject() {
    glob.remove();
    drawGlobject(makeGlobject());
}

// populate score
for(var i = 0; i < 10; i++) {
    VS.score.add([
        (i * 2000) + (1000 * Math.random()),
        refreshGlobject
    ]);
}

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
