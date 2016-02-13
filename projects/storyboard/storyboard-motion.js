var cards = [
    ["one"],
    ["two"],
    ["three"],
    ["three"],
    ["three"],
    ["three"],
    ["three"],
    ["three"],
    ["three"],
    ["four"]
];

var cardWidth = 120,
    cardPadding = 10,
    offset = cardWidth,
    width = (cardWidth * 4) + (cardPadding * 2),
    height = cardWidth * 3;

var main = d3.select(".main")
    .attr("width", width)
    .attr("height", height);

var card = main.selectAll("g")
    .data(cards)
    .enter().append("g")
    .attr("transform", function(d, i) { var pos = offset + (i * (cardWidth + cardPadding)); return "translate(" + pos + ", 100)"; })
    .style("opacity", function(d, i) { return 1 - (i * (0.5)) });

card.append("rect")
    .attr("width", cardWidth - 1)
    .attr("height", cardWidth - 1);

card.append("text")
    .attr("x", cardWidth / 2)
    .attr("y", cardWidth / 2)
    .attr("dy", ".35em")
    // .attr("dx", "-.35em")
    .text(function(d, i) { return i; });

var button = d3.select(".main"); // click anywhere on svg
var pointer = 0;
button.on("click", function() {
    if (pointer < cards.length)
    {
        pointer++;
        card.transition()
        .attr("transform", function(d, i) {
            var pos =
                offset +
                (i * (cardWidth + cardPadding))
                - (offset * pointer) // move by pointer
                - (cardPadding * pointer); // also move by spacing
            return "translate(" + pos + ", 100)";
        })
        .duration(600)
        .style("opacity", function(d, i) {
            if(pointer > i ){
                return 0;
            }
            else {
                return (0.5 * (pointer - i)) + 1;
            }
        });
    }
})
