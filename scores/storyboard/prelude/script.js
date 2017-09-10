---
layout: compress-js
---

// TODO since scenes can be cards or not cards, rename variables and CSS classes to match

var score = {
    totalDuration: 300, // 481 // originally timed for 481 s // NOTE does not scale chords--actual total duration may be longer
    cueBlinks: 2,
    transposeBy: 3
};

score.cueDuration = score.cueBlinks * 1000; // NOTE also changes preroll timing

{% include_relative _card-content.js %}
{% include_relative _score.js %}

var cues = [];
{% include_relative _cue.js %}

{% include_relative _settings.js %}

var dynamicsDict = VS.dictionary.Bravura.dynamics;

// display
var cardWidth = 120,
    cardPadding = 24,
    cardTransTime = 600,
    offset = cardWidth,
    width = (cardWidth * 4) + (cardPadding * 2),
    height = cardWidth * 3;

var main = d3.select(".main")
    .attr("width", width)
    .attr("height", height);

var scaleDuration = (function() {
    var scale = score.totalDuration / 481;

    return function(i) {
        var dur = cardList[i].duration;
        // do not scale chords (2-3 s)
        return dur < 4 ? dur : dur * scale;
    };
})();

function cardX(index) {
    return index * (cardWidth + cardPadding);
}

function makeCue(data, index) {
    var selection = d3.select(this);

    // \ue890 // cue
    // \ue893 // weak cue
    // \ue894 // 2 beat
    // \ue895 // 3 beat
    // \ue896 // 4 beat
    // \ue89a // free

    selection
        .attr("class", "cue bravura")
        .attr("transform", "translate(" + cardX(index) + ", 100)")
        .attr("dy", "-2em")
        .style("text-anchor", data.cue ? "start" : "middle")
        .style("fill", "#888")
        .text(data.cue ? "\ue894" : "\ue893");

    cues[index] = new CueSymbol(selection);
}

function makeCard(data, index) {
    var selection = d3.select(this);

    selection.append("text")
        .attr("class", "card-duration")
        .attr("dy", "-2.5em")
        .text(scaleDuration(index).toFixed(1) + "\u2033");

    selection.append("text")
        .attr("dy", "-1em")
        .text(function(d) {
            var transpose = (typeof d.transpose !== "undefined") ? (d.transpose + score.transposeBy) : "random";
            var pcSet = VS.pitchClass.transpose(d.pcSet, transpose);

            pcSet = pcSet.map(function(pc) {
                return VS.pitchClass.format(pc, scoreSettings.pcFormat);
            });

            return "{" + pcSet.join(",") + "}";
        })
        .classed("pitch-class-set", 1);

    var card = selection.append("g");

    if (data.type === "card") {
        card.append("rect")
            .attr("width", cardWidth)
            .attr("height", cardWidth);
    } else {
        card.append("line")
            .attr("class", "barline")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", cardWidth);
    }

    for (var ci = 0; ci < data.content.length; ci++) {
        var content = data.content[ci];
        card.call(content.type, content.args);
    }

    selection.append("g")
        .attr("class", "dynamics")
        .attr("transform", "translate(0, " + cardWidth + ")")
        .selectAll("text")
        .data(function(d) {
            return d.dynamics;
        })
        .enter()
        .append("text")
        .attr("x", function(d) {
            return d.time * cardWidth;
        })
        .attr("text-anchor", function (d) {
            var anchor = "start";

            if (d.time === 0.5) {
                anchor = "middle";
            } else if (d.time === 1) {
                anchor = "end";
            }

            return anchor;
        })
        .attr("dx", function (d) {
            return d.time === 0 ? "0.125em" : 0;
        })
        .attr("dy", "1em")
        .text(function(d) { return dynamicsDict[d.value]; });
}

// create cards
var cardGroup = main.append("g")
    .attr("transform", "translate(" + offset + ", 0)");
