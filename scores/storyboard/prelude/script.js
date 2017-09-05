---
layout: compress-js
---

var score = {
    totalDuration: 481 // originally timed for 481 s // TODO do not scale chord hits (keep at 1–2 s)
};

{% include_relative _score.js %}
{% include_relative _settings.js %}

var dynamicsDict = VS.dictionary.Bravura.dynamics;

// display
var cardWidth = 120,
    cardPadding = 12,
    cardTransTime = 600,
    offset = cardWidth,
    width = (cardWidth * 4) + (cardPadding * 2),
    height = cardWidth * 3;

var main = d3.select(".main")
    .attr("width", width)
    .attr("height", height);

function cardX(index) {
    return index * (cardWidth + cardPadding);
}

function makeCard(data) {
    var selection = d3.select(this);

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
cueIndicator.selection
    .attr("transform", "translate(" + (cardX(1) + offset) + ", 50)") // put at right card position
    .style("opacity", "0");

function goToCard(eventIndex, dur) {
    var pointer = eventIndex || VS.score.pointer;
    dur = dur || cardTransTime;
    cardGroup.transition()
        .duration(dur)
        .attr("transform", function() {
            var x = offset - cardX(pointer);
            return "translate(" + x + ", 0)";
        });

    cards.transition()
        .duration(dur)
        .style("opacity", function(d, i) {
            if(pointer > i ){
                return 0;
            }
            else {
                return (0.5 * (pointer - i)) + 1;
            }
        });

    // if playing and not skipping, stopping
    if(typeof eventIndex !== "undefined") { updateCardIndicator(eventIndex); }
}

function updateCardIndicator(pointer) {
    var cardDuration = VS.score.timeAt(pointer + 1) - VS.score.timeAt(pointer),
        blinkDuration = 3000,
        indicatorTime = cardDuration - blinkDuration;

    VS.score.schedule(indicatorTime, function() {
        cueIndicator.blink();
        cueIndicator.selection
            .style("opacity", "1")
            .transition()
            .delay(blinkDuration)
            .duration(cardTransTime)
            .style("opacity", "0");
    });
}

var addEvent = (function() {
    var time = 0;

    return function(fn, duration, args) {
        VS.score.add(time, fn, args);
        time += duration;
    };
})();

// create score events from card durations
for(var i = 0; i < cardList.length; i++) {
    var scaledDuration = cardList[i].duration * 1000 * (score.totalDuration / 481);

    addEvent(goToCard, scaledDuration, [i]);
}
// and final noop after last card
addEvent(VS.noop);

VS.control.stepCallback = goToCard;
VS.score.stopCallback = goToCard;
