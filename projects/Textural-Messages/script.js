var width = 480,
    height = width,
    txtWidth = width * 0.3, // remain fixed
    txtHeight = txtWidth / 2,
    margin = 12,
    transDur = 300,
    maxwidth = 480;

var main = d3.select(".main")
    .attr("width", width)
    .attr("height", height);

var txtWrapper = main.append("g") // for easy scrolling
    .attr("width", width)
    .attr("height", height);

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
        .attr("transform", function() {
            // calc on maxwidth, is scaled later
            var x = ( relPos == 0 ? margin : (maxwidth - txtWidth - margin) ),
                y = (ypointer * txtHeight) + margin;
            return "translate(" + x + ", " + y + ")";
        });

    var pathinfo = makePath(relPos);

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
    scrollWrapper(transDur);
}

function scrollWrapper(dur) {
    var maxheight = maxwidth; //
    if ((ypointer * txtHeight) > (height - margin)) {
        txtWrapper
            .transition()
            .attr("transform", function() {
                var x = 0,
                    y = maxheight - (ypointer * txtHeight) - txtHeight;
                return "scale(" + (width / maxwidth) + "," + (width / maxwidth) + ")" +
                    "translate(" + x + ", " + y + ")";
            })
            .duration(dur);
    } else {
        txtWrapper.attr("transform", "scale(" + (width / maxwidth) + "," + (width / maxwidth) + ")" );
    }
}

// click anywhere on svg to advance
d3.select("main").on("click", function() { texturalMsg(); });

texturalMsg(); // create the first message

// resize

function resize() {
    width = Math.min( parseInt(d3.select("main").style("width"), 10), maxwidth);

    main
        .style("width", width + "px")
        .style("height", width + "px");
    scrollWrapper(0);
}

d3.select(window).on("resize", resize);

resize();
