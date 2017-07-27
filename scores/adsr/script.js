---
layout: compress-js
---

/**
 * TODO
 * display pitch and timbre inline--and only if there is a change (or make that optional)
 * bounding boxes for phrases? make optional setting?
 * allow option to show note names? or pitch classes? (provided a pitch center)
 * double bar
 * have scores use parts as data, not simple bar index, then fetching parts
 * disambiguate score (svg, display) vs. score (musical data)--also clean up global vars in _score.js
 */
var scaleX = 3,
    unitX = 10 * scaleX,
    unitY = 10,
    view = {},
    // 16 parts is an arbitrary max, ideally large ensembles read from parts
    numParts = clamp(+VS.getQueryString("parts") || 4, 1, 16);

{% include_relative _settings.js %}

var score = (function() {
    var _score = {};

    _score.totalDuration = 300; // TODO recommend length based on *total* number in ensemble, i.e. 8 parts = 600 seconds
    _score.scale = 1;
    _score.width = _score.totalDuration * unitX; // total score duration
    _score.svg = d3.select(".main").attr("width", _score.width);
    _score.wrapper = _score.svg.append("g")
        .attr("transform", "scale(" + _score.scale + "," + _score.scale + ")");
    _score.group = _score.wrapper.append("g");
    _score.layout = {
        group: _score.group.append("g").attr("class", "layout")
    };
    // to help track overall part height
    _score.partLayersY = {
        timbre: -4.5 * unitY,
        pitch: -2.5 * unitY,
        // if flag without notehead, offset y position
        // TODO do not offset dot? would require a separate text element for the dot
        durations: function(d) { return (0 < d && d < 1) ? -0.5 * unitY : 0; },
        articulations: 1.25 * unitY,
        dynamics: 3.5 * unitY
    };
    // calculated from above/rendered
    _score.partHeight = 12 * unitY;

    _score.layoutLayersY = {
        rehearsalLetters: unitY * -2,
        barlines: {
            y1: 3 * unitY,
            y2: (numParts * _score.partHeight) + (6 * unitY)
        },
        barDurations: unitY
    };
    _score.height = _score.layoutLayersY.rehearsalLetters + _score.layoutLayersY.barlines.y2;
    // offset to start first part
    _score.layoutHeight = 11 * unitY;

    return _score;
})();

// symbol dictionary
var dict = (function() {
    var db = VS.dictionary.Bravura;
    return {
        acc: db.accidentals,
        art: db.articulations,
        dur: db.durations.stemless,
        dyn: db.dynamics
    };
})();

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
        .classed("bar-duration", 1)
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
 * Score pointer/cue aid
 */
var cueIndicator = VS.cueTriangle(score.wrapper);
function cueBlink() {
    cueIndicator.blink(1, 0, 0);
}
for (var i = 0; i < 7; i++) {
    VS.cueTriangle(score.layout.group).selection
        .attr("transform", "translate(" +
            (getBarlineX(score.bars[i]) - 6) + ", " +
            -6 * unitY +
            // (view.scoreY - (6 * unitY)) +
            ")")
        .style("opacity", 0.5);
}

/**
 * Ghost beams, for use in score and in performance notes
 * Positioning of group depends on noteheads, not unitX or first note duration
 */
function makeGhost() {

    var x1 = 10, // offset to tie
        attackScale = 0.15,
        attackNum = VS.getItem([7, 8, 9]);
    function ghostAttackSpacing(d, i) {
        return x1 + (unitX * i * attackScale);
    }

    var ghostGroup = d3.select(this).append("g")
        .attr("transform", "translate(" + 10 + ", 0)");

    ghostGroup
        .append("text")
            .text(dict.art["tie"])
            .classed("durations", true)
            .attr("y", score.partLayersY.articulations);
    ghostGroup
        .append("line")
            .attr("class", "ghost-beam")
            .attr("x1", x1)
            .attr("y1", 0)
            .attr("x2", x1 + (unitX * attackNum * attackScale))
            .attr("y2", 0);
    ghostGroup
        .append("text")
            .text(dict.dyn[">"])
            .attr("class", "dynamics")
            .attr("x", x1)
            .attr("y", score.partLayersY.dynamics);

    ghostGroup.selectAll(".ghost-attack")
        .data(d3.range(attackNum))
        .enter()
        .append("line")
            .attr("class", "ghost-attack")
            .attr("x1", ghostAttackSpacing)
            .attr("y1", 0)
            .attr("x2", ghostAttackSpacing)
            .attr("y2", unitY);
}

