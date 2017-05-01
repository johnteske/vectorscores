---
---
var cardTypes, cardList;

{% include_relative _score.js %}
{% include_relative _symbols.js %}

// display
var cardWidth = 120,
    cardPadding = 10,
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
    return offset + (index * (cardWidth + cardPadding));
}

// create cards
var cards = main.selectAll("g")
    .data(cardList)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(" + cardX(i) + ", 100)"; })
    .classed("card", 1)
    .style("opacity", function(d, i) { return 1 - (i * (0.5)); });

cards.append("rect")
        .attr("width", cardWidth - 1)
        .attr("height", cardWidth - 1);

cards.each(function(d) {
    var thisCard = d3.select(this);

    thisCard.selectAll("ellipse")
        .data(d.nNotes).enter()
        .append("ellipse")
            .attr("cx", 5)
            .attr("cy", 5)
            .attr("rx", 4)
            .attr("ry", 5)
            .attr("transform",
                function() {
                    var point = newPoint(d.spread);
                    return "translate(" +
                        (point.x + (cardWidth * 0.5)) + ", " +
                        (point.y + (cardWidth * 0.5) - 5) + ") " + "rotate(60)"; // offset y by 5px note height
                }
            );

    thisCard.append("text")
        .attr("dy", "-1em")
        .text("[" + d.pcSet.join(", ") + "]")
        .classed("pitch-class-set", 1);

    thisCard.append("text")
        .attr("y", cardWidth)
        .attr("dx", "0.125em")
        .attr("dy", "1em")
        .text(dynamicsDict[d.dynamic])
        .classed("dynamics", 1);

});

{% include components/cue.js %}
var cueIndicator = cueTriangle(main);
cueIndicator.selection
    .attr("transform", "translate(" + cardX(1) + ", 50)") // put at right card position
    .style("opacity", "0");

// cards.append("rect")
//     .classed("timer", 1)
//     .attr("y", cardWidth)
//     .attr("width", 0)
//     .attr("height", 1);

function goToCard(eventIndex, dur) {
    var pointer = eventIndex || VS.score.pointer;
    dur = dur || 325;
    cards.transition()
        .attr("transform", function(d, i) {
            // TODO move all cards in a group, not individual cards?
            var pos =
                cardX(i) -
                (offset * pointer) - // move by pointer
                (cardPadding * pointer); // also move by spacing
            return "translate(" + pos + ", 100)";
        })
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
    // updateCardTimer(eventIndex);
}

function updateCardIndicator(pointer) {
    var cardDuration = VS.score.timeAt(pointer + 1) - VS.score.timeAt(pointer),
        indicatorTime = cardDuration - 3000; // start blinking 3 seconds before next card

    VS.score.schedule(indicatorTime, cueIndicator.blink);
}

// function updateCardTimer(pointer) {
//     d3.selectAll(".timer")
//         .transition()
//         .ease("linear")
//         .duration(function(d, i) {
//             if(pointer == i ) {
//                 return VS.score.timeAt(pointer + 1) - VS.score.timeAt(pointer);
//             }
//             else {
//                 return 50;
//             }
//         })
//         .attr("width", function(d, i) {
//             if(pointer == i ) {
//                 return cardWidth - 1;
//             }
//             else {
//                 return 0;
//             }
//         });
// }

// create score events from card times
for(var i = 0; i < cardList.length; i++) {
    VS.score.add(cardList[i].time, goToCard, [i]);
}
// and final noop 3 seconds after last card
VS.score.add(cardList[cardList.length - 1].time + 3000, VS.noop);

VS.score.stepCallback = goToCard;
// VS.score.pauseCallback = updateCardTimer;
VS.score.stopCallback = goToCard;
