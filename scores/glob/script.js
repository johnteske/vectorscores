---
layout: compress-js
---
var canvas = {
        margins: 20,
        maxWidth: 400,
        width: null,
        center: null
    },
    transitionTime = {
        long: 5000,
        short: 600
    },
    scoreLength = 12,
    textoffset = 5,
    debug = VS.getQueryString("debug") == 1 || false,
    main = d3.select(".main");

{% include_relative _glob.js %}
{% include_relative _settings.js %}

function newPoint() {
    var radius = VS.getRandExcl(1, 96),
        angle = Math.random() * Math.PI * 2,
        dist = Math.random() - Math.random();
    return {
        x: Math.cos(angle) * radius * dist,
        y: Math.sin(angle) * radius * dist
    };
}

var glob = new Glob(main, 20);
glob.width = 240;
glob.group.selectAll("text")
    .data(glob.data).enter()
    .append("text")
    .classed("glob-child", 1)
    .text(function() { return VS.getItem(["\uf46a", "\uf46a\u2009\uf477", "\uf469"]); });
glob.children = d3.selectAll("text");

glob.pitchSet = main.append("text")
    .classed("pc-set", 1)
    .style("opacity", "0"); // init value

glob.move = function(dur) {
    glob.pitchSet
        .attr("x", canvas.center)
        .attr("y", canvas.width - textoffset)
        .text(function() {
            var pcSet = [0, VS.getItem([1, 2, 3]), VS.getItem([4, 5, 6])].map(function(pc) {
                return pcFormat(pc, scoreSettings.pcFormat);
            });
            return "[" + pcSet.join(", ") + "]";
        })
        // fade in if needed
        .transition().duration(transitionTime.short)
        .style("opacity", "1");

    glob.children
        .transition().duration(dur)
        .attr("transform", function() {
            var point = newPoint();
            return "translate(" + point.x + ", " + point.y + ")";
        });
};

for(var i = 0; i < scoreLength; i++) {
    VS.score.add(i * transitionTime.long, glob.move, [transitionTime.long]);
}
// final event
VS.score.add(scoreLength * transitionTime.long, function() {
    d3.select(".pc-set")
        .transition().duration(transitionTime.short)
        .style("opacity", "0");
});

VS.score.preroll = 1000;

VS.control.stepCallback = function() {
    glob.move(null, transitionTime.short);
};

VS.score.stopCallback = function() {
    glob.pitchSet
        .transition().duration(transitionTime.short)
        .style("opacity", "0");
    glob.children
        .transition().duration(transitionTime.short)
        .attr("transform", "translate(0, 0)");
};


// resize

d3.select(window).on("resize", resize);

function resize() {
    // update width
    canvas.width = Math.min( parseInt(d3.select("main").style("width"), 10), canvas.maxWidth);
    canvas.center = canvas.width * 0.5;
    var innerwidth = canvas.width - (canvas.margins * 2);

    main
        .style("width", canvas.width + "px")
        .style("height", canvas.width + "px");
    glob.group.attr("transform",
        "translate(" + canvas.center + ", " + canvas.center + ")" +
        "scale(" + (canvas.width / glob.width) + "," + (canvas.width / glob.width) + ")"
        );
    glob.pitchSet
        .attr("x", canvas.center)
        .attr("y", canvas.width - textoffset);

    if(debug){
        d3.select("rect")
            .attr("width", innerwidth)
            .attr("height", innerwidth);
        d3.select("circle")
            .attr("transform", "translate(" + canvas.center + ", " + canvas.center + ")");
    }
}

resize();

if(debug) {
    main.classed("debug", true);
    main.append("rect")
        .attr("width", canvas.width - (canvas.margins * 2))
        .attr("height", canvas.width - (canvas.margins * 2))
        .attr("transform", "translate(" + canvas.margins + ", " + canvas.margins + ")");
    main.append("circle")
        .attr("r", 5)
        .attr("transform", "translate(" + canvas.center + ", " + canvas.center + ")");
}