/**
 * Draw parts
 */
for (p = 0; p < numParts; p++) {
    var thisPart = parts[p],
        partYPos = score.layoutHeight + (p * score.partHeight);

    var partGroup = score.group.append("g")
        .attr("transform", "translate(0, " + partYPos + ")");

    // for each phrase, create a group around a barline
    partGroup.selectAll("g")
        .data(score.bars)
        .enter()
        .append("g")
        .attr("transform", function(d, i) {
            var x = thisPart[i].startTime * unitX;
            return "translate(" + x + ", " + 0 + ")";
        })
        // add phrase content
        .each(function(d, i) {
            var thisPartGroup = d3.select(this);
            var thisPhrase = thisPart[i];
            var prevPhrase = thisPart[i - 1];
            var durations = thisPhrase.durations;
            var dynamics = thisPhrase.dynamics;
            var articulations = thisPhrase.articulations;
            var layersY = score.partLayersY;

            // wrapper to pass phrase durations and use consistent units
            function phraseSpacing(selection) {
                return VS.xByDuration(selection, durations, unitX, 0); // 1px for rect, not noteheads
            }

            function getNestedProp(prop, obj) {
                return prop.split(".").reduce(function(prev, curr) {
                    return prev[curr];
                }, obj || this );
            }

            function hasNewValues(prop) {
                // TODO provide controls to show all
                // TODO starting ghost notes do not have dynamics?
                var showValues = (i === 0) || scoreSettings.showAll;
                return showValues || getNestedProp(prop, thisPhrase) !== getNestedProp(prop, prevPhrase);
            }

            var hasNewPitch = hasNewValues("pitch.low") || hasNewValues("pitch.high");

            if (thisPhrase.timbre !== "bartok" && thisPhrase.timbre !== "ghost") {
                if(hasNewValues("timbre")) {
                    thisPartGroup.append("text")
                        .text(thisPhrase.timbre)
                        .attr("class", "timbre")
                        // stack if both pitch and timbre, otherwise save vertical space
                        .attr("y", hasNewPitch ? layersY.timbre : layersY.pitch + 3);
                }
            } else if (thisPhrase.timbre === "bartok") {
                thisPartGroup.append("text")
                    .text(dict.art["bartok"])
                    .attr("class", "bartok")
                    .attr("y", layersY.timbre);
            }

            var pitchDisplay, pitchDisplayClass;
            if (scoreSettings.pitchDisplay === "accidentals") {
                pitchDisplay = function() {
                    var lo = thisPhrase.pitch.low,
                        hi = thisPhrase.pitch.high;
                    return "\uec82 " + dict.acc[lo] + ( (lo !== hi) ? (" \uf479 " + dict.acc[hi]) : "" ) + " \uec83"; // tenuto as endash
                };
                pitchDisplayClass = "pitch-range";
            } else {
                pitchDisplay = function() {
                    var lo = thisPhrase.pitch.low,
                        hi = thisPhrase.pitch.high,
                        range = lo;
                    if (lo !== hi) {
                        range += " – ";
                        range += (hi === 0) ? hi : "+" + hi;
                    }
                    return "[" + range + "]";
                };
                pitchDisplayClass = "pitch-range-numeric";
            }

            if(hasNewPitch) {
                thisPartGroup.append("text")
                    .text(pitchDisplay)
                    .attr("class", pitchDisplayClass)
                    .attr("y", layersY.pitch);
            }

            thisPartGroup.selectAll(".durations")
                .data(durations)
                .enter()
                .append("text")
                    .text(function(d) {
                        if (!d) {
                            return dict.art["x"]; // x notehead is an articulation, not a duration
                        } else if (d === 1.1) {
                            return "";
                        } else {
                            return dict.dur[d];
                        }
                    })
                    .attr("class", "durations")
                    .attr("y", layersY.durations)
                    .call(phraseSpacing);
            // save this, could be an interesting setting to toggle
            // also, modify box height by pitch range
            // thisPartGroup.selectAll(".durations-rect")
            //     .data(durations)
            //     .enter()
            //     .append("rect")
            //         .attr("rx", 1)
            //         .call(phraseSpacing)
            //         .attr("class", "durations-rect")
            //         .attr("y", 0)
            //         .attr("width", function(d) { return d * unitX; })
            //         .attr("height", unitY)
            //         .attr("fill", "#eee")
            //         .attr("fill-opacity", 0.5);

            if (thisPhrase.timbre === "ghost") {
                makeGhost.call(this);
            }

            // articulations
            thisPartGroup.selectAll(".articulations")
                .data(articulations)
                .enter()
                .append("text")
                    .text(function(d) { return dict.art[d]; })
                    .classed("articulations", true)
                    .attr("y", layersY.articulations)
                    .call(phraseSpacing)
                    .attr("dx", function(d) {
                        return d === "l.v." ? 12 : 0;
                    })
                    .attr("dy", function(d) {
                        return d === "l.v." ? unitY * -0.5 : 0;
                    });

            // dynamics
            if(durations.length > 1 || hasNewValues("dynamics.0")) {
                thisPartGroup.selectAll(".dynamics")
                    .data(dynamics)
                    .enter()
                    .append("text")
                        .text(function(d) {
                            return d === "dim." ? "dim." : dict.dyn[d];
                        })
                        .attr("class", function(d) {
                            return d === "dim." ? "timbre" : "dynamics";
                        })
                        .attr("y", layersY.dynamics)
                        .call(phraseSpacing);
            }
        }); // .each()
}

