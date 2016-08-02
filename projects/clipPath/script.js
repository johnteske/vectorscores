var margin = 20,
    innerwidth = 240, // placeholder name
    maxwidth = 480,
    width = innerwidth + (margin * 2),
    center = width * 0.5;

var main = d3.select(".main")
    .style('width', width + 'px')
    .style('height', width + 'px');

// CLIPPY
var globRect = {x: 0, y: 0, h: 100, w: 200};

main.append("clipPath")
    .attr("id", "ellipse-clip")
.append("ellipse")
    .attr("cx", globRect.w / 2)
    .attr("cy", globRect.h / 2)
    .attr("rx", globRect.w / 2)
    .attr("ry", globRect.h / 2);

// GLOB
var group = main
    .append("g")
    .attr("clip-path", "url(#ellipse-clip)")
    .attr("height", globRect.h)
    .attr("width", globRect.w);
    // .attr("transform", "translate(" + (center - (globRect.w / 5)) + ", " + (center + (globRect.h / 2)) + ")");

    group.append("rect")
        .style("fill", "lightgrey")
        .attr("height", globRect.h)
        .attr("width", globRect.w);

    for (var i = 0; i < 128; i++) {
        group.append("ellipse")
            .attr("rx", 4)
            .attr("ry", 5)
            .attr("transform",
            function() {
                return "translate(" +
                    (Math.random() * globRect.w) + ", " +
                    (Math.random() * globRect.h) +
                ") rotate(60)"
            });
    }

// RESIZE
d3.select(window).on('resize', resize);

function resize() {
    // update width
    width = Math.min( parseInt(d3.select('main').style('width'), 10), maxwidth);
    center = width * 0.5;
    innerwidth = width - (margin * 2);

    main
    .style('width', width + 'px')
    .style('height', width + 'px');

    group.attr("transform", "translate(" + (center - (globRect.w / 2)) + ", " + (center - (globRect.h / 2)) + ")");

}

// DEBUG
// main.classed("debug", true);

resize();
