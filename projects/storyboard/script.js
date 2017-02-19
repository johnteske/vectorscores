var cards = [],
    cardChoices = ["A", "B", "C", "D", "E"]; // rando rondo

function makeCards(n) {
    for (var i = 0; i < n; i++) {
        var lastCard = cards[i-1];
        do {
            var newCard = Math.floor(Math.random() * cardChoices.length);
        } while (cardChoices[newCard] == lastCard); // do not repeat cards
        cards.push(cardChoices[newCard]);
    }
}
makeCards(20);

// display
var cardWidth = 120,
    cardPadding = 10,
    offset = cardWidth,
    width = (cardWidth * 4) + (cardPadding * 2),
    height = cardWidth * 3;

var main = d3.select(".main")
    .attr("width", width)
    .attr("height", height);

// create cards
var card = main.selectAll("g")
    .data(cards)
    .enter().append("g")
    .attr("transform", function(d, i) { var pos = offset + (i * (cardWidth + cardPadding)); return "translate(" + pos + ", 100)"; })
    .style("opacity", function(d, i) { return 1 - (i * (0.5)); })
    .each(function(d) {
        var thisCard = d3.select(this),
            indexOfCardChoice = cardChoices.indexOf(d),
            // simple dummy data: 1-21 notes, based on card
            numNotes = "abcdefghijklmnopqrstuvwxyz".substr(0, 1 + (indexOfCardChoice * 5)),
            txtSpread = [
                {x: 0, y: 0}, // A single note
                {x: 0, y: 24}, // B chord, cluster
                {x: 56, y: 0}, // C rhythm
                {x: 56, y: 24}, // D rect cloud
                {x: 48, y: 48} // E cloud
            ][indexOfCardChoice];

        // thisCard.append("text").text(d + indexOfCardChoice); // debug

        thisCard.selectAll("ellipse")
            .data(numNotes).enter()
            .append("ellipse")
                .attr("cx", 5)
                .attr("cy", 5)
                .attr("rx", 4)
                .attr("ry", 5)
                // TODO non-rectangular spread
                .attr("transform",
                    function() {
                        return "translate(" +
                            ((Math.random() * txtSpread.x) + (cardWidth / 2) - (txtSpread.x / 2)) + ", " +
                            ((Math.random() * txtSpread.y) + (cardWidth / 2) - (txtSpread.y / 2)) +
                        ") rotate(60)"; }
                );
    });

card.append("rect")
    .attr("width", cardWidth - 1)
    .attr("height", cardWidth - 1);

function goToCard(dur) {
    var pointer = VS.score.pointer;
    card.transition()
    .attr("transform", function(d, i) {
        var pos =
            offset
            + (i * (cardWidth + cardPadding))
            - (offset * pointer) // move by pointer
            - (cardPadding * pointer); // also move by spacing
        return "translate(" + pos + ", 100)";
    })
    .duration(dur || 600)
    .style("opacity", function(d, i) {
        if(pointer > i ){
            return 0;
        }
        else {
            return (0.5 * (pointer - i)) + 1;
        }
    });
}

for(var i = 0; i < cards.length; i++) {
    var time = (i * 1500) + (Math.random() * 750);
    VS.score.add([time, goToCard]);
}

VS.score.stepCallback = function() { goToCard(300); };
VS.score.stopCallback = goToCard;
