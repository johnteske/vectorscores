---
---
var cardTypes, cardList;

{% include_relative _score.js %}
{% include_relative _settings.js %}

var dynamicsDict = VS.dictionary.Bravura.dynamics,
    durationDict = VS.dictionary.Bravura.durations.stemless;

// display
var cardWidth = 120,
    cardPadding = 10,
    cardTransTime = 600,
    offset = cardWidth,
    width = (cardWidth * 4) + (cardPadding * 2),
    height = cardWidth * 3;

var main = d3.select(".main")
    .attr("width", width)
    .attr("height", height);

function newPoint(spread) {
    var angle = Math.random() * Math.PI * 2;
    return {
        x: Math.cos(angle) * spread.x * VS.getRandExcl(-1, 1),
        y: Math.sin(angle) * spread.y * VS.getRandExcl(-1, 1)
    };
}
function cardX(index) {
    return index * (cardWidth + cardPadding);
}

function makeCard(selection) {
    selection.append("rect")
        .attr("width", cardWidth - 1)
        .attr("height", cardWidth - 1);

    selection.each(function(d, i) {
        var nnotes = d.nnotes,
            spread = d.spread;

        d3.select(this).selectAll(".duration")
            .data(d3.range(0, nnotes))
            .enter()
            .append("text")
            .attr("class", "duration")
            .text(durationDict["1"])
            .attr("transform", function() {
                var point = newPoint(spread);
                return "translate(" +
                    (point.x + (cardWidth * 0.5)) + ", " +
                    (point.y + (cardWidth * 0.5)) + ")";
            });
    });

    selection.append("text")
        .attr("dy", "-1em")
        .text(function(d) {
            var pcSet = d.pcSet.map(function(pc) {
                return pcFormat(pc, scoreSettings.pcFormat);
            });
            return "[" + pcSet.join(", ") + "]";
        })
        .classed("pitch-class-set", 1);

    selection.append("text")
        .attr("y", cardWidth)
        .attr("dx", "0.125em")
        .attr("dy", "1em")
        .text(function(d) { return dynamicsDict[d.dynamic]; })
        .classed("dynamics", 1);
}
// create cards
var cardGroup = main.append("g")
    .attr("transform", "translate(" + offset + ", 0)");
var cards = cardGroup.selectAll(".card")
    .data(cardList)
    .enter()
    .append("g")
    .classed("card", 1)
    .call(makeCard)
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

// create score events from card times
for(var i = 0; i < cardList.length; i++) {
    VS.score.add(cardList[i].time, goToCard, [i]);
}
// and final noop 3 seconds after last card
VS.score.add(cardList[cardList.length - 1].time + 3000, VS.noop);

VS.control.stepCallback = goToCard;
VS.score.stopCallback = goToCard;
