---
# // adapted from original SuperCollider code
---
/**
 * TODO
 * score.width can be 8000 but svg width does not need to be
 * display pitch and timbre inline--and only if there is a change (or make that optional)
 * bounding boxes for phrases? make optional setting?
 * dynamics
 * timeDispersion looks very quantized
 * articulation
 * allow option to show note names? or pitch classes?
 * tie, ghost notes
 * x notehead
 * bartok pizz symbol
 * double bar
 * error-check if score height exceeds view and/or auto-scale to fit
 * current bar indicator (not debug line)--similar to storyboard indicator?
 * also use flashing indicator when the piece is starting, to time the snap pizz
 */
 var unit = 10,
     // calculated in resize()
     view = {
         width: 0,
         height: 0,
         center: 0
     },
     numParts = +VS.getQueryString("parts") || 4,
     debug = false;

var score = (function() {
    var _score = {};

    _score.width = 8000;
    _score.svg = d3.select(".main").attr("width", _score.width);
    _score.group = _score.svg.append("g");
    _score.layout = {
        group: _score.group.append("g").attr("class", "layout")
    };
    // to help track overall part height
    _score.partLayersY = {
        timbre: -5 * unit,
        pitch: -3 * unit,
        durations: function(d) { return (d > 0 && d < 1) ? -0.5 * unit : 0; },
        articulations: 1.25 * unit,
        dynamics: 3.5 * unit
    };
    // calculated from above/rendered
    _score.partHeight = 12 * unit;

    _score.layoutLayersY = {
        rehearsalLetters: unit * -2,
        barlines: {
            y1: 3 * unit,
            y2: (numParts * _score.partHeight) + (6 * unit)
        },
        barDurations: unit
    };
    // rehearsalLetters = unit * 2
    _score.height = (unit * 2) + _score.layoutLayersY.barlines.y2;
    // offset to start first part
    _score.layoutHeight = 12 * unit;

    return _score;
})();

// symbol dictionary
{% include_relative _symbols.js %}

// generate score
{% include_relative _score.js %}

function getBarDuration(ndex) {
    return score.bars[ndex + 1] - score.bars[ndex];
}
function getBarlineX(bar) {
    return (score.width * bar) / score.totalDuration;
}
function decimalRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

// create barlines
score.layout.group
    .append("g")
    .selectAll("line")
    .data(score.bars)
    .enter()
    .append("line")
        .attr("x1", 0)
        .attr("y1", score.layoutLayersY.barlines.y1)
        .attr("x2", 0)
        .attr("y2", score.layoutLayersY.barlines.y2)
    .attr("transform", function(d) {
        return "translate(" + getBarlineX(d) + ", " + 0 + ")";
    });

// show durations over barlines
score.layout.group
    .append("g")
    .selectAll("text")
    .data(score.bars)
    .enter()
    .append("text")
        .text(function(d, i) {
            var dur = getBarDuration(i);
            // do not display last bar's duration
            return i < score.bars.length - 1 ? decimalRound(dur, 1) + "\u2033" : "";
        })
        .classed("duration", 1)
        .attr("transform", function(d) {
            return "translate(" + getBarlineX(d) + ", " + score.layoutLayersY.barDurations + ")";
        });

// show rehearsal letters
score.layout.letters = score.layout.group.append("g")
    .selectAll("g")
    .data(score.rehearsalLetters)
    .enter()
    .append("g")
    .attr("transform", function(d) {
        return "translate(" + getBarlineX(score.bars[d.index]) + ", " + score.layoutLayersY.rehearsalLetters + ")";
    });
score.layout.letters.each(function() {
    var thisLetter = d3.select(this);

    thisLetter.append("rect")
        .attr("y", -15)
        .attr("width", 20)
        .attr("height", 20);

    thisLetter.append("text")
        .text(function(d) {
            return d.letter;
        })
        .attr("dx", "0.25em");
});

/**
 * Draw parts
 */
