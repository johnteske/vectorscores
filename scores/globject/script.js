---
---
var width = 480,
    maxwidth = 480,
    margin = 20,
    boxwidth = width + (margin * 2),
    center = boxwidth * 0.5,
    globLeft = 5,
    debug = false;

var main = d3.select(".main")
    .style("width", boxwidth + "px")
    .style("height", boxwidth + "px");

var noteheads = VS.dictionary.Bravura.durations.stemless;

{% include_relative _globject.js %}
var theGlob = new Globject(150);

{% include_relative _rangeGen.js %}
{% include_relative _score.js %}

// make Globject

var globGroup;// = main.append("g");

function transformGlob() {
    globGroup
        .attr("transform", "translate(" +
            (center - (theGlob.width * 0.5)) + "," +
            (center - (120 * 0.5)) + ")");
}

function drawGlobject(){
    var lineData = [],
        lowData = [];

    globGroup = main.append("g");

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

    theGlob.rangeClip =
    globGroup.append("clipPath")
        .attr("id", "glob-clip")
        .append("path")
        .attr("transform", "translate(" + globLeft + "," + 0 + ")")
        //  .transition(300)
        .attr("d", lineFunction(datLine));

    theGlob.globStuff =
    globGroup.append("g")
    .classed("globstuff", 1)
    .attr("clip-path", "url(#glob-clip)");

    function phraseSpacing(selection) {
        var durations = theGlob.phraseTexture;
        return VS.xByDuration(selection, durations, 18, 0) + 64;
    }

    for (var i = 0, phrases = 16; i < phrases; i++) {
        theGlob.globStuff.append("g")
            .attr("transform", function() {
                var y = (127 / phrases) * i;
                return "translate(" + Math.random() * theGlob.width + "," + y + ")"
            })
            .selectAll("text")
            .data(theGlob.phraseTexture)
            .enter()
            .append("text")
            .text(function(d) {
                return noteheads[d];
            })
            .call(phraseSpacing);
    }

    theGlob.rangePath =
    globGroup.append("path")
         .attr("transform", "translate(" + globLeft + "," + 0 + ")")
         .classed("globject", 1)
         //  .transition(300)
         .attr("d", lineFunction(datLine));

    theGlob.pitchClassGroup = globGroup.append("g");

    theGlob.pitchClassGroup.selectAll("text")
        .data(theGlob.pitches.classes)
        .enter()
        .append("text")
        .attr("x", function(d, i) {
            return theGlob.pitches.times[i] * theGlob.width;
        })
        .attr("y", 127 + 24)
        .text(function(d) {
            var pcSet = d.map(function(pc) {
                return pcFormat(pc, ""); // scoreSettings.pcFormat
                // return pcFormat(pc, "name"); // scoreSettings.pcFormat
            });
            return "[" + pcSet.join(", ") + "]";
        })

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
    VS.score.add(
        (i * 2000) + (1000 * Math.random()),
        refreshGlobject
    );
}
VS.control.stepCallback = refreshGlobject;

{% include_relative _debug.js %}
