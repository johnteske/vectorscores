var txtWidth = 120,
    txtHeight = 60,
    width = 640
    height = 640,
    margin = 12;

var main = d3.select(".main")
    .attr("width", width)
    .attr("height", height);

// main.classed("debug", true);

var ypointer = 0,
    relativePos = 0; // 0 = left, 1 = right

function texturalMsg() {
    var relPos = (ypointer % 2); // easy way to handle, for now
    var newData = [Math.ceil(Math.random() * 9)];//["whatup internet", "o hai"].slice(relPos);
    var newTxt = main
        .data(newData)
        .append("g")
        .attr("transform", function(d, i) {
            var x = margin + (width * relPos) - ((txtWidth + (margin * 2)) * relPos),
                y = (ypointer * txtHeight) + margin;
            return "translate(" + x + ", " + y + ")";
        });
    newTxt.append("rect") // tail, to be masked
        .attr("x", [0,txtWidth][relPos] + (-1 * margin)) // right side not perfect
        .attr("y", txtHeight * 0.75)
        .attr("width", txtWidth * 0.5)
        .attr("height", txtHeight * 0.25);
    newTxt.append("rect") // tail mask
        .classed("mask", true)
        .attr("x", [(-2 * margin) - 1,txtWidth][relPos])
        .attr("y", txtHeight * 0.5)
        .attr("rx", margin)
        .attr("ry", margin)
        .attr("width", margin * 2)
        .attr("height", txtHeight * 0.5);
    newTxt.append("rect") // main message
        .attr("rx", 12)
        .attr("ry", 12)
        .attr("width", txtWidth)
        .attr("height", txtHeight);

    var cloud = newTxt.append("g")
        .attr("transform",
            "translate(" + 0 + ", " + (-1 * txtHeight) + ")"); // set back to (0,0) of txt

    for (var i = 0; i < newData[0]; i++) {
        cloud.append("ellipse")
            .attr("cx", txtWidth * 0.5)
            .attr("cy", txtHeight * 0.5)
            .attr("rx", 4)
            .attr("ry", 5)
            .attr("transform",
                "translate(" +
                    ((txtWidth * 0.5) - (Math.random() * 24) + 6) + ", " +
                    ((txtHeight * 0.5) - (Math.random() * 24) + 6) +
                ") rotate(60)"
            );
    }

    newTxt.style("opacity", "0")
        .transition()
        .duration(300)
        .style("opacity", "1");

    ypointer++;
    // if (ypointer * txtHeight > height) {
    //      // here is where yscroll will be called
    //     var trans = d3.transform(main.selectAll("g").attr("transform")).translate;
    //     // var trans = main.selectAll("g").attr("transform").translate;
    //     console.log(trans);
    //
    //     main.selectAll("g")
    //         // .attr("transform")
    //         .transition()
    //         .attr("transform", function(d, i) {
    //             var x = trans[0],//margin + (width * relPos) - ((txtWidth + (margin * 2)) * relPos),
    //                 y = (i * txtHeight) + margin - txtHeight;
    //             return "translate(" + x + ", " + y + ")";
    //         })
    //         .duration(300);
    //     // console.log(main.selectAll("g").attr("transform"));
    // }
    // relativePos++; console.log(relativePos, relativePos % 2);
}

var button = d3.select(".main"); // click anywhere on svg

button.on("click", function() {
    texturalMsg();
});

texturalMsg(); // create the first message
