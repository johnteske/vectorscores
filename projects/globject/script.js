---
---
var width = 480,
    maxwidth = 480,
    margin = 20,
    boxwidth = width + (margin * 2),
    center = boxwidth * 0.5,
    globLeft = 5;
    debug = false;

var main = d3.select(".main")
    .style("width", boxwidth + "px")
    .style("height", boxwidth + "px");

{% include_relative globject.js %}
var theGlob = new Globject(150);

{% include_relative rangeGen.js %}


// make Globject

var globGroup;// = main.append("g");

function transformGlob() {
    globGroup
        .attr("transform", "translate(" +
            (center - (theGlob.width * 0.5)) + "," +
            (center - (120 * 0.5)) + ")");
}

function randRangeGenerator() {
    return VS.getItem([rangeGen, wedgeRangeGen, stepRangeGen]);
}

function makeGlobject() {
    var hiRangeGen = randRangeGenerator(),
        loRangeGen = randRangeGenerator(),
        dynamics = ["ppp", "pp", "p", "mp", "mf", "f", "ff", "fff"],
        newDynamics = ["","",""];

    globGroup = main.append("g");

    theGlob.width = Math.round(VS.getRandExcl(100,200));

    theGlob.setRangeEnvelopes(
        "midi",
        hiRangeGen(4, 64, 127),
        loRangeGen(4, 0, 63),
        [0, 0.3, 0.5, 1]
    );

    theGlob.setPitchClassSets(
        [
            [ 0, Math.round(VS.getRandExcl(1,3)) ],
            [ 0, Math.round(VS.getRandExcl(1,3)), Math.round(VS.getRandExcl(4,7)) ]
        ],
        [0, (Math.random() * 0.2) + 0.4]
    );

    // theGlob.duration = {
    //     values: [0.5, 0.75, 1],
    //     weights: [0.5, 0.25, 0.25]
    // };
    // theGlob.articulation = {
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

    theGlob.setDynamics(newDynamics, [0, 0.5, 1]);

    theGlob.rangeClip =
    globGroup.append("clipPath")
        .attr("id", "glob-clip")
        .append("path")
        .attr("transform", "translate(" + globLeft + "," + 0 + ")");

    globGroup
        .append("rect")
        .attr("clip-path", "url(#glob-clip)")
        .style("fill", "#eee")
        // .style("fill", "none")
        // cannot use getBBox() on clipPath
        .attr("height", 150) // max 127?
        .attr("width", theGlob.width + (globLeft * 2));

    theGlob.rangePath =
    globGroup.append("path")
        .attr("transform", "translate(" + globLeft + "," + 0 + ")")
        .classed("globject", 1);

    theGlob.pitchClassGroup = globGroup.append("g");
    theGlob.dynamicsGroup = globGroup.append("g");

    return theGlob;
}
makeGlobject();

function drawGlobject(){
    var lineData = [],
        lowData = [];

    for (var i = 0; i < theGlob.rangeEnvelope.times.length; i++) {
        lineData.push({ "x": theGlob.rangeEnvelope.times[i], "y": theGlob.rangeEnvelope.hi[i]});
        lowData.push({ "x": theGlob.rangeEnvelope.times[i], "y": theGlob.rangeEnvelope.lo[i]});
    }

    // draw the top, back around the bottom, then connect back to the first point
    var datLine = lineData.concat(lowData.reverse());

    var lineFunction = d3.svg.line()
         .x(function(d) { return d.x * theGlob.width; })
         .y(function(d) { return 127 - d.y; }) // pitch is bottom-up, not pixel top2bottom
         .tension(0.8)
         .interpolate("cardinal-closed");

     theGlob.rangeClip
        //  .transition(300)
         .attr("d", lineFunction(datLine));
     theGlob.rangePath
        //  .transition(300)
         .attr("d", lineFunction(datLine));

    theGlob.pitchClassGroup.remove();
    theGlob.pitchClassGroup = globGroup.append("g");

    theGlob.pitchClassGroup.selectAll("text")
        .data(theGlob.pitches.classes)
        .enter()
        .append("text")
        .attr("x", function(d, i) {
            return theGlob.pitches.times[i] * theGlob.width;
        })
        .attr("y", 127 + 24)
        .text(function(d) { return "[" + d + "]"; });

    theGlob.dynamicsGroup.remove();
    theGlob.dynamicsGroup = globGroup.append("g");

    theGlob.dynamicsGroup.selectAll("text")
        .data(theGlob.dynamics.values)
        .enter()
        .append("text")
        .attr("x", function(d, i) {
            return theGlob.dynamics.times[i] * theGlob.width;
        })
        .attr("y", 127 + 42)
        .text(function(d) { return d; });

    transformGlob();
}
drawGlobject();

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

    if(debug){ resizeDebug(width, center); }
}
resize();

function refreshGlobject() {
    globGroup.remove();
    makeGlobject();
    drawGlobject();
}

// populate score
for(var i = 0; i < 10; i++) {
    VS.score.add([
        (i * 2000) + (1000 * Math.random()),
        refreshGlobject
    ]);
}

{% include_relative _debug.js %}
