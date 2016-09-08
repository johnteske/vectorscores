var txtWidth = 120,
    txtHeight = 60,
    width = 480
    height = 480,
    margin = 12,
    transDur = 300;

var main = d3.select(".main")
    .attr("width", width)
    .attr("height", height);

var txtWrapper = main.append("g"); // for easy scrolling

// main.classed("debug", true);

var ypointer = 0;

function pointDisp() {
    return Math.floor((Math.random() * 10) - (Math.random() * 10));
}

function makePath(relPos) {
    return [
        {x: margin, y: pointDisp()},
        {x: txtWidth-margin, y: pointDisp()},
        {x: txtWidth, y: margin + pointDisp()},
        {x: txtWidth, y: txtHeight-margin+pointDisp()},
        {x: txtWidth + margin * (relPos), y:txtHeight}, // tail
        {x: txtWidth-margin, y:txtHeight+pointDisp()},
        {x: margin, y: txtHeight+pointDisp()},
        {x: margin * (relPos-1), y:txtHeight}, // tail
        {x: 0, y: txtHeight-margin+pointDisp()},
        {x: 0, y: margin + pointDisp()}
    ];
}

function texturalMsg() {
    var relPos = (ypointer % 2); // simple way to alternate left/right, for now
    var newData = [Math.ceil(Math.random() * 9)];
    var newTxt = txtWrapper
        .data(newData)
        .append("g")
        .attr("transform", function(d, i) {
            var x = margin + (width * relPos) - ((txtWidth + (margin * 2)) * relPos),
                y = (ypointer * txtHeight) + margin;
            return "translate(" + x + ", " + y + ")";
        });

    pathinfo = makePath(relPos);

    var d3line2 = d3.svg.line()
        .x(function(d){return d.x;})
        .y(function(d){return d.y;})
        .interpolate("basis-closed");
    newTxt.append("path")
        .attr("d", d3line2(pathinfo))
        .style("stroke-width", 2)
        .style("stroke", "#eee")
        .style("fill", "#eee");

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
        .duration(transDur)
        .style("opacity", "1");

    ypointer++;
    if ((ypointer * txtHeight) > (height - margin)) {
        txtWrapper
            .transition()
            .attr("transform", function(d, i) {
                var x = 0,
                    y = height - (ypointer * txtHeight) - txtHeight; //+ margin - txtHeight;
                return "translate(" + x + ", " + y + ")";
            })
            .duration(transDur);
    }
}

var button = d3.select(".main"); // click anywhere on svg

button.on("click", function() {
    texturalMsg();
});

texturalMsg(); // create the first message
