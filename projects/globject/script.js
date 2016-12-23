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

var glob;

var debug = VS.getQueryString("debug") == 1 ? true : false;

{% include_relative globject.js %}

{% include_relative rangeGen.js %}


// make Globject

var globGroup = main.append("g");

function transformGlob() {
    var groupWidth = globGroup.node().getBBox().width;
    globGroup.attr("transform", "translate(" +
        (center - (groupWidth * 0.5)) + "," +
        (center - (120 * 0.5)) + ")");
}

function randRangeGenerator() {
    return VS.getItem([rangeGen, wedgeRangeGen, stepRangeGen]);
}

function makeGlobject() {
    var _newGlob = new Globject( Math.round(VS.getRandExcl(100,200)) ),
        hiRangeGen = randRangeGenerator(),
        loRangeGen = randRangeGenerator(),
        dynamics = ["ppp", "pp", "p", "mp", "mf", "f", "ff", "fff"],
        newDynamics = ["","",""];

    _newGlob.setRangeEnvelopes(
        "midi",
        hiRangeGen(4, 64, 127),
        loRangeGen(4, 0, 63),
        [0, 0.3, 0.5, 1]
    );

    _newGlob.setPitchClassSets(
        [
            [ 0, Math.round(VS.getRandExcl(1,3)) ],
            [ 0, Math.round(VS.getRandExcl(1,3)), Math.round(VS.getRandExcl(4,7)) ]
        ],
        [0, (Math.random() * 0.2) + 0.4]
    );

    // _newGlob.duration = {
    //     values: [0.5, 0.75, 1],
    //     weights: [0.5, 0.25, 0.25]
    // };
    // _newGlob.articulation = {
    //     values: [">", "_", "."],
    //     weights: [0.5, 0.25, 0.25]
    // };

    newDynamics[0] = VS.getItem(dynamics);
    newDynamics[2] = VS.getItem(dynamics);
    if(dynamics.indexOf(newDynamics[0]) > dynamics.indexOf(newDynamics[2])) {
        newDynamics[1] = "dim.";
    } else if (dynamics.indexOf(newDynamics[0]) < dynamics.indexOf(newDynamics[2])) {
        newDynamics[1] = "cres.";
    } else {
        newDynamics[1] = "subito " + VS.getItem(dynamics);
        newDynamics[2] = "";
    }

    _newGlob.setDynamics(newDynamics, [0, 0.5, 1]);

    return _newGlob;
}

function drawGlobject(this_glob){
    globGroup = main.append("g");
    var lineData = [],
        lowData = [];

    for (var i = 0; i < this_glob.rangeEnvelope.times.length; i++) {
        lineData.push({ "x": this_glob.rangeEnvelope.times[i], "y": this_glob.rangeEnvelope.hi[i]});
        lowData.push({ "x": this_glob.rangeEnvelope.times[i], "y": this_glob.rangeEnvelope.lo[i]});
    }

    // draw the top, back around the bottom, then connect back to the first point
    var datLine = lineData.concat(lowData.reverse());

    var lineFunction = d3.svg.line()
         .x(function(d) { return d.x * this_glob.width; })
         .y(function(d) { return 127 - d.y; }) // pitch is bottom-up, not pixel top2bottom
         .tension(0.8)
         .interpolate("cardinal-closed");

    this_glob.rangePath = globGroup.append("path")
        .attr("d", lineFunction(datLine))
        .classed("globject", 1);

    this_glob.pitchClassGroup = globGroup.append("g");

    this_glob.pitchClassGroup.selectAll("text")
        .data(this_glob.pitches.classes)
        .enter()
        .append("text")
        .attr("x", function(d, i) {
            return this_glob.pitches.times[i] * this_glob.width;
        })
        .attr("y", 127 + 24)
        .text(function(d) { return "[" + d + "]"; });

    this_glob.dynamicsGroup = globGroup.append("g");

    this_glob.dynamicsGroup.selectAll("text")
        .data(this_glob.dynamics.values)
        .enter()
        .append("text")
        .attr("x", function(d, i) {
            return this_glob.dynamics.times[i] * this_glob.width;
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
    globGroup.remove();
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
