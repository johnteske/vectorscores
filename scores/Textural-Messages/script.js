---
---
var width = 480,
    height = width,
    txtWidth = width * 0.3, // remain fixed
    txtHeight = txtWidth * 0.75,
    margin = 12,
    transDur = 300,
    maxwidth = 480;

var main = d3.select(".main")
    .attr("width", width)
    .attr("height", height);

var txtWrapper = main.append("g") // for easy scrolling
    .attr("width", width)
    .attr("height", height);

{% include_relative _score.js %}

var noteheads = VS.dictionary.Bravura.durations.stemless;

var ypointer = 0;

// function pointDisp() {
//     return Math.floor((Math.random() * 10) - (Math.random() * 10));
// }

function texturalMsg() {
    var relPos = (ypointer % 2); // simple way to alternate left/right, for now

    var newTxt = txtWrapper.append("g").selectAll(".globject")
        .data([makeGlobject()])
        .enter()
        .append("g")
        .attr("class", "globject")
        .attr("transform", function() {
            // calc on maxwidth, is scaled later
            var x = ( relPos === 0 ? margin : (maxwidth - txtWidth - margin) ),
                y = (ypointer * txtHeight) + margin;
            return "translate(" + x + ", " + y + ")";
        })
        .each(drawGlobject);

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

for(var i = 0; i < 16; i++) {
    VS.score.add(
        (i * 1000) + (500 * Math.random()),
        texturalMsg
    );
}

texturalMsg(); // create the first message


/**
 * Resize
 */
function resize() {
    width = Math.min( parseInt(d3.select("main").style("width"), 10), maxwidth);

    main
        .style("width", width + "px")
        .style("height", width + "px");
    scrollWrapper(0);
}

resize();

d3.select(window).on("resize", resize);