for (p = 0; p < numParts; p++) {
    var thisPart = parts[p],
        partYPos = score.layoutHeight + (p * score.partHeight),
        partGroup = score.group.append("g");

    partGroup.attr("transform", "translate(0, " + partYPos + ")");

    // for each phrase, create a group around a barline
    partGroup.selectAll("g")
        .data(score.bars)
        .enter()
        .append("g")
        .attr("transform", function(d, i) {
            var timeDispersion = part[i].timeDispersion,
                x = getBarlineX(d) + (VS.getItem([-1, 1]) * timeDispersion * unit); // TODO +/- timeDispersion
            return "translate(" + x + ", " + 0 + ")";
        })
        // add phrase content
        .each(function(d, i) {
            var durations = thisPart[i].durations;
            var dynamics = thisPart[i].dynamics;
            var articulations = thisPart[i].articulations;
            var layersY = score.partLayersY;

            function phraseSpacing(d, i) {
                var upToI = durations.slice(0, i),
                    sum = upToI.reduce(function(a, b) {
                        return a + b + 1; // add padding between here
                    }, 0);
                return sum * unit;
            }

            d3.select(this).append("text")
                .text(thisPart[i].timbre)
                .classed("timbre", true)
                .attr("y", layersY.timbre);

            d3.select(this).append("text")
                .text(function() {
                    var lo = thisPart[i].pitch.low,
                        hi = thisPart[i].pitch.high;
                    return "\uec82 " + pitchDict[lo] + ( (lo !== hi) ? (" – " + pitchDict[hi]) : "" ) + " \uec83";
                })
                .classed("pitch-range", true)
                .attr("y", layersY.pitch);

            d3.select(this).selectAll(".durations")
                .data(durations)
                .enter()
                .append("text")
                    .text(function(d) { return durDict[d]; })
                    .classed("durations", true)
                    // if flag without notehead, offset y position
                    // TODO do not offset dot?
                    .attr("y", layersY.durations)
                    .attr("x", phraseSpacing);
            // // save this, could be an interesting setting to toggle
            // // also, modify box height by pitch range
            // d3.select(this).selectAll(".durations")
            //     .data(durations)
            //     .enter()
            //     .append("rect")
            //         .attr("rx", 1)
            //         .attr("x", phraseSpacing)
            //         .attr("y", function(d, i) { return 0; })
            //         .attr("width", function(d) { return d * unit; })
            //         .attr("height", unit);

            // articulations
            d3.select(this).selectAll(".articulations")
                .data(articulations)
                .enter()
                .append("text")
                    .text(function(d) { return artDict[d]; })
                    .classed("durations", true)
                    .attr("y", layersY.articulations)
                    .attr("x", phraseSpacing);

            // dynamics
            d3.select(this).selectAll(".dynamics")
                .data(dynamics)
                .enter()
                .append("text")
                    .text(function(d) { return dynamicsDict[d]; })
                    .attr("class", function(d) {
                        return d === "dim." ? "timbre" : "dynamics";
                    })
                    .attr("y", layersY.dynamics)
                    .attr("x", phraseSpacing);
        }); // .each()
}

function scrollScore(ndex, params) {
    var dur = params[0];
    var targetIndex = params[1] ? ndex + 1 : ndex; // true = proceed to next bar, false = go to this bar
    var targetBar = score.bars[targetIndex];
    var scoreGroupHeight = score.height * 0.5;
    score.group
        .transition()
        .duration(dur)
        .ease("linear")
        .attr("transform", function() {
            // TODO calculate score vertical center positions on resize and store--don't calc on every scroll
            return "translate(" +
                (view.center - getBarlineX(targetBar)) + "," +
                ((view.height * 0.5) - scoreGroupHeight) +
                ")";
        });
}

/**
 * Populate score
 * Use a preroll so the score doesn't start scrolling immediately // TODO allow user to define this value
 */
// VS.score.preroll = 600;

for(i = 0; i < score.bars.length; i++) {
    var duration = getBarDuration(i);
    VS.score.add([ score.bars[i] * 1000, scrollScore, [duration * 1000, true] ]); // time, func, [duration, go to next bar]
}

VS.score.pauseCallback = function(){ scrollScore(VS.score.pointer, [300]); };
VS.score.stopCallback = function(){ scrollScore(0, [300]); };
VS.score.stepCallback = function(){ scrollScore(VS.score.pointer, [300]); };

{% include_relative _debug.js %}
{% include_relative _settings.js %}

function resize() {
    // TODO pause score if playing
    view.width = parseInt(d3.select("main").style("width"), 10);
    view.center = view.width * 0.5;
    view.height = parseInt(d3.select("main").style("height"), 10);

    score.svg.attr("height", view.height);

    if(debug){ resizeDebug(); }

    scrollScore(VS.score.pointer, [0]);
}

resize();

d3.select(window).on("resize", resize);
