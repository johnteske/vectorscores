debug = VS.getQueryString("debug") == 1 ||  false;

if(debug) {
    score.svg.append("line")
        .classed("debug-center-v", true);
}

function resizeDebug() {
    d3.select("line.debug-center-v")
        .attr("x1", view.center)
        .attr("y1", 0)
        .attr("x2", view.center)
        .attr("y2", 2000);
}
