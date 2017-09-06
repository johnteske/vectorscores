---
layout: compress-js
---

var score = {
    totalDuration: 300, // 481 // originally timed for 481 s // NOTE does not scale chords--actual total duration may be longer
    cueBlinks: 2
};

score.cueDuration = score.cueBlinks * 1000 // NOTE also changes preroll timing

{% include_relative _score.js %}
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
    }
})();

function cardX(index) {
    return index * (cardWidth + cardPadding);
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
            var pcSet = d.pcSet.map(function(pc) {
                return VS.pitchClass.format(pc, scoreSettings.pcFormat);
            });
            return "{" + pcSet.join(",") + "}";
        })
        .classed("pitch-class-set", 1);

    var card = selection.append("g");

    card.append("rect")
        .attr("width", cardWidth)
        .attr("height", cardWidth);

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
            // TODO better handle dynamics at time: 1
            return d.time * (cardWidth - 11);
        })
        .attr("dx", "0.125em")
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

var cueIndicator = VS.cueTriangle(main);
cueIndicator.selection.style("opacity", "0");

function goToCard(index, control) {
    var pointer = (typeof index !== "undefined") ? index : VS.score.pointer;
    var dur = cardTransTime;
    cardGroup.transition()
        .duration(dur)
        .attr("transform", function() {
            var x = offset - cardX(pointer);
            return "translate(" + x + ", 0)";
        });

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
    if(control === "score" && cardList[pointer + 1].cue) { updateCardIndicator(index); }
}

function cueBlink() {
    cueIndicator.blink(1, 0, 0, score.cueBlinks);
    cueIndicator.selection
        .attr("transform", "translate(" + (cardX(1) + offset) + ", 36)")
        .style("opacity", "1")
        .transition()
        .delay(score.cueDuration)
        .duration(cardTransTime)
        .attr("transform", "translate(" + (cardX(0) + offset) + ", 36)")
        .style("opacity", "0");
}
function cueCancel() {
    // cueIndicator.cancel();
    cueIndicator.selection
        .transition()
        .style("opacity", "0");
}

function updateCardIndicator(pointer) {
    var cardDuration = VS.score.timeAt(pointer + 1) - VS.score.timeAt(pointer),
        blinkDuration = score.cueDuration,
        indicatorTime = cardDuration - blinkDuration;

    VS.score.schedule(indicatorTime, cueBlink);
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
    VS.score.schedule(VS.score.preroll - score.cueDuration, cueBlink);
}

VS.score.pauseCallback = VS.score.stopCallback = function() {
    goToCard();
    cueCancel();
};

VS.control.stepCallback = goToCard;
