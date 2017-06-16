---
---
var width = 480,
    height = width,
    txtWidth = width * 0.3, // remain fixed
    txtHeight = 180, // 220px from inspector
    margin = 12,
    transDur = 600,
    maxwidth = 480;

var main = d3.select(".main")
    .attr("width", width)
    .attr("height", height);

var txtWrapper = main.append("g") // for easy scrolling
    .attr("width", width)
    .attr("height", height);

{% include_relative _score.js %}
{% comment %}{% include_relative _settings.js %}{% endcomment %}

var noteheads = VS.dictionary.Bravura.durations.stemless;

var ypointer = 0; // TODO ypointer should refer to current y position, not score index--use VS.score.pointer for that

function texturalMsg(position) {
    var relPos = position === 'left' ? 0 : 1;
    // (ypointer % 2); // simple way to alternate left/right, for now

    var newTxt = txtWrapper.append("g").selectAll(".globject")
        .data([makeGlobject()])
        .enter()
        .append("g")
        .attr("class", "globject")
        .style('opacity', 0) // fade
        .attr("transform", function() {
            // calc on maxwidth, is scaled later
            var x = ( relPos === 0 ? margin : (maxwidth - txtWidth - margin) ),
                y = (ypointer * txtHeight) + margin;
            return "translate(" + x + ", " + y + ")";
        })
        .each(drawGlobject);

    newTxt.selectAll(".globstuff")
        .insert("rect", ":first-child")
            .attr("fill", "#eee")
            .attr("x", -20)
            .attr("width", 120 + 40)
            .attr("height", 127);

    newTxt.transition().duration(300)
        .style('opacity', 1); // fade

    ypointer++;
    lastPos = relPos;
    scrollWrapper(transDur);
}

function scrollWrapper(dur) {
    if ((ypointer * txtHeight) > (height - margin)) {
        txtWrapper
            .transition()
            .attr("transform", function() {
                var x = 0,
                    y = height - (ypointer * txtHeight) - txtHeight;
                return "scale(" + (width / maxwidth) + "," + (width / maxwidth) + ")" +
                    "translate(" + x + ", " + y + ")";
            })
            .duration(dur);
    } else {
        txtWrapper.attr("transform", "scale(" + (width / maxwidth) + "," + (width / maxwidth) + ")" );
    }
}

var lastPos = ''; // TODO make these calculations in score
for(var i = 0; i < 16; i++) {
    lastPos = VS.getWeightedItem([lastPos, lastPos === 'left' ? 'right' : 'left'], [0.2, 0.8]);
    VS.score.add(
        (i * 8000) + (4000 * Math.random()),
        texturalMsg,
        [lastPos]
    );
}


/**
 * Resize
 */
function resize() {
    width = Math.min( parseInt(d3.select("main").style("width"), 10), maxwidth);
    height = parseInt(d3.select("main").style("height"), 10);

    main
        .style("width", width + "px")
        .style("height", height + "px");
    scrollWrapper(0);
}

resize();

d3.select(window).on("resize", resize);