var cards = cardGroup.selectAll(".card")
    .data(cardList)
    .enter()
    .append("g")
    .classed("card", 1)
    .each(makeCard)
    .attr("transform", function(d, i) { return "translate(" + cardX(i) + ", 100)"; })
    .style("opacity", function(d, i) { return 1 - (i * (0.5)); });

// create cues
cardGroup.selectAll(".cue")
    .data(cardList)
    .enter()
    .append("text")
    .each(makeCue);

function showNextCue(selection, pointer, dur) {
    selection
        .transition()
        .duration(dur)
        .style("opacity", function(d, i) {
            return i === (pointer + 1) ? 1 : 0;
        });
}

// var cueIndicator = VS.cueTriangle(main);
// cueIndicator.selection.style("opacity", "0");

function goToCard(index, control) {
    var pointer = (typeof index !== "undefined") ? index : VS.score.pointer;
    var dur = cardTransTime;
    cardGroup.transition()
        .duration(dur)
        .attr("transform", function() {
            var x = offset - cardX(pointer);
            return "translate(" + x + ", 0)";
        });

    d3.selectAll(".cue").call(showNextCue, pointer, dur);

    cards.transition()
        .duration(dur)
        .style("opacity", function(d, i) {
            // if rolling back to begin play, hide previous cards
            var p = control === "play" ? pointer + 1 : pointer;

            if(p > i ){
                return 0;
            }
            else {
                return (0.5 * (pointer - i)) + 1;
            }
        });

    // if playing and not skipping, stopping
    // if(control === "score") { updateCardIndicator(index); } // cue all
    // if(control === "score" && cardList[pointer + 1].cue) { updateCardIndicator(index); } // only cue if set in score
    if(control === "score") { scheduleCue(index); }
}

// function cueBlink() {
//     cueIndicator.blink(1, 0, 0, score.cueBlinks);
//     cueIndicator.selection
//         .attr("transform", "translate(" + (cardX(1) + offset) + ", 36)")
//         .style("opacity", "1")
//         .transition()
//         .delay(score.cueDuration)
//         .duration(cardTransTime)
//         .attr("transform", "translate(" + (cardX(0) + offset) + ", 36)")
//         .style("opacity", "0");
// }
// function cueCancel() {
//     // cueIndicator.cancel();
//     cueIndicator.selection
//         .transition()
//         .style("opacity", "0");
// }

// function updateCardIndicator(pointer) {
//     var cardDuration = VS.score.timeAt(pointer + 1) - VS.score.timeAt(pointer),
//         blinkDuration = score.cueDuration,
//         indicatorTime = cardDuration - blinkDuration;
//
//     VS.score.schedule(indicatorTime, cueBlink);
// }

function cueBlink2(pointer) {
    cues[pointer + 1].blink(2);
}

function cueCancel2() {
    for (var i = 0; i < cues.length; i++) {
        cues[i].cancel();
    }
}

function scheduleCue(pointer) {
    var cardDuration = VS.score.timeAt(pointer + 1) - VS.score.timeAt(pointer),
        blinkDuration = score.cueDuration,
        indicatorTime = cardDuration - blinkDuration;

    VS.score.schedule(indicatorTime, cueBlink2, pointer);
}

var addEvent = (function() {
    var time = 0;

    return function(fn, duration, args) {
        VS.score.add(time, fn, args);
        time += duration;
    };
})();

// create score events from card durations
for (var i = 0; i < cardList.length; i++) {
    addEvent(goToCard, scaleDuration(i) * 1000, [i, "score"]);
}
// and final noop after last card
addEvent(VS.noop);

VS.score.preroll = score.cueDuration; // cardTransTime;

VS.score.playCallback = function() {
    goToCard(VS.score.pointer - 1, "play");
    // VS.score.schedule(VS.score.preroll - score.cueDuration, cueBlink);
    VS.score.schedule(VS.score.preroll - score.cueDuration, cueBlink2, VS.score.pointer - 1);
};

VS.score.pauseCallback = VS.score.stopCallback = function() {
    cueCancel2();
    goToCard();
    // cueCancel();
};

VS.control.stepCallback = goToCard;