function scrollScore(index, dur, goToNextBar) {
    var playLastBar = goToNextBar && (index === score.bars.length - 2);
    var targetIndex = goToNextBar ? index + 1 : index, // true = proceed to next bar, false = go to this bar
        targetBar = score.bars[targetIndex];

    // if(goToNextBar && index < 6) { // opening section, up to and including arrival at A
    //     var cardDuration = VS.score.timeAt(index + 1) - VS.score.timeAt(index),
    //         indicatorTime = cardDuration - 3000;
    //     VS.score.schedule(indicatorTime, cueBlink);
    // }

    score.group
        .transition()
        .duration(dur)
        .ease("linear")
        .attr("transform",
            "translate(" + (view.center - getBarlineX(targetBar)) + "," + view.scoreY + ")"
        )
        // fade if playing last bar
        .style("opacity", playLastBar ? 0 : 1);
}

/**
 * Populate score
 * Use a preroll so the score doesn't start scrolling immediately // TODO allow user to define this value? min 3 seconds
 */

// add final event 30 seconds after last bar, for playback
score.bars.push(score.bars[score.bars.length - 1] + 30);

for(var i = 0, len = score.bars.length; i < len; i++) {
    VS.score.add(
        score.bars[i] * 1000,
        (i < len - 1) ? scrollScore : VS.noop,
        [i, getBarDuration(i) * 1000, true]);
}

VS.score.preroll = 3000;

// scoreSettings.preroll.value = (VS.score.preroll * 0.001);

VS.score.playCallback = function() {
    VS.score.schedule(VS.score.preroll - 3000, cueBlink);
}

function scrollCallback() {
    var pointer = VS.score.pointer;
    if (pointer < score.bars.length - 1) {
        scrollScore(VS.score.pointer, 300, false);
    }
    // TODO else: set pointer back a step
}
VS.score.pauseCallback = scrollCallback;
VS.score.stopCallback = scrollCallback;
VS.score.stepCallback = scrollCallback;

function resize() {
    // TODO pause score if playing
    // TODO fix hard-coded Y spacing values
    view.width = parseInt(d3.select("main").style("width"), 10);
    view.height = parseInt(d3.select("main").style("height"), 10);
    score.scale = clamp(view.height / ((score.partHeight * numParts) + (14 * unitY)), 0.1, 2);

    score.svg.attr("height", view.height);
    score.wrapper.attr("transform", "scale(" + score.scale + "," + score.scale + ")");

    view.center = (view.width / score.scale) * 0.5;
    view.scoreY = ((view.height / score.scale) * 0.5) - ((score.height - (4 * unitY)) * 0.5);

    cueIndicator.selection
        .attr("transform", "translate(" +
           (view.center - 6) + "," +
           (view.scoreY - (6 * unitY)) + ")");
        // .style("opacity", 0.5);

    scrollScore(VS.score.pointer, [0]);
}

resize();

d3.select(window).on("resize", resize);

/**
 * Performance notes
 */
VS.cueTriangle(d3.select(".info-cue").attr("width", 12).attr("height", 12));

var infoGhost = d3.select(".info-ghost")
    .attr("width", 60)
    .attr("height", 20)
    .append("g");
makeGhost.call(infoGhost.node());
